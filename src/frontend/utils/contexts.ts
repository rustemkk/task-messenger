import React, { createContext } from 'react';

type AuthValueType = {
  me: any;
  setMe: (me: any) => void;
};

export const AuthContext = createContext<AuthValueType>({ me: null, setMe: () => {} });
