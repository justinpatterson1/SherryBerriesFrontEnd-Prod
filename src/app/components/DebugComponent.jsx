'use client';

import { useSession } from 'next-auth/react';

const DebugSession = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading session...</p>;

  return (
    <div>
      <h2>Session Debug</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};

export default DebugSession;
