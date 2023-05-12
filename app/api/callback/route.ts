import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation"; 

export async function GET(req: NextRequest, res: NextResponse) {

  // get query params from callback
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const check_state = searchParams.get("state");
  const encodedString = Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64');

  // TODO: save state to ls or cookies to validate

  if (check_state === null) {
    redirect("http://localhost:3000")
  } else {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: "POST",
      headers: {
        'Authorization': 'Basic ' + encodedString,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code!,
        redirect_uri: "http://localhost:3000/api/callback",
        grant_type: 'authorization_code',
      }),
    })
    const data = await response.json()

    const access_token = data.access_token
    const refresh_token = data.refresh_token
    const expires_in = data.expires_in

    // send tokens back to user via URL values
    redirect(`http://localhost:3000/home?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`)
  };

}