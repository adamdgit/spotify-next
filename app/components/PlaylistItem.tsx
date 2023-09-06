'use client'

import { useRouter } from "next/navigation";
import { spotifyAPI } from "../api/auth/[...nextauth]/route";
import dominantColour from "../utils/dominantColour";
import styles from "./styles.module.css"

export default function PlaylistItem({  ...props }) {

  const router = useRouter();

  return (
    <li 
      onMouseEnter={() => dominantColour(props.item.images[1].url, props.setBgColour)} 
      className={styles.playlistItem}>
      <img 
        onClick={() => spotifyAPI.play({'context_uri': props.item.uri})}
        width={200}
        height={200}
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
                onClick={() => router.push(`/editplaylist/${props.item.id}`)}
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
