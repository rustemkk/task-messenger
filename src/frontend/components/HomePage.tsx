import React from 'react';
import { useAccounts } from '../utils/hooks';
import type { Account } from '../../types';
import { useRouter } from '@tanstack/react-router';

const HomePage = () => {
  const router = useRouter();
  const accountsQuery = useAccounts();

  return (
    <div style={{ padding: '12px 24px 36px 24px' }}>
      {accountsQuery?.data?.map((account: Account) => (
        <div
          key={account.id}
          onClick={() => router.navigate({ to: `/chats/${account.id}` })}
          style={{ cursor: 'pointer', padding: '24px', border: '1px solid black' }}
        >
          Username: {account.username}
          <br />
          {account.latestMessage && <div>Latest message: {account.latestMessage.content}</div>}
        </div>
      ))}
    </div>
  );
};

export default HomePage;
