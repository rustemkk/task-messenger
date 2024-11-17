import { Database } from 'bun:sqlite';
import fs from 'fs';
import path from 'path';
import type { Account, Message } from '../../types';

const MIGRATIONS_FOLDER = path.join(import.meta.dir, 'migrations');

class DBService {
  db: Database;

  constructor() {
    this.db = new Database(path.join(MIGRATIONS_FOLDER, './../db.sqlite'));
  }

  getMigrationFileContent(migrationFileName: string) {
    const content = fs.readFileSync(path.join(MIGRATIONS_FOLDER, migrationFileName), 'utf-8');

    return content;
  }

  migrate() {
    this.db.run(this.getMigrationFileContent('000_create_migrations.sql'));

    const appliedMigrations = this.db
      .query(`SELECT name FROM migrations`)
      .all()
      .map((m: unknown) => (m as { name: string }).name);
    const migrationFiles = fs.readdirSync(MIGRATIONS_FOLDER).sort();

    for (const migrationFileName of migrationFiles) {
      const migrationName = path.basename(migrationFileName);
      if (!appliedMigrations.includes(migrationName)) {
        const sql = this.getMigrationFileContent(migrationFileName);
        this.db.run(sql);
        this.db.run(`INSERT INTO migrations (name) VALUES (?)`, [migrationName]);
      }
    }
  }

  getAccounts = () => {
    return this.db.query(`SELECT * FROM accounts;`).all();
  };

  getAccountsWithLatestMessage = (accountId: number): Account[] => {
    const results = this.db
      .query(
        `
        SELECT
          a.id,
          a.username,
          m.id AS latestMessage_id,
          m.from_id AS latestMessage_from_id,
          m.to_id AS latestMessage_to_id,
          m.content AS latestMessage_content,
          m.sent_at AS latestMessage_sent_at
        FROM accounts a
        LEFT JOIN messages m ON (m.from_id = a.id AND m.to_id = $account_id) OR (m.to_id = a.id AND m.from_id = $account_id)
        WHERE a.id != $account_id
        GROUP BY a.id
        ORDER BY m.sent_at DESC;
        `
      )
      .all({ $account_id: accountId });

    return results.map((r: any) => ({
      id: r.id,
      username: r.username,
      latestMessage: !r.latestMessage_id
        ? null
        : {
            id: r.latestMessage_id,
            from_id: r.latestMessage_from_id,
            to_id: r.latestMessage_to_id,
            content: r.latestMessage_content,
            sent_at: r.latestMessage_sent_at,
          },
    }));
  };

  getAccountByUsername = (username: string) => {
    return this.db.query('SELECT * FROM accounts WHERE username = $username;').get({ $username: username });
  };

  getAccountById = (accountId: number) => {
    return this.db.query('SELECT * FROM accounts WHERE id = $accountId;').get({ $accountId: accountId });
  };

  createAccount = (username: string) => {
    this.db.query('INSERT INTO accounts (username) VALUES ($username);').run({ $username: username });

    return this.getAccountByUsername(username);
  };

  getMessages = (accountId: number, companionId: number, page: number, limit: number): Message[] => {
    const offset = (page - 1) * limit;
    return this.db
      .query(
        `
        SELECT *
        FROM messages
        WHERE (from_id = $accountId AND to_id = $companionId) OR (from_id = $companionId AND to_id = $accountId)
        ORDER BY sent_at DESC LIMIT $limit OFFSET $offset;
        `
      )
      .all({ $accountId: accountId, $companionId: companionId, $limit: limit, $offset: offset }) as Message[];
  };

  getMessage = (id: string): Message => {
    return this.db.query(`SELECT * FROM messages WHERE id = $id;`).get({ $id: id }) as Message;
  };

  createMessage = (fromId: number, toId: number, content: string): Message => {
    const messageId = crypto.randomUUID();
    this.db
      .query(
        'INSERT INTO messages (id, from_id, to_id, content, sent_at) VALUES ($id, $fromId, $toId, $content, $sentAt);'
      )
      .run({
        $id: messageId,
        $fromId: fromId,
        $toId: toId,
        $content: content,
        $sentAt: new Date().toISOString(),
      });

    return this.getMessage(messageId);
  };
}

export default new DBService();
