'use client'

import { useSession } from "next-auth/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { GlobalStateContext, contextProps } from "../providers";
import { spotifyAPI } from "../api/auth/[...nextauth]/route";
import styles from '../components/styles.module.css'
import PlaylistItem from "../components/PlaylistItem";
import AlbumItem from "../components/AlbumItem";
import getDominantColour from "../utils/dominantColour";

type rgbProps = {
  r: number,
  g: number,
  b: number
}

export default function Library() {

  const { data: session } = useSession();
  const { usersPlaylists, setUsersPlaylists } = useContext(GlobalStateContext) as contextProps
  const [albums, setAlbums] = useState([]);
  const [bgColour, setBgColour] = useState<rgbProps>({ r: 46, g: 53, b: 50 });

  const sortedPlaylists = useMemo(() => {
    return usersPlaylists.sort((a, b) => {
      if(a.owner.id === session?.userId && b.owner.id === session?.userId) return 0
      if(a.owner.id === session?.userId && b.owner.id !== session?.userId) return -1
      return 1
    })
  }, [usersPlaylists])

  useEffect(() => {

    if (!session) return

    const getPlaylists = async () => {
      const data = await spotifyAPI.getUserPlaylists({limit: 50});
      const tempData = data.body.items;

      // get dominant colour for each playlist and add to spotify data
      for (let i = 0; i < data.body.items.length; i++) {
        let colour = await getDominantColour(data.body.items[i].images[1].url)
        tempData[i].dominantColour = colour;
      }

      setUsersPlaylists(tempData);
    }
    getPlaylists()
      .catch(err => console.error(err))

    const getAlbums = async () => {
      const data = await spotifyAPI.getMySavedAlbums({limit: 50, offset: 0});
      const tempData = data.body.items;

      // get dominant colour for each album and add to spotify data
      for (let i = 0; i < data.body.items.length; i++) {
        let colour = await getDominantColour(data.body.items[i].album.images[1].url)
        tempData[i].dominantColour = colour;
      }

      setAlbums(tempData);
    }
    getAlbums()
      .catch(err => console.error(err))

  },[session])

  return (
    <main className={styles.mainContent} style={{background: `rgb(${bgColour.r} ${bgColour.g} ${bgColour.b})`}}>
      
      <h1>Your Library</h1>
      <ul className={styles.playlists}>
        {
        sortedPlaylists.map((item, index) => (
          <PlaylistItem 
            key={index}
            session={session}
            item={item} 
            index={index} 
            setBgColour={setBgColour} />
        ))
        }
      </ul>

      <h2>Saved Albums</h2>
      <ul className={styles.playlists}>
        {
        albums.map((item, index) => (
          <AlbumItem 
            key={index}
            session={session}
            item={item} 
            index={index} 
            setBgColour={setBgColour} />
        ))
        }
      </ul>
    </main>
  )
}
