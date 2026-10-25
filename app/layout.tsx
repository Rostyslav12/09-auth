import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";

import "./globals.css";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "NoteHub | Personal Notes",
  description:
    "NoteHub helps you create, organize, search, and manage your personal notes.",
  openGraph: {
    title: "NoteHub | Personal Notes",
    description:
      "Create, organize, search, and manage your personal notes with NoteHub.",
    url: "https://notehub.com/",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub — personal notes application",
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="uk">
      <body className={roboto.variable}>
        <TanStackProvider>
          <AuthProvider>
            <div className="page">
              <Header />
              <main className="content">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
