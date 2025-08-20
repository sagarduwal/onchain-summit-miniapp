"use client";
import styles from "./page.module.css";
import EventsList from "./components/EventsList";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <EventsList />
      </div>
    </div>
  );
}
