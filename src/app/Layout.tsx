'use client';

import React from "react";
import "./globals.css";
import NavBar from "../components/ui/NavBar";
import {ProviderProps} from "@/src/types/global";
import {WasmWorkerProvider} from "@/src/contexts/wasmWorker";

const RootLayout: React.FC<ProviderProps> = ({children}) => {
  return (
    <WasmWorkerProvider>
      <NavBar/>
      <main>{children}</main>
    </WasmWorkerProvider>
  );
}

export default RootLayout;
