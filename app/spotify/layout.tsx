import Header from "../components/Header";
import Player from "../components/Player";

export default function HomeLayout({ children } : { children: React.ReactNode }) {

  return (
    <>
    <Header />
      {children}
    <Player />
    </>
  )
  
}
