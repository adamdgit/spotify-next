'use client'

import { useRouter } from "next/navigation";
import { spotifyAPI } from "../api/auth/[...nextauth]/route";
import styles from "./styles.module.css"

export default function PlaylistItem({ ...props }) {

  const router = useRouter();

  return (
    <li 
      onMouseEnter={() => props.setBgColour(props.item.dominantColour)} 
      className={styles.playlistItem}>
      <img 
        onClick={() => spotifyAPI.play({'context_uri': props.item.uri})}
        width={150}
        height={150}
        src={props.item.images[1].url} 
        alt={props.item.name + 'playlist art'} />

        <span className={styles.resultInfo}>
            <h2>{props.item.name}</h2>
            <p>{props.item.description}</p>
            {
            props.item.owner.id !== props.session?.userId 
            ? <button onClick={() => spotifyAPI.unfollowPlaylist(props.item.id)}>
                  UnFollow
              </button>
            : 
            <span className={styles.resultBtns}>
              <button 
                onClick={() => router.push(`/spotify/editplaylist/${encodeURIComponent(props.item.id)}`)}
                className={styles.editLink}>
                Edit
              </button>
              <button onClick={() => spotifyAPI.unfollowPlaylist(props.item.id)}>
                  Delete
              </button>
            </span>
            }
          </span>
    </li>
  )
}
