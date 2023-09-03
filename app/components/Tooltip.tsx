import styles from "./styles.module.css"

export default function Tooltip(props: { tip: string }) {

  return (
    <span className={styles.tooltip}>
      {props.tip}
    </span>
  )

}
