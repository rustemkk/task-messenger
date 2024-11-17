CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    from_id INTEGER NOT NULL REFERENCES accounts(id),
    to_id INTEGER NOT NULL REFERENCES accounts(id),
    content TEXT NOT NULL,
    sent_at TIMESTAMP NOT NULL
) WITHOUT ROWID;

CREATE INDEX idx_messages_from_id ON messages (from_id);
CREATE INDEX idx_messages_to_id ON messages (to_id);
CREATE INDEX idx_messages_sent_at ON messages (sent_at DESC);
CREATE INDEX idx_messages_from_to_sent ON messages (from_id, to_id, sent_at DESC);
