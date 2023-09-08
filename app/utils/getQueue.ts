'use client'

export async function getQueue(token: string) {
  await fetch("https://api.spotify.com/v1/me/player/queue", {
    method: "get",
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(error => console.log(error))
}