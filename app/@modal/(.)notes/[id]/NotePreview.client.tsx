"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { fetchNoteById } from "@/lib/api/clientApi";
import Modal from "../../../../components/Modal/Modal";

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const {
    data: note,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={handleClose}>
      {isPending && <p>Loading note...</p>}

      {isError && <p role="alert">Failed to load note details.</p>}

      {note && (
        <article>
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
      )}
    </Modal>
  );
}
