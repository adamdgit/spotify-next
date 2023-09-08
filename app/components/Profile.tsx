import { signOut, useSession } from 'next-auth/react';
import React, { useContext, useState } from 'react'
import styles from './styles.module.css'
import { GlobalStateContext, contextProps } from '../providers';

export default function Profile() {

  const { data: session } = useSession();
  const [toggleProfile, setToggleProfile] = useState(false);
  const { player } = useContext(GlobalStateContext) as contextProps

  function logOut() {
    player.disconnect();
    signOut();
  }
  
  return (
    <div className={styles.profile} 
      onClick={() => setToggleProfile(!toggleProfile)}>
      <span className={styles.nameWrap}>
        <svg xmlns="http://www.w3.org/2000/svg" fill='white' height="16px" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/></svg>
        {session?.user?.name}
      </span>
      <div className={`${styles.profileContents} ${ toggleProfile ? styles.showElement : ''}`}>
        <span>Profile</span>
        <button onClick={() => logOut()} className={styles.signOut}>
          Signout
        </button>
      </div>
    </div>
  )
}
