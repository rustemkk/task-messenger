import React, { Fragment, Suspense, useContext } from 'react';
import { AuthContext } from '../utils/contexts';
import { useAccountById, useMessages } from '../utils/hooks';
import type { Message } from '../../types';

const MessagesList = ({ companionId }: { companionId: number }) => {
  const messagesQuery = useMessages(companionId);
  const accountQuery = useAccountById(companionId);
  const { me } = useContext(AuthContext);

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        padding: '24px',
        height: '100%',
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        {messagesQuery?.data?.pages.map((group, index) => (
          <Fragment key={index}>
            {group.map((m: Message) => (
              <div
                key={m.id}
                style={{
                  textAlign: m.from_id === companionId ? 'left' : 'right',
                  border: '1px solid black',
                  backgroundColor: '#f1f1f1',
                  padding: '12px',
                  marginBottom: '6px',
                }}
              >
                <div style={{ fontSize: '12px', marginBottom: '6px' }}>
                  {m.from_id === companionId ? accountQuery?.data?.username : me.username}
                </div>
                <div>{m.content}</div>
                <div style={{ fontSize: '12px', marginTop: '6px' }}>{new Date(m.sent_at).toLocaleString()}</div>
              </div>
            ))}
          </Fragment>
        ))}
      </Suspense>
      {messagesQuery.hasNextPage && (
        <button
          disabled={messagesQuery?.isFetchingNextPage}
          onClick={() => messagesQuery?.fetchNextPage()}
          style={{ marginBottom: '12px' }}
        >
          Load more messages...
        </button>
      )}
    </div>
  );
};

export default MessagesList;
