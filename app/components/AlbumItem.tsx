'use client'

import { spotifyAPI } from "../api/auth/[...nextauth]/route";
import dominantColour from "../utils/dominantColour";
import styles from "./styles.module.css"
import { sanitizeArtistNames } from "../utils/sanitizeArtistNames"

export default function AlbumItem({  ...props }) {

  return (
    <li 
      onMouseEnter={() => dominantColour(props.item.album.images[1].url, props.setBgColour)} 
      className={styles.playlistItem}
      onClick={() => spotifyAPI.play({'context_uri': props.item.uri})}>
      <img 
        width={200}
        height={200}
        src={props.item.album.images[1].url} 
        alt={props.item.name + 'playlist art'} />

      <span className="result-info">
        <h2>{props.item.album.name}</h2>
        <p>{sanitizeArtistNames(props.item.album.artists)}</p>
        <button 
          className="remove" 
          onClick={() => spotifyAPI.removeFromMySavedAlbums(props.item.album.id)}>
          Remove
        </button>
      </span>
    </li>
  )
}
