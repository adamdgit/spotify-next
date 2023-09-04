'use client'

import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { GlobalStateContext, contextProps } from "../providers";
import { spotifyAPI } from "../api/auth/[...nextauth]/route";
import styles from './styles.module.css'

export default function Library() {

  const { data: session } = useSession();
  const { usersPlaylists, setUsersPlaylists } = useContext(GlobalStateContext) as contextProps

  async function getPlaylists() {
    if (session?.accessToken) {
      const data = await spotifyAPI.getUserPlaylists();
      setUsersPlaylists(data.body.items);
      console.log(data)
    } else {
      console.error("no access token");
    }
  }

  useEffect(() => {
    if (!session) return
    getPlaylists();
  },[session])

  return (
    <main className={styles.mainContent}>
      <h1>Welcome {session?.user?.name}</h1>

      <ul className={styles.playlists}>
        {
          usersPlaylists.map((item, index) => (
            <li key={index} onClick={() => spotifyAPI.play({'context_uri': item.uri})}>
              <p>{item?.name}</p>
              <img src={item.images[1].url} alt={item.name + 'playlist art'} />
            </li>
          ))
        }
      </ul>
    </main>
  )
}
