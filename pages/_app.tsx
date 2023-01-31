import Head from 'next/head'
import Script from 'next/script'
import { ListsProvider } from '../lib/ListsContext'
import '../lib/styles.css'

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <ListsProvider>
        <Component {...pageProps} />
      </ListsProvider>
      <Script src="/localforage.js" />
    </>
  )
}

export default App
