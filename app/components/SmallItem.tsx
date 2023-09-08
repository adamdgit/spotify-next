import styles from "./styles.module.css"

export default function SmallItem({ ...props }) {
  return (
    <li className={styles.homeItem}>
      <img 
        width={100}
        height={100}
        src={props.item.images[2] ? props.item.images[2].url : "no image data"} 
        alt={props.item.name + 'art'} />
        <span>{props.item.name}</span>
    </li>
  )
}
