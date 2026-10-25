import styles from "./layout.module.css";

interface FilterLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function FilterLayout({ children, sidebar }: FilterLayoutProps) {
  return (
    <div className={styles.layout}>
      {sidebar}
      <section className={styles.content}>{children}</section>
    </div>
  );
}
