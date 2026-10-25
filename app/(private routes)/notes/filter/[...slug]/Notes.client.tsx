"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import { fetchNotes } from "@/lib/api";
import type { Note } from "@/types/note";

const PER_PAGE = 12;

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const updateDebouncedSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value.trim());
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    updateDebouncedSearch(value);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", tag, page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch,
        tag,
      }),
    placeholderData: (previousData) => previousData,
  });

  const notes: Note[] = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <main>
      <header>
        <h1>Notes</h1>
        <Link href="/notes/action/create">Create note</Link>
      </header>

      <section>
        <SearchBox value={search} onChange={handleSearchChange} />

        {isLoading && <p>Loading notes...</p>}

        {isError && <p role="alert">Failed to load notes. Please try again.</p>}

        {!isLoading && !isError && notes.length === 0 && <p>No notes found.</p>}

        {!isError && notes.length > 0 && <NoteList notes={notes} />}

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </main>
  );
}
