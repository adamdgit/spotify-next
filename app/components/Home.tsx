import React, { useContext, useEffect, useState } from 'react'
import { spotifyAPI } from '../api/auth/[...nextauth]/route';
import { useSession } from 'next-auth/react';
import styles from "./styles.module.css"
import { GlobalStateContext, contextProps } from '../providers';

export default function Home() {
  
  const session = useSession();
  const [topArtists, setTopArtists] = useState([])
  const { usersPlaylists, setUsersPlaylists } = useContext(GlobalStateContext) as contextProps
  
  useEffect(() => {

    if (!session.data?.accessToken) return

    const getTopArtists = async () => {
      const data = await spotifyAPI.getMyTopArtists({"limit": 10});
      setTopArtists(data.body.items)
      console.log(data)
    }
    getTopArtists()
      .catch(err => console.error(err))

    const getPlaylists = async () => {
      const data = await spotifyAPI.getUserPlaylists();
      setUsersPlaylists(data.body.items);
      console.log(data)
    }
    getPlaylists()
      .catch(err => console.error(err))

  },[session])

  return (
    <>
    <main className={styles.mainContent}>
      <h1>Your Playlists</h1>
      <ul className={styles.homeItemList}>
        {
        usersPlaylists.length > 0 &&
        usersPlaylists.map((item, idx) => {
          return <li key={idx} className={styles.homeItem}>
            <img 
              width={100}
              height={100}
              src={item.images[2] ? item.images[2].url : "no image data"} 
              alt={item.name + 'art'} />
              {item.name}
          </li>
        })
        }
        </ul>

        <h2>Your Top Artists</h2>
        <ul className={styles.homeItemList}>
        {
        topArtists.length > 0 &&
        topArtists.map((item, idx) => {
          return <li key={idx} className={styles.homeItem}>
            <img 
              width={100}
              height={100}
              src={item.images[2] ? item.images[2].url : "no image data"} 
              alt={item.name + 'art'} />
              {item.name}
          </li>
        })
        }
        </ul>
    </main>
    </>
  )
}
