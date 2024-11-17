import React from 'react';
import { useParams } from '@tanstack/react-router';
import MessageInput from './MessageInput';
import MessagesList from './MessagesList';
import { useCreateMessageMutation } from '../utils/hooks';

const ChatPage = () => {
  const companionId = Number(useParams({ strict: false }).chatId);
  const createMessageMutation = useCreateMessageMutation();

  const onMessegeSend = async (content: string) => {
    await createMessageMutation.mutateAsync({ toId: companionId, content });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '100%',
        justifyContent: 'center',
      }}
    >
      <MessagesList companionId={companionId} />
      <MessageInput disabled={createMessageMutation.isPending} onSend={onMessegeSend} />
    </div>
  );
};

export default ChatPage;
