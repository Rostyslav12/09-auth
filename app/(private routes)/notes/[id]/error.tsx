"use client";

interface NoteDetailsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function NoteDetailsError({
  error,
  reset,
}: NoteDetailsErrorProps) {
  return (
    <div role="alert">
      <h2>Failed to load note details.</h2>
      <p>{error.message}</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
