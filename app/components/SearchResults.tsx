'use client'

import { useContext, useEffect } from "react"
import { spotifyAPI } from "../api/auth/[...nextauth]/route"
import { convertNamesToString } from "../utils/convertNamesToString"
import { GlobalStateContext, contextProps } from "../providers"
import styles from "@/app/components/styles.module.css"

type SearchResultsProps = {
  tracks: any,
  albums: any,
  playlists: any,
  searchTracks: boolean,
  searchAlbums: boolean,
  searchPlaylists: boolean
}

export default function SearchResults(
  { tracks, albums, playlists, searchTracks, searchAlbums, searchPlaylists } 
  : SearchResultsProps) {

  // global context
  const { setMessage } = useContext(GlobalStateContext) as contextProps

  const playItem = async (uri: string)  => {
    const data = await spotifyAPI.play({'context_uri': uri})
    console.log(data)
  }

  const album = async (id: string, name: string) => {
    // save album
    setMessage(`${name} Saved`)
  }

  return (
    <div>
      {searchTracks ? 
      <>
      <span className={styles.resultHeading}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30px" fill="currentColor" viewBox="0 0 512 512"><path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"/></svg>
        Tracks
      </span>
      
      <div className={styles.searchList}>
      {
        tracks.map((result, i) => {
          if (result === null || result === undefined) return null
          return (
          <div key={i} className={styles.searchResult}>
            <img src={
              result.album.images.length === 0 ?
              'no image found' :
              result.album.images.length === 3 ?
              result.album.images[2].url :
              result.album.images[0].url
              } alt={
                result.album.images.length === 0 ?
              'no image found' :
              `${result.name} album art`
              } width="64px" height="64px" />
            <span className={styles.info}>
              <h3>{result.name}</h3>
              <p>{convertNamesToString(result.artists)}</p>
            </span>
            {/* <AddToPlaylistBtn 
              track={result}
              userID={userID}
              userPlaylists={props.playlists}
              addToPlaylist={addToPlaylist}
            /> */}
            <button className={styles.button2} onClick={() => album(result.id, result.name)}>
              Save
            </button>
            <button className={styles.button2} onClick={() => playItem(result.uri)}>
              <svg viewBox="0 0 16 16" height="25" width="25" fill="currentcolor"><path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"></path></svg>
            </button>
          </div>
          )
        })
      }
      </div>
      </> : <></>
      }

      {searchAlbums ?
      <>
      <span className={styles.resultHeading}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30px" fill="currentColor" viewBox="0 0 512 512"><path d="M512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 352c-53 0-96-43-96-96s43-96 96-96s96 43 96 96s-43 96-96 96zm0 32c70.7 0 128-57.3 128-128s-57.3-128-128-128s-128 57.3-128 128s57.3 128 128 128zm0-96c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32z"/></svg>
        Albums
      </span>
      
      <div className={styles.searchList}>
      { 
        albums.map((result, i) => {
          if (result === null || result === undefined) return null
          return (
          <div key={i} className={styles.searchResult}>
            <img src={
              result.images.length === 0 ?
              'no image found' :
              result.images.length === 3 ?
              result.images[2].url :
              result.images[0].url
              } alt={
                result.images.length === 0 ?
              'no image found' :
              `${result.name} album art`
              } width="64px" height="64px" />
            <span className={styles.info}>
              <span>{result.name}</span>
              <span>{convertNamesToString(result.artists)}</span>
            </span>
            <button className={styles.button2} onClick={() => album(result.id, result.name)}>
              Save
            </button>
            <button className={styles.button2} onClick={() => playItem(result.uri)}>
              <svg viewBox="0 0 16 16" height="25" width="25" fill="currentcolor"><path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"></path></svg>
            </button>
          </div>
          )
        })
      }
      </div>
      </> : <></>
      }

      {searchPlaylists ?
      <>
      <span className={styles.resultHeading}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30px" fill="currentColor" viewBox="0 0 576 512"><path d="M0 96C0 60.7 28.7 32 64 32H512c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM128 288c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32zm32-128c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32zM128 384c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32zm96-248c-13.3 0-24 10.7-24 24s10.7 24 24 24H448c13.3 0 24-10.7 24-24s-10.7-24-24-24H224zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H448c13.3 0 24-10.7 24-24s-10.7-24-24-24H224zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H448c13.3 0 24-10.7 24-24s-10.7-24-24-24H224z"/></svg>
        Playlists
      </span>
      
      <div className={styles.searchList}>
      {
        playlists.map((result, i) => {
          if (result === null || result === undefined) return null
          return (
            <div key={i} className={styles.searchResult}>
            <img src={
              result.images.length === 0 ?
              'no image found' :
              result.images.length === 3 ?
              result.images[2].url :
              result.images[0].url
              } alt={
                result.images.length === 0 ?
              'no image found' :
              `${result.name} album art`
              } width="64px" height="64px" />
            <span className={styles.info}>
              <h3>{result.name}</h3>
              <p className={styles.description}>{result.description}</p>
            </span>
            <button className={styles.button2} onClick={() => album(result.id, result.name)}>
              Follow
            </button>
            <button className={styles.button2} onClick={() => playItem(result.uri)}>
              <svg viewBox="0 0 16 16" height="25" width="25" fill="currentcolor"><path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"></path></svg>
            </button>
          </div>
          )
        })
      }
      </div>
      </> : <></>
      }

    </div>
  )
}