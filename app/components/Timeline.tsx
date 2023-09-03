import { useEffect } from "react"
import { convertTime } from "../utils/convertTime"
import styles from "./styles.module.css"

export default function Timeline({ ...props }) {

  const timelineSeek = (e: any) => {
    const rect = e.target.getBoundingClientRect();
    const percent: number = Math.min(Math.max(0, e.pageX - rect.x), rect.width) / rect.width;
    // seek requires value in milliseconds
    props.player.seek(props.songLength * percent).then(() => {
      console.log('Changed position!');
    });
  }

  useEffect(() => {

    if (props.isPaused === false) {
      const timelineUpdate = setInterval(() => {
        props.setPos(value => value += 1000)
      }, 1000)
      // when track changes, loading = true from playback update
      // we reset timer and clear interval to stop the timeline counting
      if (props.loading === true) {
        props.setPos(0)
        clearInterval(timelineUpdate)
      }
      return () => clearInterval(timelineUpdate)
    }

  }, [props.isPaused, props.isLoading])

  return (
    <div className={styles.timelineSeek}>
      <span>{convertTime(props.currentTrackPos)}</span>
        <span className={styles.timeline} onClick={(e) => timelineSeek(e)}>
          <span className={styles.timelineThumb} style={{'--progress': `-${100 - (props.currentTrackPos / props.songLength * 100)}%`}}>
          </span>
        </span>
      <span>{convertTime(props.songLength)}</span>
    </div>
  )
}