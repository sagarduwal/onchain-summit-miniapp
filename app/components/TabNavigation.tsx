"use client";
import { useState } from "react";
import styles from "./TabNavigation.module.css";
import EventsList from "./EventsList";
import MyRSVPs from "./MyRSVPs";

type TabType = "events" | "rsvps";

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState<TabType>("events");

  return (
    <div className={styles.container}>
      <div className={styles.tabHeader}>
        <div className={styles.tabButtons}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "events" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("events")}
          >
            <span className={styles.tabIcon}>🎉</span>
            All Events
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "rsvps" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("rsvps")}
          >
            <span className={styles.tabIcon}>📅</span>
            My RSVPs
          </button>
        </div>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "events" && <EventsList />}
        {activeTab === "rsvps" && <MyRSVPs />}
      </div>
    </div>
  );
}
