"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import styles from "./MyRSVPs.module.css";
import EventModal from "./EventModal";

interface UserRSVP {
  id: string;
  userAddress: string;
  eventId: string;
  rsvpDate: string;
  eventName: string;
  eventDate: string;
  eventDescription: string;
  eventLink: string;
}

interface UserRSVPsResponse {
  success: boolean;
  data: {
    rsvps: UserRSVP[];
    count: number;
  };
}

export default function MyRSVPs() {
  const { address, isConnected } = useAccount();
  const [rsvps, setRSVPs] = useState<UserRSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUserRSVPs = async () => {
    if (!address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/user/rsvps?userAddress=${address}`);
      const data: UserRSVPsResponse = await response.json();

      if (data.success) {
        setRSVPs(data.data.rsvps);
      } else {
        setError("Failed to load your RSVPs");
      }
    } catch (err) {
      setError("Failed to load your RSVPs");
      console.error("Error fetching user RSVPs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRSVPs();
  }, [address]);

  const handleEventClick = (rsvp: UserRSVP) => {
    // Convert RSVP to Event format for the modal
    const event = {
      id: rsvp.eventId,
      name: rsvp.eventName,
      date: rsvp.eventDate,
      description: rsvp.eventDescription,
      link: rsvp.eventLink,
      rsvpCount: 0, // We don't have this info in RSVP data
    };
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  if (!isConnected) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My RSVPs</h1>
          <p className={styles.subtitle}>Connect your wallet to view your RSVP'd events</p>
        </div>
        <div className={styles.connectPrompt}>
          <p>Please connect your wallet to see your RSVP history.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My RSVPs</h1>
          <p className={styles.subtitle}>Loading your RSVP'd events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My RSVPs</h1>
          <p className={styles.subtitle}>Error loading your RSVPs</p>
          <p className={styles.error}>{error}</p>
        </div>
      </div>
    );
  }

  if (rsvps.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My RSVPs</h1>
          <p className={styles.subtitle}>You haven't RSVP'd to any events yet</p>
        </div>
        <div className={styles.emptyState}>
          <p>Start exploring events and RSVP to see them here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My RSVPs</h1>
        <p className={styles.subtitle}>
          You're RSVP'd to {rsvps.length} event{rsvps.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className={styles.rsvpsList}>
        {rsvps.map((rsvp) => (
          <div 
            key={rsvp.id} 
            className={styles.rsvpCard}
            onClick={() => handleEventClick(rsvp)}
          >
            <div className={styles.rsvpHeader}>
              <h3 className={styles.eventName}>{rsvp.eventName}</h3>
              <span className={styles.rsvpDate}>
                RSVP'd {new Date(rsvp.rsvpDate).toLocaleDateString()}
              </span>
            </div>
            <p className={styles.eventDate}>{rsvp.eventDate}</p>
            <p className={styles.eventDescription}>{rsvp.eventDescription}</p>
            <div className={styles.rsvpActions}>
              <a
                href={rsvp.eventLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.learnMoreLink}
                onClick={(e) => e.stopPropagation()}
              >
                Event Details →
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
            // Refresh RSVPs to get updated data
            fetchUserRSVPs();
          }}
        />
      )}
    </div>
  );
}
