"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useNoteStore } from "../../lib/store/noteStore";
import type { CreateNoteData } from "../../types/note";

import { createNote } from "@/lib/api/clientApi";
import css from "./NoteForm.module.css";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const mutation = useMutation({
    mutationFn: (note: CreateNoteData) =>
      createNote({
        ...note,
        content: note.content ?? "",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
  });

  async function formAction(formData: FormData) {
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const tag = String(formData.get("tag") ?? "Todo");

    if (title.length < 3 || title.length > 50) {
      return;
    }

    if (content.length > 500) {
      return;
    }

    const note: CreateNoteData = {
      title,
      content: content || undefined,
      tag,
    };

    mutation.mutate(note);
  }

  if (!ready) {
    return null;
  }

  return (
    <form action={formAction} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Enter note title"
          minLength={3}
          maxLength={50}
          required
          defaultValue={draft.title}
          onChange={(event) => setDraft({ title: event.currentTarget.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          placeholder="Enter note content"
          maxLength={500}
          defaultValue={draft.content}
          onChange={(event) => setDraft({ content: event.currentTarget.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          required
          defaultValue={draft.tag}
          onChange={(event) => setDraft({ tag: event.currentTarget.value })}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      {mutation.isError && (
        <p role="alert">
          Не вдалося створити нотатку. {mutation.error.message}
        </p>
      )}

      <div className={css.actions}>
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>

        <button
          type="button"
          disabled={mutation.isPending}
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
