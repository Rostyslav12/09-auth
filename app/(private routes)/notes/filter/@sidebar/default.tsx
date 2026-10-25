import Link from "next/link";

import styles from "./Sidebar.module.css";

const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Notes</h2>

      <nav aria-label="Note filters">
        <ul className={styles.list}>
          <li>
            <Link className={styles.link} href="/notes/filter/all">
              All notes
            </Link>
          </li>

          {tags.map((tag) => (
            <li key={tag}>
              <Link className={styles.link} href={`/notes/filter/${tag}`}>
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
