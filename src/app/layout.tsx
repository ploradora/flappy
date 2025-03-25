import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600">
              <a href="/" className="hover:text-blue-800 transition-colors">
                Bookmark Manager
              </a>
            </h1>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <a
                    href="/overview"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Overview
                  </a>
                </li>
              </ul>
            </nav>
          </div>
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
