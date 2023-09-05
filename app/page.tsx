'use client'

import React, { useContext, useEffect, useState } from 'react'
import Header from './components/Header';
import Player from './components/Player';
import Search from './components/Search';
import Library from './components/Library';
import Home from './components/Home';

export default function Page() {

  const [navigation, setNav] = useState(0);

  return (
    <>
    <Header navigation={navigation} setNav={setNav}/>
    {
      navigation === 0 ? <Home />
      : navigation === 1 ? <Search />
      : <Library />
    }
    <Player />
    </>

  )
}

