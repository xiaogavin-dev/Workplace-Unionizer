import type { Metadata } from "next";
import Head from "next/head";
import localFont from "next/font/local";
import "./globals.css";
import Application from "./app"
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Unionizer",
  description: "Capstone Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Unionizer</title>
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-[calc(100vh-80px)] `}
      >

        <Application>
          {children}
        </Application>
        {/* <StoreProvider> */}

        {/* </StoreProvider> */}
      </body>
    </html>
  );
}
