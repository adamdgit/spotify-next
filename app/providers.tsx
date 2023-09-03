'use client'

import { SessionProvider } from "next-auth/react"
import { Dispatch, SetStateAction, useState } from "react";
import { createContext } from "react"

export interface AuthProps {
  children: React.ReactNode,
}

export type messageProps = {
  msg: string, 
  needsUpdate: boolean
}

export type contextProps = {
  accessToken: string,
  setAccessToken: Dispatch<SetStateAction<string>>,
  usersPlaylists: never[] | [],
  setUsersPlaylists: Dispatch<SetStateAction<never[]>>,
  username: string,
  setUsername: Dispatch<SetStateAction<string>>,
  userID: string,
  setUserID: Dispatch<SetStateAction<string>>,
  songs: never[] | [],
  setSongs: Dispatch<SetStateAction<never[]>>,
  message: messageProps,
  setMessage: Dispatch<SetStateAction<messageProps>>,
  contextID: string,
  setContextID: Dispatch<SetStateAction<string>>,
  contextURI: string,
  setContextURI: Dispatch<SetStateAction<string>>,
  currentTrackID: string,
  setCurrentTrackID: Dispatch<SetStateAction<string>>,
  playerIsHidden: boolean,
  setPlayerIsHidden: Dispatch<SetStateAction<boolean>>
}

export const GlobalStateContext = createContext<contextProps | null>(null);

export default function Providers({ children } : AuthProps) {

  const [accessToken, setAccessToken] = useState('');
  const [usersPlaylists, setUsersPlaylists] = useState([]);
  const [currentTrackID, setCurrentTrackID] = useState('');
  const [contextURI, setContextURI] = useState(''); // album, playlist etc
  const [contextID, setContextID] = useState('');
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');
  const [songs, setSongs] = useState([]); // playlist items
  const [message, setMessage] = useState({msg: '', needsUpdate: false}); // playlist update message
  const [playerIsHidden, setPlayerIsHidden] = useState(true);


  return (
      <SessionProvider>
        <GlobalStateContext.Provider value={{
          accessToken, setAccessToken,
          usersPlaylists, setUsersPlaylists,
          username, setUsername, 
          userID, setUserID, 
          songs, setSongs, 
          message, setMessage, 
          contextID, setContextID, 
          contextURI, setContextURI, 
          currentTrackID, setCurrentTrackID,
          playerIsHidden, setPlayerIsHidden,
          }}>
          {children}
        </GlobalStateContext.Provider>
      </SessionProvider>
  )
}
