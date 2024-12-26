import React from 'react';
import { AuthContext, useAuthProvider } from '../../hooks/useAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthProvider();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};