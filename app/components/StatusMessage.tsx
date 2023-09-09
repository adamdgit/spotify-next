import { useContext, useState, useEffect } from "react";
import styles from "./styles.module.css"
import { GlobalStateContext, contextProps } from "../providers";

export default function StatusMessage() {

  const [showMsg, setShowMsg] = useState(false)
  const { message } = useContext(GlobalStateContext) as contextProps

  // when global message state changs, show message for 1.5secs
  useEffect(() => {

    if (message.needsUpdate === true) {
      setShowMsg(true)
      setTimeout(() => {
        setShowMsg(false)
      }, 1500)
    }

  },[message])

  return (
    <div className={showMsg === true ? `${styles.playlistUpdateMessage} ${styles.show}`
      : styles.playlistUpdateMessage}>
      <span>{message.msg}</span>
      <span className={styles.triangle}></span>
    </div>
  )

}