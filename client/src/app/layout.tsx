import type { Metadata } from "next";
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
  icons: "/images/Unionizer_Logo.ico"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
