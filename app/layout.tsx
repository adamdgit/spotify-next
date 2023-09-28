import Header from './components/Header'
import Player from './components/Player'
import './globals.css'
import Providers from './providers'

export const metadata = {
  title: 'Spotify Music Manager',
  description: 'Play your favourite songs through Spotify and discover new music.',
}

export default function RootLayout({ children } : { children: React.ReactNode }) {

  return (
    <html lang="en">
      <Providers>
        <body>
          <Header />
          {children}
          <Player />
        </body>
      </Providers>
    </html>
  )
  
}
