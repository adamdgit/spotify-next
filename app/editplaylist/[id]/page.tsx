'use client'

import { spotifyAPI } from '@/app/api/auth/[...nextauth]/route'
import { GlobalStateContext, contextProps } from '@/app/providers'
import { useSession } from 'next-auth/react'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styles from "../../components/styles.module.css"
import EditPlaylistDetails from '@/app/components/EditPlaylistDetails'
import BlankSongResult from '@/app/components/BlankSongResult'
import EditPlaylistItem from '@/app/components/EditPlaylistItem'
import Loading from '@/app/components/Loading'
import EditSearchResults from '@/app/components/EditSearchResults'

export default function EditPlaylist({ params }) {

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
   // edit playlist tracks can be different from currently playing global songs
   const [tracks, setTracks] = useState([]);

   const container = useRef();
   const [draggables, setDraggables] = useState([])
   const setDraggableElement = useCallback(node => {
    if(node != null) {
      // create array of draggable elements to add event listeners to
      setDraggables(current => [...current, node])
    }
  },[])
  
   async function removeTrack() {

   }
   
   useEffect(() => {

    if (!session?.accessToken) return

    const getPlaylists = async () => {
      const data = await spotifyAPI.getPlaylist(playlistID)
      console.log(data)
      setTracks(data.body.tracks.items)
      setPlaylistData(data.body)
      setPlaylistPublic(data.body.public)
      setOriginalName(data.body.name)
      setOriginalDesc(data.body.description)
    }
    getPlaylists();

   }, [session])

  return (
    <main className={styles.mainContent}>
      <h1 className={styles.editHeading}>Playlist editor:</h1>
      <div className={styles.playlistInfo}>
        <span style={{display:'grid', gap: '1rem'}}>
          <h1 style={{fontSize: '3.5rem'}}>{!playlistName ? originalName : playlistName}</h1>
          <h3 style={{fontSize: '2rem'}}>{!playlistDesc ? originalDesc : playlistDesc}</h3>
          <p>{playlistPublic === false ? 'Private playlist' : 'Public playlist'}</p>
        </span>
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

          <div className="edit-songlist" ref={container}>
          {
          contextID === playlistID ?
            songs.length === 0 ? 
            <BlankSongResult />
            :
            songs.map((song, index) => 
              <EditPlaylistItem 
                key={index}
                song={song} 
                index={index} 
                func={removeTrack} 
                setDraggableElement={setDraggableElement}
              />) 
            : 
            tracks.length === 0 ? 
            <BlankSongResult />
            :
            tracks.map((song, index) => 
              <EditPlaylistItem 
                key={index}
                song={song} 
                index={index} 
                func={removeTrack} 
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
