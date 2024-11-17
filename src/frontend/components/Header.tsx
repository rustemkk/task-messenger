import { useRouter } from '@tanstack/react-router';
import React, { useContext } from 'react';
import { AuthContext } from '../utils/contexts';

const Header = () => {
  const router = useRouter();
  const { me, setMe } = useContext(AuthContext);

  const onLogOut = () => {
    setMe(null);
    router.navigate({ to: '/login' });
  };

  return (
    <div
      style={{
        height: '60px',
        position: 'sticky',
        top: '0px',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottom: '1px solid black',
      }}
    >
      {me && <div>Current username: {me?.username}</div>}
      <div className="p-2 flex gap-2">
        <button onClick={onLogOut}>Logout</button>
      </div>
    </div>
  );
};

export default Header;
