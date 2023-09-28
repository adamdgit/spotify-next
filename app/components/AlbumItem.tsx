'use client'

import { spotifyAPI } from "../api/auth/[...nextauth]/route";
import styles from "./styles.module.css"
import { convertNamesToString } from "../utils/convertNamesToString"

export default function AlbumItem({  ...props }) {

  return (
    <li 
      onMouseEnter={() => props.setBgColour(props.item.dominantColour)} 
      className={styles.playlistItem}>
      <img 
        onClick={() => spotifyAPI.play({'context_uri': props.item.album.uri})}
        width={150}
        height={150}
        src={props.item.album.images[1].url} 
        alt={props.item.name + 'playlist art'} />

      <span className={styles.resultInfo}>
        <h2>{props.item.album.name}</h2>
        <p>{convertNamesToString(props.item.album.artists)}</p>
        <button 
          onClick={() => spotifyAPI.removeFromMySavedAlbums(props.item.album.id)}>
          Remove
        </button>
      </span>
    </li>
  )
}
