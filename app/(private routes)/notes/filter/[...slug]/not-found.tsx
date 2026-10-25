import Link from "next/link";

export default function NotesNotFound() {
  return (
    <div>
      <h1>Note filter not found</h1>
      <p>The selected note filter does not exist.</p>
      <Link href="/notes/filter/all">Show all notes</Link>
    </div>
  );
}
