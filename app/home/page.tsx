'use client'

import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

type searchParamsTypes = {
  searchParams: {
    access_token: string,
    expires_in: string,
    refresh_token: string
  }
}

export default function Home( { searchParams } : searchParamsTypes) {

  const [accessToken, setAccessToken] = useState(searchParams.access_token)
  const [refreshToken, setRefreshToken] = useState(searchParams.refresh_token)
  const [expiresIn, setExpiresIn] = useState(searchParams.expires_in)

  useEffect(() => {
    if (!accessToken && !refreshToken) {
      redirect("/");
    }
  },[])

  return (
    <div>test</div>
  )
}
