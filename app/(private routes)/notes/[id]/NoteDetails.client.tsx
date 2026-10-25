"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { fetchNoteById } from "@/lib/api/clientApi";

import styles from "./NoteDetails.module.css";

interface NoteDetailsProps {
  id: string;
}

export default function NoteDetails({ id }: NoteDetailsProps) {
  const {
    data: note,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isPending) {
    return <p>Loading note...</p>;
  }

  if (isError || !note) {
    return <p role="alert">Failed to load note details.</p>;
  }

  return (
    <article className={styles.container}>
      <Link href="/notes/filter/all">← Back to notes</Link>

      <h1>{note.title}</h1>

      <p>
        <strong>Tag:</strong> {note.tag}
      </p>

      <p>{note.content || "No content"}</p>

      <p>
        <strong>Created:</strong>{" "}
        {new Date(note.createdAt).toLocaleDateString()}
      </p>

      <p>
        <strong>Updated:</strong>{" "}
        {new Date(note.updatedAt).toLocaleDateString()}
      </p>
    </article>
  );
}
