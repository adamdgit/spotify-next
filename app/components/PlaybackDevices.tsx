import React, { useContext, useState } from 'react'
import { spotifyAPI } from '../api/auth/[...nextauth]/route'
import { GlobalStateContext, contextProps } from '../providers'
import styles from './styles.module.css'

export default function PlaybackDevices() {

  const { setMessage } = useContext(GlobalStateContext) as contextProps

  const [devices, setDevices] = useState([])
  const [devicesAreHidden, setDevicesAreHidden] = useState(true)
  const [isLoading, setLoading] = useState(false)

  const transferDevice = async (deviceID: string) => {
    setLoading(true);
    try {
      await spotifyAPI.transferMyPlayback(deviceID);
    }
    catch(err) { console.error(err) }
    finally { setLoading(false) }
  }

  const getAvailableDevices = async () => {
    setLoading(true);
    setDevices([]);
    try {
      const data = await spotifyAPI.getMyDevices();
      console.log(data)
      setDevices(data.body.devices)
    }
    catch(err) { console.error(err) }
    finally { setLoading(false) }
  }

  return (
    <div className={styles.devicesWrap}>
      <button 
        className={styles.devicesBtn} 
        onClick={() => {
          setDevicesAreHidden(!devicesAreHidden)
          getAvailableDevices()
          }
        }>
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" fill="currentColor" viewBox="0 0 576 512">{/* Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. */}<path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64H240l-10.7 32H160c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H346.7L336 416H512c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM512 64V352H64V64H512z"/></svg>
      </button>
      <ul style={devicesAreHidden === true ? {display: 'none'} : {display: 'grid'}}
        className={styles.deviceList}>
        <div style={{fontWeight: 'bold', fontSize: '1.2rem', margin: '.7rem 0'}}>Transfer playback</div>
        <div className={styles.triangle}></div>
        {isLoading === true ? <p>Loading devices..</p> : <></>}
        {
          devices?
          devices.map(device => {
            return <li 
              key={device.id} 
              style={device.is_active === true ? {color: '#23ff73'} : {} }
              onClick={() => transferDevice(device.id)}>
              {device.name}
            </li>
          })
          : <></>
        }
      </ul>
    </div>
  )
}
