'use client'

import React, { useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import { GlobalStateContext, contextProps } from './providers';
import { spotifyAPI } from './api/auth/[...nextauth]/route';
import Header from './components/Header';
import Player from './components/Player';
import Search from './components/Search';
import Library from './components/Library';

export default function Home() {

  const session = useSession();
  const [navigation, setNav] = useState(0);
  const [topArtists, setTopArtists] = useState([])

  const { deviceId } = useContext(GlobalStateContext) as contextProps

  async function setupSpotifyAPI() {
    if (!session?.data.accessToken) return
    // provide spotifyAPI library with access token
    await spotifyAPI.setAccessToken(session?.data.accessToken)

    if (!deviceId) return
    // device randomly disconnects, this should reset playback
    await spotifyAPI.transferMyPlayback([deviceId]);
  }

  async function getTopArtists() {
    const data = await spotifyAPI.getMyTopArtists();
    setTopArtists(data.body.items)
    console.log(data.body.items)
  }

  useEffect(() => {
    if (session.data?.accessToken) {
      setupSpotifyAPI()
      console.log("session is ready")
      getTopArtists()
    }
  },[session])

  return (
    <>
    <Header setNav={setNav}/>
    {
      !session ? <div></div>
      : navigation === 0 ? 
      <div>
        {
          topArtists.length > 0 &&
          topArtists.map((item, idx) => {
            return <li key={idx}>{item.name}</li>
          })
        }
      </div>
      : navigation === 1 ? 
      <Search />
      : <Library />
    }
    <Player />
    </>

  )
}

