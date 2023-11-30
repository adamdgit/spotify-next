'use client'

import { useContext } from "react"
import { spotifyAPI } from "../api/auth/[...nextauth]/route"
import { convertNamesToString } from "../utils/convertNamesToString"
import { GlobalStateContext, contextProps } from "../providers"
import styles from "@/app/components/styles.module.css"

export default function SearchResults({ ...props }) {

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
      <h2 style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30px" fill="currentColor" viewBox="0 0 512 512"><path d="M512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 352c-53 0-96-43-96-96s43-96 96-96s96 43 96 96s-43 96-96 96zm0 32c70.7 0 128-57.3 128-128s-57.3-128-128-128s-128 57.3-128 128s57.3 128 128 128zm0-96c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32z"/></svg>
        Albums
      </h2>
      
      <div className={styles.searchList}>
      { 
        props.tracks.map((result, i) => {
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
              <span>{result.name}</span>
              <span>{convertNamesToString(result.artists)}</span>
            </span>
            <button className={styles.button1} onClick={() => album(result.id, result.name)}>
              Save
            </button>
            <button className={styles.button1} onClick={() => playItem(result.uri)}>
              <svg viewBox="0 0 16 16" height="25" width="25" fill="currentcolor"><path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"></path></svg>
            </button>
          </div>
          )
        })
      }
      </div>
    </div>
  )
}