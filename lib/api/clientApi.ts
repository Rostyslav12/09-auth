import api from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

export interface AuthRequest {
  email: string;
  password: string;
}

export interface NotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tag: string;
}

export async function fetchNotes(params: NotesParams = {}) {
  const { data } = await api.get("/notes", {
    params: { perPage: 12, ...params },
  });

  return data;
}

export async function fetchNoteById(id: string) {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(payload: CreateNoteRequest) {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

export async function deleteNote(id: string) {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

export async function register(payload: AuthRequest) {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}

export async function login(payload: AuthRequest) {
  const { data } = await api.post<User>("/auth/login", payload);
  return data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function checkSession() {
  const { data } = await api.get<User | null>("/auth/session");
  return data;
}

export async function getMe() {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(payload: { username: string }) {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}
