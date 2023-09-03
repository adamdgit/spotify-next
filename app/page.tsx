'use client'

import { useSession } from 'next-auth/react'
import Library from './components/Library';
import Home from './components/Home';
import Search from './components/Search';
import { useContext, useEffect, useState } from 'react';
import Header from './components/Header';
import Player from './components/Player';
import { spotifyAPI } from './api/auth/[...nextauth]/route';

export default function Login() {

  const { data: session } = useSession();
  const [navigation, setNav] = useState(0);

  async function setupSpotifyAPI() {

    if (!session?.accessToken) return
    // provide spotifyAPI library with access token
    await spotifyAPI.setAccessToken(session?.accessToken);
  }

  useEffect(() => {
    setupSpotifyAPI()
  },[session])

  return (
    <>
    <Header setNav={setNav} />
    {
      navigation === 0 ? <Home />
      : navigation === 1 ? <Search />
      : <Library />
    }
    {
      session?.accessToken && <Player accessToken={session?.accessToken} />
    }
    </>
  )
}
