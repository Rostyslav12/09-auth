import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchNoteById } from "@/lib/api";
import NoteDetails from "./NoteDetails.client";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);
    const title = `${note.title} | NoteHub`;
    const description = note.content
      ? note.content.slice(0, 160)
      : `View and manage the note "${note.title}" in NoteHub.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://notehub.com/notes/${encodeURIComponent(id)}`,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: `NoteHub note: ${note.title}`,
          },
        ],
      },
    };
  } catch {
    return {
      title: "Note not found | NoteHub",
      description: "The requested note could not be found in NoteHub.",
    };
  }
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    return <NoteDetails note={note} />;
  } catch {
    notFound();
  }
}
