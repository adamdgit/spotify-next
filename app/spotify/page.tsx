'use client'

import React, { useContext, useEffect, useMemo, useState } from 'react'
import { spotifyAPI } from '../api/auth/[...nextauth]/route';
import { useSession } from 'next-auth/react';
import styles from "@/app/components/styles.module.css"
import { GlobalStateContext, contextProps } from '../providers';
import useFetch from '../hooks/useFetch';

function SmallItem({ item }: any) {
  return (
    <li>
      <button 
      className={styles.homeItem} 
      onClick={() => spotifyAPI.play({'context_uri': item.uri})}>
        <img 
            width={100}
            height={100}
            src={
              item.images.length > 1 ? item.images[2].url 
              : item.images.length === 1 ? item.images[0].url
              : "no image data"
            } 
            alt={item.name + 'art'} />
          <span>{item.name}</span>
      </button>
    </li>
  )
}

export default function Spotify() {
  
  const { data: session} = useSession();
  const [topArtists, setTopArtists] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const { usersPlaylists, setUsersPlaylists } = useContext(GlobalStateContext) as contextProps;

  const sortedPlaylists = useMemo(() => {
    return usersPlaylists.sort((a, b) => {
      if(a.owner.id === session.userId && b.owner.id === session.userId) return 0
      if(a.owner.id === session.userId && b.owner.id !== session.userId) return -1
      return 1
    })
  }, [usersPlaylists])

  useEffect(() => {

    if (!session?.accessToken) return

    const getTopArtists = async () => {
      const data = await spotifyAPI.getMyTopArtists({"limit": 10});
      setTopArtists(data.body.items)
      console.log(data)
    }
    getTopArtists()
      .catch(err => console.error(err))

    const getPlaylists = async () => {
      const data = await spotifyAPI.getUserPlaylists();
      setUsersPlaylists(data.body.items);
      console.log(data)
    }
    getPlaylists()
      .catch(err => console.error(err))

    const getFeatured = async () => {
      const data = await spotifyAPI.getFeaturedPlaylists({
        limit: 10, offset: 0
      });
      setFeaturedPlaylists(data.body.playlists.items);
      console.log(data)
    }
    getFeatured()
      .catch(err => console.error(err))

  },[session])


  return (
    <div className={styles.pageWrap}>
      <main className={styles.mainContent}>
        <h1>Your Playlists</h1>
        <ul className={styles.homeItemList}>
          {sortedPlaylists.length > 0 ?
          sortedPlaylists.map((item, idx) => 
            <SmallItem key={idx} item={item} />
          )
          : <p>No playlists found.</p>}
        </ul>

        <h2>Your Top Artists</h2>
        <ul className={styles.homeItemList}>
          {topArtists ?
          topArtists.map((item, idx) => 
            <SmallItem key={idx} item={item} />
          )
          : <p>Loading artists..</p>}
        </ul>

        <h2>Featured Playlists</h2>
        <ul className={styles.homeItemList}>
          {featuredPlaylists ?
          featuredPlaylists.map((item, idx) => 
            <SmallItem key={idx} item={item} />
          )
          : <p>Loading featured playlists..</p>}
        </ul>
      </main>
    </div>
  )
}
