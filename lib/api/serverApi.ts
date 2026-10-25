import "server-only";

import { cookies } from "next/headers";
import api from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import type { NotesParams } from "./clientApi";

async function getCookieHeader() {
  const cookieStore = await cookies();

  return cookieStore.toString();
}

export async function fetchNotes(params: NotesParams = {}) {
  const { data } = await api.get("/notes", {
    params: { perPage: 12, ...params },
  });

  return data;
}

export async function fetchNoteById(id: string) {
  const cookie = await getCookieHeader();

  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookie },
  });

  return data;
}

export async function checkSession() {
  const cookie = await getCookieHeader();

  const { data } = await api.get<User | null>("/auth/session", {
    headers: { Cookie: cookie },
  });

  return data;
}

export async function getMe() {
  const cookie = await getCookieHeader();

  const { data } = await api.get<User>("/users/me", {
    headers: { Cookie: cookie },
  });

  return data;
}
