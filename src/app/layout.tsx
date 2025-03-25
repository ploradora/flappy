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
      <body
        className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}
      >
        <header className="bg-white shadow-sm py-3">
            <h1 className="text-xl font-bold text-blue-600 text-center">
              <Link href="/" className="hover:text-blue-800 transition-colors">
                Bookmark Manager
              </Link>
            </h1>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Bookmark Manager - Powered by Phantom
          </div>
        </footer>
      </body>
    </html>
  );
}
