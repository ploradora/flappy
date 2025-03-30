import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bookmark Manager",
  description: "A modern bookmark manager with localStorage persistence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-900 h-screen flex flex-col`}>
        <header className="bg-black py-3">
          <h1 className="text-xl font-bold text-start ml-10">
            <Link href="/" className="text-white hover:text-gray-100 transition-colors">
              Bookmark Manager
            </Link>
          </h1>
        </header>
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
}
