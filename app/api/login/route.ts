import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation"; 

console.log(process.env.CLIENT_ID)

export async function GET(req: NextRequest, res: NextResponse) {

  const { searchParams } = new URL(req.url);
  const state = searchParams.get("state");
  const redirectURI = 'http://localhost:3000/api/callback'
  const scope = 'user-library-read%20user-library-modify%20user-top-read%20user-read-private%20user-read-recently-played%20user-read-email%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-private%20playlist-modify-public%20playlist-read-private%20streaming';
  const response_type = 'code'
  const client_id = process.env.CLIENT_ID

  const url = `https://accounts.spotify.com/authorize?response_type=${response_type}&client_id=${client_id}&scope=${scope}&redirect_uri=${redirectURI}&state=${state}`

  redirect(url)
}
