import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>THE CAFE | STAFF</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
