'use client';

import React from "react";
import "./globals.css";
import NavBar from "../components/ui/NavBar";
import Script from "next/script";

export default function RootLayout({children}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Script src="/wasm/index.js" strategy="beforeInteractive" />
      <NavBar/>
      <main>{children}</main>
    </>
  );
}
