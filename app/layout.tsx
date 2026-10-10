import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google"
import "./globals.css";

const figtree = Figtree({
  variable: '--font-figtree',
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  display: 'swap'
})

export const viewport: Viewport = {
  themeColor: "#121212",
  
}

export const metadata: Metadata = {
  title: {
    template: "%s. Spotify",
    default: "Spotify - Listen On The Web"
  },
  description: "A pixel-perfect Spotify web player clone built with Next.js, Auth.js, Prisma, and Deezer API",
  applicationName: 'Spotify Clone',
  authors: [{ name: "Pedro" }],
  icons: {
    icon: '/icon.svg',
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={figtree.variable}
    >
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
