import { MESSAGES_PAGINATION_SIZE } from '../../constants';
import dbService from '../db/db';

const getMessages = async (req: Request): Promise<Response> => {
  const accountId = Number(req.headers.get('accountId'));
  const url = new URL(req.url);
  const companionId = Number(url.searchParams.get('companionId'));
  const page = Number(url.searchParams.get('page'));
  const limit = Number(url.searchParams.get('limit')) || MESSAGES_PAGINATION_SIZE;
  if (!companionId) {
    return new Response('Invalid data', { status: 400 });
  }

  const messages = dbService.getMessages(accountId, companionId, page, limit);

  return new Response(JSON.stringify(messages), { status: 200 });
};

const postMessage = async (req: Request): Promise<Response> => {
  const accountId = Number(req.headers.get('accountId'));
  const { toId, content } = await req.json();
  if (!toId || !content) {
    return new Response('Invalid data', { status: 400 });
  }

  const message = dbService.createMessage(accountId, toId, content);

  return new Response(JSON.stringify(message), { status: 200 });
};

export const messagesRoutes: Record<string, (req: Request) => Promise<Response>> = {
  ['GET:/api/messages']: getMessages,
  ['POST:/api/messages']: postMessage,
};
