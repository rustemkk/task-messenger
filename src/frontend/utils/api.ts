import { MESSAGES_PAGINATION_SIZE } from '../../constants';

const getRequestHeaders = (username?: string) => {
  const me = JSON.parse(localStorage.getItem('me') || '{}');

  return {
    'Content-Type': 'application/json',
    accountId: me?.id || '',
    accountUsername: me?.username || username || '',
  };
};

export const getAccounts = async () => {
  return await fetch('/api/accounts', {
    method: 'GET',
    headers: getRequestHeaders(),
  }).then((res) => res.json());
};

export const getAccountById = async (accoutId: number) => {
  return await fetch(`/api/accounts/${accoutId}`, {
    method: 'GET',
    headers: getRequestHeaders(),
  }).then((res) => res.json());
};

export const getMe = async (username?: string) => {
  return await fetch(`/api/accounts/me`, {
    method: 'GET',
    headers: getRequestHeaders(username),
  }).then((res) => res.json());
};

export const getMessages = async (companionId: number, page = 0) => {
  return await fetch(`/api/messages?companionId=${companionId}&page=${page + 1}&limit=${MESSAGES_PAGINATION_SIZE}`, {
    method: 'GET',
    headers: getRequestHeaders(),
  }).then((res) => res.json());
};

export const createMessage = async (toId: number, content: string) => {
  return await fetch('/api/messages', {
    method: 'POST',
    headers: getRequestHeaders(),
    body: JSON.stringify({ toId: toId, content: content }),
  }).then((res) => res.json());
};
