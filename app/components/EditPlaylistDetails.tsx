import React, { useContext, useState } from 'react'
import styles from "./styles.module.css"
import ErrorTooltip from './ErrorTooltip'
import { GlobalStateContext, contextProps } from '../providers';
import { spotifyAPI } from '../api/auth/[...nextauth]/route';

export default function EditPlaylistDetails({ ...props }) {

  // props.playlistID
  const { setMessage } = useContext(GlobalStateContext) as contextProps;

  const [error, setError] = useState(false)
  const [isPublic, setIsPublic] = useState(false)

  async function changeDetails(e: any) {
    e.preventDefault();
    console.log(props.playlistDesc)
    console.log(props.playlistName)
    // simple validation
    if (props.playlistName === '' && props.playlistDesc === '') {
      setError(true)
      const timer = setTimeout(() => {
        setError(false)
        clearTimeout(timer)
      }, 4000)
      return
    }
    if (props.playlistName === '' && props.playlistDesc !== '') {
      setError(false)
      await spotifyAPI.changePlaylistDetails(props.playlistID, {
        'name': props.originalName,
        'description': props.playlistDesc,
        'public': isPublic
      })
      setMessage({msg: 'Playlist details updated', needsUpdate: true});
    }
    if (props.playlistName !== '' && props.playlistDesc === '') {
      setError(false)
      await spotifyAPI.changePlaylistDetails(props.playlistID, {
        'name': props.playlistName,
        'description': props.originalDesc,
        'public': isPublic
      })
      setMessage({msg: 'Playlist details updated', needsUpdate: true});
    }

    setError(false)
    await spotifyAPI.changePlaylistDetails(props.playlistID, {
      'name': props.playlistName,
      'description': props.playlistDesc,
      'public': isPublic
    })
    setMessage({msg: 'Playlist details updated', needsUpdate: true});
  }
  
  return (
    <div className={styles.editPlaylist}>
      {
        props.playlistData.images.length === 0 ? 
        <span style={{display: 'grid', placeItems: 'center', 
          height: '300px', width: '300px', border: '2px solid white'}}>
          <svg role="img" fill="currentcolor" height="64" width="64" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3h15v15.167a3.5 3.5 0 11-3.5-3.5H19V5H8v13.167a3.5 3.5 0 11-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 101.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 101.5 1.5v-1.5z"></path></svg>
        </span>
        :
        <img 
          src={ props.playlistData.images[0].url } 
          alt={ `${props.playlistData.name} playlist art` }
        /> 
      }
      <form onSubmit={(e) => changeDetails(e)} className={styles.userInputWrap}>
        <ErrorTooltip tip={'No name or description entered'} error={error}/>
        <span className={styles.changeDetails}>
          <h3>Name:</h3>
          <input
            style={error === true ? {border: '1px solid red'} : {}}
            id="name"
            type="text" 
            className={styles.editInput}
            onChange={(e) => props.setPlaylistName(e.target.value)}
            placeholder="Change playlist name"
          />
        </span>
        <span className={styles.changeDetails}>
          <h3>Description:</h3>
          <input 
            style={error === true ? {border: '1px solid red'} : {}}
            id="description"
            type="text" 
            className={styles.editInput}
            onChange={(e) => props.setPlaylistDesc(e.target.value)}
            placeholder="Change playlist description"
          />
        </span>
        <span className={styles.changeDetails} style={{gridTemplateColumns: '130px 20px 1fr'}}>
          <h3>Make Public?</h3>            
          <input type="checkbox" onClick={(e) => setIsPublic(e.target.checked)}/>
          <p>(Leave unchecked for private playlist)</p>
        </span>
        <button type='submit' className={styles.saveBtn}>Save changes</button>
      </form>
    </div>
  )
}
