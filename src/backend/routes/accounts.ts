import dbService from '../db/db';
import { parsePathParameters } from '../utils';

const getAccounts = async (req: Request): Promise<Response> => {
  const accountId = Number(req.headers.get('accountId'));
  const accounts = dbService.getAccountsWithLatestMessage(accountId);

  return new Response(JSON.stringify(accounts), { status: 200 });
};

const getAccount = async (req: Request): Promise<Response> => {
  const accountId = Number(parsePathParameters(req, '/api/accounts/$accountId').accountId);

  let account = dbService.getAccountById(accountId);
  if (!account) {
    return new Response('Not Found', { status: 404 });
  }

  return new Response(JSON.stringify(account), { status: 200 });
};

const getMe = async (req: Request): Promise<Response> => {
  const accountUsername = req.headers.get('accountUsername') || '';

  let account = dbService.getAccountByUsername(accountUsername);
  if (!account) {
    dbService.db.query('INSERT INTO accounts (username) VALUES ($username)').run({ $username: accountUsername });
    account = dbService.getAccountByUsername(accountUsername);
  }

  return new Response(JSON.stringify(account), { status: 200 });
};

export const accountsRoutes: Record<string, (req: Request) => Promise<Response>> = {
  ['GET:/api/accounts']: getAccounts,
  ['GET:/api/accounts/me']: getMe,
  ['GET:/api/accounts/$accountId']: getAccount,
};
