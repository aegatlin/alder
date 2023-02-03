import Head from 'next/head'
import Script from 'next/script'
import { ListsContextProvider } from '../client/ListsContext'
import '../client/styles.css'

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <ListsContextProvider>
        <Component {...pageProps} />
      </ListsContextProvider>
      <Script src="/localforage.js" />
    </>
  )
}

export default App
