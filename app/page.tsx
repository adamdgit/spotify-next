'use client'

import { signOut, useSession } from 'next-auth/react'

export default function Login() {

  const session = useSession();

  return (
    <main>
      <button onClick={() => signOut()}>Signout</button>
      <h1>Logged in</h1>
      <p>{session.data?.accessToken}</p>
      <p>{session.data?.expires}</p>
      <p>{session.data?.userId}</p>
      <p>{session.data?.user?.name}</p>
    </main>
  )
}
