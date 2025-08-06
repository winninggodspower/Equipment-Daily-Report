'use client';

import { SessionProvider } from 'next-auth/react';

export default function NextSessionProviders({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}