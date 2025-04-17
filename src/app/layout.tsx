import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import Loading from './(components)/Loading';
import AudioPlayer from './(components)/AudioPlayer';

export const metadata: Metadata = {
  title: "ShareAway by ItsMe Prince",
  description: "ShareAway is a safe, open space where anyone can express their thoughts, feelings, and stories without fear of judgment. Whether you're going through something tough, celebrating a small win, or just need to get something off your chest, just Share Away 🩷... It's a community built on empathy, understanding, and support — because everyone deserves to be heard.",
  icons: {
    icon: "/logo/ShareAway5-png.png",
  },
  openGraph: {
    title: "ShareAway by @ItsMe Prince",
    description: "ShareAway is a safe, open space where anyone can express their thoughts, feelings, and stories without fear of judgment.",
    url: "https://share-away-prince.vercel.app/",
    images: [
      {
        url: "/art/banner/banner1-text.png",
        width: 700,
        height: 150,
        alt: "ShareAway - A place to share thoughts, feelings, and stories",
      },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
      <AudioPlayer />
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
      </body>
    </html>
  );
}
