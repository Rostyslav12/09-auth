"use client";

import Link from "next/link";

import type { Note } from "../../../../types/note";
import styles from "./NoteDetails.module.css";

interface NoteDetailsProps {
  note: Note;
}

export default function NoteDetails({ note }: NoteDetailsProps) {
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
