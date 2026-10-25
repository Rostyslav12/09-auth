import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page not found | NoteHub",
  description:
    "Sorry, the page you are looking for could not be found in NoteHub.",
  openGraph: {
    title: "404 - Page not found | NoteHub",
    description:
      "The requested page could not be found. Return to NoteHub to manage your notes.",
    url: "https://notehub.com/404",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub - page not found",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <main
      style={{
        maxWidth: "640px",
        margin: "80px auto",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <h1>404 — Page not found</h1>

      <p>Sorry, the page you are looking for could not be found.</p>

      <Link href="/notes/filter/all">Back to notes</Link>
    </main>
  );
}
