"use client";
import { useState, useEffect } from "react";
import styles from "./TopEvents.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";

interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  link: string;
  rsvpCount: number;
}

interface PopularEventsResponse {
  success: boolean;
  data: {
    top3Events: Event[];
    mostPopular: Event;
  };
}

interface TopEventsProps {
  totalEvents: number;
  totalRSVPs: number;
}

export default function TopEvents({ totalEvents, totalRSVPs }: TopEventsProps) {
  const [topEvents, setTopEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularEvents = async () => {
      try {
        const response = await fetch("/api/events/popular");
        const data: PopularEventsResponse = await response.json();

        if (data.success) {
          setTopEvents(data.data.top3Events);
        }
      } catch (error) {
        console.error("Error fetching popular events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularEvents();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.appTitle}>Onchain Summit Events</h1>
          <div className={styles.rightSection}>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>...</span>
                <span className={styles.statLabel}>Events</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>...</span>
                <span className={styles.statLabel}>RSVPs</span>
              </div>
            </div>
            <div className={styles.walletContainer}>
              <Wallet />
            </div>
          </div>
        </div>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.appTitle}>Onchain Summit Events</h1>
        <div className={styles.rightSection}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{totalEvents}</span>
              <span className={styles.statLabel}>Events</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{totalRSVPs}</span>
              <span className={styles.statLabel}>RSVPs</span>
            </div>
          </div>
          <div className={styles.walletContainer}>
            <Wallet />
          </div>
        </div>
      </div>

      <div className={styles.storiesContainer}>
        <div className={styles.storiesLabel}>Popular Events</div>
        <div className={styles.storiesList}>
          {topEvents.map((event, index) => (
            <div key={event.id} className={styles.storyCard}>
              <div className={styles.storyRing}>
                <div className={styles.storyContent}>
                  <div className={styles.storyRank}>#{index + 1}</div>
                  {index === 0 && <div className={styles.storyCrown}>👑</div>}
                </div>
              </div>
              <div className={styles.storyInfo}>
                <div className={styles.storyName}>
                  {event.name.split(" ").slice(0, 2).join(" ")}
                </div>
                <div className={styles.storyRsvps}>{event.rsvpCount} RSVPs</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
