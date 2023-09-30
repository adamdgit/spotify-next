import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";
var SpotifyWebApi = require('spotify-web-api-node');

export var spotifyAPI = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
})

async function refreshAccessToken(token: JWT) {
  try {
    // spotify requires current tokens before providing a refresh token
    spotifyAPI.setAccessToken(token.accessToken);
    spotifyAPI.setRefreshToken(token.refreshToken);

    // request refresh token from spotify
    const { body: refreshToken } = await spotifyAPI.refreshAccessToken();

    // return new refreshed tokens
    return {
      ...token, 
      accessToken: refreshToken.access_token,
      accessTokenExpiration: Date.now() + refreshToken.expires_in * 1000, // 1 hour in milliseconds
      refreshToken: refreshToken.refresh_token ?? token.refreshToken
    }
  } catch (err) {
    console.log(err)
    return { token, error: "refresh token error" }
  }
}

const scope = 'user-library-read%20user-library-modify%20user-top-read%20user-read-private%20user-read-recently-played%20user-read-email%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-private%20playlist-modify-public%20playlist-read-private%20streaming';
const url = `https://accounts.spotify.com/authorize?&scope=${scope}`

const options: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      authorization: url
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async redirect({ url, baseUrl }) { return '/spotify' },
    async jwt({ token, user, account }) {

      // sign in
      if (account && user) {
        return {
          ...token, 
          accessToken: account.access_token, 
          refreshToken: account.refresh_token,
          userId: account.providerAccountId,
          accessTokenExpiration: account.expires_at! * 1000, // get as milliseconds
        };
      };

      // if not expired, return previous token
      if (Date.now() < Number(token.accessTokenExpiration)) {
        return token;
      };
      
      // refresh token on expiration
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.userId = token.userId;

      return session;
    }
  }
}

const handler = NextAuth(options);

export { handler as GET, handler as POST }