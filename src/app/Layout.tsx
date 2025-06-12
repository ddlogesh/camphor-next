'use client';

import React from "react";
import type {Metadata} from "next";
import "./globals.css";
import NavBar from "../components/NavBar";

export const metadata: Metadata = {
  title: "Camphor",
  description: "Launch your CSV import feature in minutes 🚀",
};

export default function RootLayout({children}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
    <body className="w-screen h-screen overflow-y-scroll">
    <NavBar/>
    <main>{children}</main>
    </body>
    </html>
  );
}
