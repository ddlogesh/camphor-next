import type {AppProps} from 'next/app';
import NavBar from "@/src/components/ui/nav-bar";
import "@/src/styles/globals.css";
import {WasmWorkerProvider} from "@/src/contexts/wasm-worker";

export default function App({Component, pageProps}: AppProps) {
  return (
    <WasmWorkerProvider>
      <NavBar />
      <main className="p-4">
        <Component {...pageProps} />
      </main>
    </WasmWorkerProvider>
  )
}
