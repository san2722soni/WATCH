import '@/styles/globals.css'
import { Rubik } from 'next/font/google'
import Navbar from './components/Navbar';

const rubik = Rubik({
  weight: ['500', '800', '900'],
  subsets: ['latin'],
  display: 'swap'
});

export default function App({ Component, pageProps }) {
  return (
    <>
    <main className={rubik.className}>
      <Navbar />
      <Component {...pageProps} />
    </main>
    </>
  )
}
