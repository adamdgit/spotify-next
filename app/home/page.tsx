'use client'

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

type searchParamsTypes = {
  searchParams: {
    access_token: string,
    expires_in: string,
    refresh_token: string
  }
}

export default async function Home({ searchParams } : searchParamsTypes) {

  useEffect(() => {

    localStorage.setItem("spotify_access_token", searchParams.access_token)
    localStorage.setItem("spotify_refresh_token", searchParams.refresh_token)
    localStorage.setItem("spotify_expires_in", searchParams.expires_in)
  
    if (!searchParams.access_token && !searchParams.refresh_token) {
      redirect("/");
    } else {
      window.history.replaceState(null, '', "http://localhost:3000/home")
    }

  },[])


  return (
    <div>test</div>
  )
}
