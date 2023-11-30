'use client'

import { spotifyAPI } from '@/app/api/auth/[...nextauth]/route'
import { GlobalStateContext, contextProps } from '@/app/providers'
import { useSession } from 'next-auth/react'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styles from "@/app/components/styles.module.css"
import EditPlaylistDetails from '@/app/components/EditPlaylistDetails'
import EditPlaylistItem from '@/app/components/EditPlaylistItem'
import Loading from '@/app/components/Loading'
import EditSearchResults from '@/app/components/EditSearchResults'
import { handleDragAndDrop } from "@/app/utils/handleDragAndDrop"
import dominantColour from '@/app/utils/dominantColour'

type rgbProps = {
  r: number,
  g: number,
  b: number
}

export default function EditPlaylist({ params } : { params: { id: string } }) {

  const { 
    songs,
    setSongs,
    contextID,
    setMessage
   } = useContext(GlobalStateContext) as contextProps;

  const { data: session } = useSession();
  const [playlistID] = useState(params.id);
  const [playlistData, setPlaylistData] = useState(null);
  const [playlistPublic, setPlaylistPublic] = useState(true);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDesc, setPlaylistDesc] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [originalDesc, setOriginalDesc] = useState('');

  const [bgColour, setBgColour] = useState<rgbProps>({ r: 46, g: 53, b: 50 });
  // edit playlist tracks can be different from currently playing global songs
  const [tracks, setTracks] = useState([]);

  const container = useRef();
  const [draggables, setDraggables] = useState<HTMLDivElement[]>([])
  const setDraggableElement = useCallback((node: HTMLDivElement) => {
    if(node != null) {
      // create array of draggable elements to add event listeners to
      setDraggables(current => [...current, node])
    }
  },[])

  async function getPlaylists() {
    const data = await spotifyAPI.getPlaylist(playlistID)
    console.log(data)
    setTracks(data.body.tracks.items)
    setPlaylistData(data.body)
    setPlaylistPublic(data.body.public)
    setOriginalName(data.body.name)
    setOriginalDesc(data.body.description)
    // must await image loading before getting dominant colour
    setBgColour(await dominantColour(data.body.images[1].url))
  }

  async function removeTrack(trackUri: string) {
    // empty array before fetching updated playlist
    setTracks([])
    setDraggables([])

    const data = await spotifyAPI.removeTracksFromPlaylist(playlistID, [{uri: trackUri}])
    console.log(data)

    setMessage("Removed track from playlist");
    getPlaylists();
  }

  async function changeOrder(dragElIndex: number, dragElNewIndex: number) {
    // empty array before fetching updated playlist
    setTracks([])
    setDraggables([])

    // fixes index when moving item up in the playlist (needed)
    if(dragElIndex < dragElNewIndex) {
      dragElNewIndex = dragElNewIndex +1
    }

    const data = await spotifyAPI.reorderTracksInPlaylist(playlistID, dragElIndex, dragElNewIndex)
    console.log(data)

    setMessage("Playlist order updated");
    getPlaylists();
  }
  
  useEffect(() => {

    if (!session?.accessToken) return
    getPlaylists();

  }, [session])

  // add drag and drop event listeners
  useEffect(() => {

    if (draggables.length === 0) return;

    const dragStart = handleDragAndDrop(draggables, container, changeOrder);

    // cleanup event listeners on component re-render
    return () => {
      draggables.forEach(element => {
        element.removeEventListener('mousedown', dragStart)
        element.removeEventListener('touchstart', dragStart)
      })
    }

  }, [draggables])

  return (
    <main className={styles.mainContent} style={{background: `linear-gradient(rgb(${bgColour.r} ${bgColour.g} ${bgColour.b}) 100px, rgb(10,10,10) 350px)`}}>
      <h1 className={styles.editHeading}>Playlist editor:</h1>
      <div className={styles.playlistInfo}>
        <h1 style={{fontSize: '3.5rem'}}>{!playlistName ? originalName : playlistName}</h1>
        <h3 style={{fontSize: '2rem'}}>{!playlistDesc ? originalDesc : playlistDesc}</h3>
        <p>{playlistPublic === false ? 'Private playlist' : 'Public playlist'}</p>
      </div>
      {
        playlistData ?
        <>
          <EditPlaylistDetails 
            playlistID={playlistID}
            playlistData={playlistData} 
            setPlaylistName={setPlaylistName}
            playlistName={playlistName}
            setPlaylistDesc={setPlaylistDesc}
            playlistDesc={playlistDesc}
            setOriginalDesc={setOriginalDesc}
            originalDesc={originalDesc}
            setOriginalName={setOriginalName}
            originalName={originalName}
          />

          <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>Edit tracks:</h2>

          <div className={styles.editSongList} data-songlist="true" ref={container}>
          {
            tracks.length === 0 ? 
            <div>No tracks in playlist</div>
            :
            tracks.map((song, index) => 
              <EditPlaylistItem 
                key={index}
                song={song} 
                index={index} 
                removeTrack={removeTrack} 
                setDraggableElement={setDraggableElement}
              />)
          }
          </div>
        </>
        : <Loading loadingMsg={'Loading playlist info...'}/>
      }
      <EditSearchResults 
        playlistData={playlistData} 
        id={playlistID} 
        setTracks={setTracks} 
        originalName={originalName}
        playlistName={playlistName}
      />
    </main>
  )
}
