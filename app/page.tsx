import styles from './page.module.css'

const generateRandomString = (length: number) => {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export default function Login() {

  const state = generateRandomString(16);

  return (
    <main className={styles.main}>
      <p>You will be re-directed to the Spotify O-Auth validation page, to grant this app access.</p>
      <a href={`http://localhost:3000/api/login?state=${state}`} role='button'>Login to Spotify</a>
    </main>
  )
}
