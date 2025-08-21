"use client";
import styles from "./page.module.css";
import TabNavigation from "./components/TabNavigation";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <TabNavigation />
      </div>
    </div>
  );
}
