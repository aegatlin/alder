import Script from 'next/script'
import '../lib/styles.css'

function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Script src="/localforage.js" />
    </>
  )
}

export default App
