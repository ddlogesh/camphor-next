'use client';

import React from "react";
import "./globals.css";
import NavBar from "../components/ui/NavBar";

export default function RootLayout({children}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <NavBar/>
      <main>{children}</main>
    </>
  );
}
