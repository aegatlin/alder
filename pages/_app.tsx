import Head from 'next/head'
import Script from 'next/script'
import '../client/styles.css'
import '../client/igi'

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Component {...pageProps} />
      <Script src="/localforage.js" />
    </>
  )
}

export default App
