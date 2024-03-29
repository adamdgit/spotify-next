'use client'

import { useContext, useEffect, useState } from 'react'
import Tooltip from './Tooltip'
import styles from './styles.module.css'
import VolumeControl from './VolumeControl';
import PlaybackDevices from './PlaybackDevices';
import Timeline from './Timeline';
import { spotifyAPI } from '../api/auth/[...nextauth]/route';
import { GlobalStateContext, contextProps } from '../providers';
import Loading from './Loading';
import { useSession } from 'next-auth/react';
import StatusMessage from './StatusMessage';

export default function Player() {

  const { 
    contextID,
    setContextID,
    setCurrentTrackID,
    setContextURI,
    setDeviceId,
    setMessage,
    player,
    setPlayer
  } = useContext(GlobalStateContext) as contextProps

  const { data: session } = useSession();

  const [isPaused, setIsPaused] = useState(true);
  const [playerIsReady, setPlayerIsReady] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [current_track, setTrack] = useState();
  const [songLength, setSongLength] = useState(0); // milliseconds
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTrackPos, setPos] = useState(0); // milliseconds
  const [repeatMode, setRepeatMode] = useState(0);
  const [volumeLS] = useState('0.3');

  function handlePlayPause() {
    setIsPaused(!isPaused);
    isPaused ? spotifyAPI.play() : spotifyAPI.pause();
  }

  // setup webplayback sdk on mount
  useEffect(() => {

    if (!session?.accessToken) return

    const script = document.createElement("script")
    script.src = "https://sdk.scdn.co/spotify-player.js"
    script.async = true

    document.body.appendChild(script)

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
          name: 'React Webplayer',
          getOAuthToken: cb => { cb(session.accessToken); },
          volume: volumeLS
      })

      setPlayer(player)

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        spotifyAPI.transferMyPlayback([device_id]);
        setDeviceId(device_id);
      })

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      })

      player.connect( )

      player.addListener('player_state_changed', (state => {
        if (!state) return
        console.log(state)
        setPlayerIsReady(true)
        setIsLoading(state.loading)
        setPos(state.position)
        setTrack(state.track_window.current_track)
        setIsPaused(state.paused)
        setShuffle(state.shuffle)
        // bug with repeat mode? api call not updating repeat mode
        setRepeatMode(state.repeat_mode)
        setCurrentTrackID(state.track_window.current_track?.id)
        setSongLength(state.duration)
        setContextURI(state.context.uri)
        // splits uri into 3 strings, returns last string (context id)
        setContextID(state.context.uri?.split(":").pop())
      }))
    }
  }, [session])

  if (!session?.accessToken || new Date(session?.expires).getTime() < Date.now()) return <></>

  return (
    <>
      <footer className={styles.playerControls}>
      {
      !playerIsReady ? <Loading loadingMsg={"Connecting Spotify Player..."}/>
      :
        <div className={styles.playerWrap}>

          <Timeline
            songLength={songLength} 
            currentTrackPos={currentTrackPos} 
            setPos={setPos}
            isLoading={isLoading}
            isPaused={isPaused}
            player={player} 
          />

          <div className={styles.currentInfo}>
            <img src={current_track? current_track.album.images[1].url 
              : 'no data'} 
              width={"90px"}
              height={"90px"}
              alt="" />
            <span style={{display: 'grid', gap: '.5rem'}}>
              <p className={styles.currentTrack}>{current_track? current_track.name : 'no data'}</p>
              <p className={styles.currentArtist}>{current_track? current_track.artists[0].name : 'no data'}</p>
            </span>
          </div>

          <div className={styles.playerBtns}>
            <button className={styles.shuffleBtn}>
              <Tooltip tip={'Shuffle'}/>
              <svg viewBox="0 0 24 24" height="24px" width="24px" fill="currentcolor"><path d="M16.808 4.655l2.069 1.978h-.527c-1.656 0-3.312.68-4.458 1.814L12.797 9.75l1.179 1.246 1.317-1.527c.764-.794 1.91-1.247 3.057-1.247h.55l-2.07 2.014 1.178 1.179 4.005-3.993-4.026-3.945-1.178 1.179zm1.974 10.998l-1.974-1.888 1.18-1.179 4.024 3.945-4.004 3.993-1.178-1.179 1.954-1.901h-.434c-1.656 0-3.312-.625-4.458-1.667L8.242 9.8C7.35 9.071 6.204 8.55 4.93 8.55H2l.006-1.794 2.965.003c1.784 0 3.312.521 4.459 1.563l5.904 6.185c.765.73 1.911 1.146 3.058 1.146h.39zm-9.02-2.092l-1.52 1.394c-.892.793-2.038 1.36-3.312 1.36H2v1.588h2.93c1.783 0 3.312-.567 4.459-1.701l1.537-1.396-1.164-1.245z"></path></svg>
            </button>
            <button className={styles.prevBtn} onClick={() => spotifyAPI.skipToPrevious()}>
              <Tooltip tip={'Previous'}/>
              <svg role="img" fill="currentcolor" 
                height="24px" width="24px" viewBox="0 0 16 16">
                <path d="M3.3 1a.7.7 0 01.7.7v5.15l9.95-5.744a.7.7 0 011.05.606v12.575a.7.7 0 01-1.05.607L4 9.149V14.3a.7.7 0 01-.7.7H1.7a.7.7 0 01-.7-.7V1.7a.7.7 0 01.7-.7h1.6z"></path>
              </svg>
            </button>
            <button className={styles.playBtn} onClick={() => handlePlayPause()}>
              <Tooltip tip={isPaused === true ? 'Play' : 'Pause'}/>
              { 
              isPaused ? 
              <svg role="img" fill="currentcolor" 
                height="35" width="35" xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 384 512">
                <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
              </svg> 
              : 
              <svg role="img" fill="currentcolor" 
                height="35" width="35" xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 320 512">
                <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/>
              </svg>
              }
            </button>
            <button className={styles.nextBtn} onClick={() => spotifyAPI.skipToNext()}>
              <Tooltip tip={'Next'}/>
              <svg role="img" fill="currentcolor" 
                height="24px" width="24px" viewBox="0 0 16 16">
                <path d="M12.7 1a.7.7 0 00-.7.7v5.15L2.05 1.107A.7.7 0 001 1.712v12.575a.7.7 0 001.05.607L12 9.149V14.3a.7.7 0 00.7.7h1.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-1.6z"></path>
              </svg>
            </button>
            <button className={styles.repeatBtn}>
              <Tooltip tip={repeatMode === 0 ? 'Toggle repeat Context' : repeatMode === 1 ? 'Toggle repeat Track' : 'Toggle repeat Off'}/>
              {
                repeatMode === 0 ? 
                  <svg role="img" height="20" width="20" viewBox="0 0 16 16" fill="currentcolor">
                    <path d="M0 4.75A3.75 3.75 0 013.75 1h8.5A3.75 3.75 0 0116 4.75v5a3.75 3.75 0 01-3.75 3.75H9.81l1.018 1.018a.75.75 0 11-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 111.06 1.06L9.811 12h2.439a2.25 2.25 0 002.25-2.25v-5a2.25 2.25 0 00-2.25-2.25h-8.5A2.25 2.25 0 001.5 4.75v5A2.25 2.25 0 003.75 12H5v1.5H3.75A3.75 3.75 0 010 9.75v-5z"></path>
                  </svg>
                : repeatMode === 1 ?
                  <svg role="img" height="20" width="20" viewBox="0 0 16 16" fill="currentcolor">
                    <path d="M0 4.75A3.75 3.75 0 013.75 1h8.5A3.75 3.75 0 0116 4.75v5a3.75 3.75 0 01-3.75 3.75H9.81l1.018 1.018a.75.75 0 11-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 111.06 1.06L9.811 12h2.439a2.25 2.25 0 002.25-2.25v-5a2.25 2.25 0 00-2.25-2.25h-8.5A2.25 2.25 0 001.5 4.75v5A2.25 2.25 0 003.75 12H5v1.5H3.75A3.75 3.75 0 010 9.75v-5z"></path>
                  </svg>
                : 
                  <svg role="img" height="20" width="20" viewBox="0 0 16 16" fill="currentcolor">
                    <path d="M0 4.75A3.75 3.75 0 013.75 1h.75v1.5h-.75A2.25 2.25 0 001.5 4.75v5A2.25 2.25 0 003.75 12H5v1.5H3.75A3.75 3.75 0 010 9.75v-5zM12.25 2.5h-.75V1h.75A3.75 3.75 0 0116 4.75v5a3.75 3.75 0 01-3.75 3.75H9.81l1.018 1.018a.75.75 0 11-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 111.06 1.06L9.811 12h2.439a2.25 2.25 0 002.25-2.25v-5a2.25 2.25 0 00-2.25-2.25z"></path><path d="M9.12 8V1H7.787c-.128.72-.76 1.293-1.787 1.313V3.36h1.57V8h1.55z"></path>
                  </svg>
              }
            </button>
          </div>

          <VolumeControl player={player} volumeLS={volumeLS} />
          <PlaybackDevices />
          <StatusMessage />
        </div>
      }
      </footer>
    </>
  )
}
