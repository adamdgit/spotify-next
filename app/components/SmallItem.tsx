import styles from "./styles.module.css"
import { spotifyAPI } from "../api/auth/[...nextauth]/route"

export default function SmallItem({ ...props }) {
  return (
    <li>
      <button 
      className={styles.homeItem} 
      onClick={() => spotifyAPI.play({'context_uri': props.item.uri})}>
        <img 
            width={100}
            height={100}
            src={
              props.item.images.length > 1 ? props.item.images[2].url 
              : props.item.images.length === 1 ? props.item.images[0].url
              : "no image data"
            } 
            alt={props.item.name + 'art'} />
          <span>{props.item.name}</span>
      </button>
    </li>
  )
}
