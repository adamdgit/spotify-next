'use client'

import { useContext, useEffect } from 'react';
import styles from './styles.module.css'
import { useSession } from 'next-auth/react';
import { GlobalStateContext, contextProps } from '../providers';
import { spotifyAPI } from '../api/auth/[...nextauth]/route';
import { useRouter } from 'next/navigation';
import Profile from './Profile';

export default function Header(){

  const { data: session } = useSession();
  const { deviceId } = useContext(GlobalStateContext) as contextProps

  const router = useRouter();

  // Setup session in Header because it is first component to mount
  // and we need access token set inside spotifyAPI for calls later on
  async function setupSpotifyAPI() {
    // provide spotifyAPI library with access token
    await spotifyAPI.setAccessToken(session?.accessToken)

    if (!deviceId) return
    // device randomly disconnects, this should reset playback
    await spotifyAPI.transferMyPlayback([deviceId]);
  }

  useEffect(() => {
    if (session?.accessToken) {
      setupSpotifyAPI()
      console.log("session is ready - header")      
    }
  },[session])

  if (!session?.accessToken || new Date(session?.expires).getTime() < Date.now()) return <></>

  return (
    <header className={styles.header}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="#1ed760" height="70px" viewBox="0 0 496 512"><path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"/></svg>
      <ul>
        <li>
          <a onClick={() => router.push('/spotify')}>
          <svg role="img" fill='white' height="24" width="24" aria-hidden="true" viewBox="0 0 24 24"><path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732l-7.5-4.33z"></path></svg>
            Home
          </a>
        </li>
        <li>
          <a onClick={() => router.push('/spotify/search')}>
          <svg role="img" fill='white' viewBox="0 0 512 512" aria-hidden="true" height='24px' width="24px"><path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"></path></svg>
            Search
          </a>
        </li>
        <li>
          <a onClick={() => router.push('/spotify/library')}>
          <svg role="img" fill='white' height="24" width="24" aria-hidden="true" viewBox="0 0 24 24"><path d="M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z"></path></svg>
            Library
          </a>
        </li>
      </ul>
      <Profile />

    </header>
  )
}
