"use client";
import { useState, useEffect } from "react";
import styles from "./EventsList.module.css";
import TopEvents from "./TopEvents";
import EventModal from "./EventModal";

interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  link: string;
  rsvpCount: number;
}

interface EventsResponse {
  success: boolean;
  data: {
    events: Event[];
    stats: {
      totalEvents: number;
      totalRSVPs: number;
    };
  };
}

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalRSVPs, setTotalRSVPs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events");
      const data: EventsResponse = await response.json();

      if (data.success) {
        setEvents(data.data.events);
        setTotalEvents(data.data.stats.totalEvents);
        setTotalRSVPs(data.data.stats.totalRSVPs);
      } else {
        setError("Failed to load events");
      }
    } catch (err) {
      setError("Failed to load events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Loading Events...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Error Loading Events</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TopEvents
        totalEvents={totalEvents}
        totalRSVPs={totalRSVPs}
        onEventClick={handleEventClick}
      />

      <div className={styles.eventsList}>
        {events.map((event) => (
          <div
            key={event.id}
            className={styles.eventCard}
            onClick={() => handleEventClick(event)}
          >
            <div className={styles.eventHeader}>
              <h3 className={styles.eventName}>{event.name}</h3>
              <div className={styles.rsvpCounter}>
                <span className={styles.rsvpCount}>{event.rsvpCount}</span>
                <span className={styles.rsvpLabel}>RSVPs</span>
              </div>
            </div>
            <p className={styles.eventDate}>📅 {event.date}</p>
            <p className={styles.eventDescription}>{event.description}</p>

            <div className={styles.eventActions}>
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.learnMoreLink}
                onClick={(e) => e.stopPropagation()}
              >
                Learn More →
              </a>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={handleCloseModal}
          onRSVP={() => {
            // Refresh events to get updated RSVP count
            fetchEvents();
          }}
        />
      )}
    </div>
  );
}
