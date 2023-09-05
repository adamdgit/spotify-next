'use client'

import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { GlobalStateContext, contextProps } from "../providers";
import { spotifyAPI } from "../api/auth/[...nextauth]/route";
import styles from './styles.module.css'
import dominantColour from "../utils/dominantColour";

type rgbProps = {
  r: number,
  g: number,
  b: number
}

export default function Library() {

  const { data: session } = useSession();
  const { usersPlaylists, setUsersPlaylists } = useContext(GlobalStateContext) as contextProps
  const [bgColour, setBgColour] = useState<rgbProps>({ r: 55, g: 55, b: 55 });

  useEffect(() => {

    if (!session) return

    const getPlaylists = async () => {
      const data = await spotifyAPI.getUserPlaylists();
      setUsersPlaylists(data.body.items);
      console.log(data)
    }
    getPlaylists()
      .catch(err => console.error(err))

  },[session])

  return (
    <main className={styles.mainContent} style={{background: `rgb(${bgColour.r} ${bgColour.g} ${bgColour.b})`}}>
      <h1>Your Library</h1>

      <ul className={styles.playlists}>
        {
        usersPlaylists.map((item, index) => (
          <li key={index} 
            className={styles.playlistItem}
            onClick={() => spotifyAPI.play({'context_uri': item.uri})}>
            <img 
              width={200}
              height={200}
              onMouseEnter={() => dominantColour(item.images[1].url, setBgColour)} 
              src={item.images[1].url} 
              alt={item.name + 'playlist art'} />
              <span>{item?.description}</span>
              <span>{item?.name}</span>
          </li>
        ))
        }
      </ul>
    </main>
  )
}
