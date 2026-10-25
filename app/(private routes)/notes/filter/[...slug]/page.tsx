import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchNotes } from "@/lib/api/clientApi";
import NotesClient from "./Notes.client";

const allowedTags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];
const PER_PAGE = 12;

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

function getTag(requestedTag: string): string | undefined {
  if (requestedTag.toLowerCase() === "all") {
    return "all";
  }

  return allowedTags.find(
    (tag) => tag.toLowerCase() === requestedTag.toLowerCase()
  );
}

export async function generateMetadata({
  params,
}: Pick<NotesPageProps, "params">): Promise<Metadata> {
  const { slug } = await params;
  const requestedTag = slug[0] ?? "all";
  const tag = getTag(requestedTag);

  if (!tag || slug.length !== 1) {
    return {
      title: "Notes not found | NoteHub",
      description: "The requested notes filter does not exist.",
    };
  }

  const title =
    tag === "all" ? "All notes | NoteHub" : `${tag} notes | NoteHub`;
  const description =
    tag === "all"
      ? "Browse and manage all your notes in NoteHub."
      : `Browse and manage your ${tag} notes in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${encodeURIComponent(tag)}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `NoteHub - ${tag} notes`,
        },
      ],
    },
  };
}

export default async function NotesPage({
  params,
  searchParams,
}: NotesPageProps) {
  const { slug } = await params;
  const query = await searchParams;

  if (slug.length !== 1 || !slug[0]) {
    notFound();
  }

  const tag = getTag(slug[0]);

  if (!tag) {
    notFound();
  }

  const parsedPage = Number(query.page ?? "1");
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const search = query.search?.trim() ?? "";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag, page, search],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
        tag: tag === "all" ? undefined : tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
