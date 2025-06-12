import type { Metadata } from "next";
import "../globals.css";
import NavBar from "./NavBar";

export const metadata: Metadata = {
  title: "Camphor",
  description: "Launch your CSV import feature in minutes 🚀",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
