"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import styles from "./EventModal.module.css";

interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  link: string;
  rsvpCount: number;
}

interface EventModalProps {
  event: Event | null;
  onClose: () => void;
  onRSVP?: () => void;
}

export default function EventModal({
  event,
  onClose,
  onRSVP,
}: EventModalProps) {
  const { address, isConnected } = useAccount();
  const [isRSVPing, setIsRSVPing] = useState(false);

  if (!event) return null;

  const handleRSVP = async () => {
    if (!isConnected || !address) {
      // alert("Please connect your wallet to RSVP");
      return;
    }

    setIsRSVPing(true);
    try {
      const response = await fetch(`/api/events/${event.id}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAddress: address,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("RSVP successful:", data.data.message);
        // alert(data.data.message || "Successfully RSVP'd!");
        if (onRSVP) {
          onRSVP();
        }
        onClose();
      } else {
        console.error("Failed to RSVP:", data.error);
        // alert(data.error || "Failed to RSVP. Please try again.");
      }
    } catch (err) {
      console.error("Error RSVPing to event:", err);
      // alert("An error occurred while RSVPing. Please try again.");
    } finally {
      setIsRSVPing(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <div className={styles.modalHeader}>
          <h2 className={styles.eventTitle}>{event.name}</h2>
          <div className={styles.rsvpBadge}>
            <span className={styles.rsvpCount}>{event.rsvpCount}</span>
            <span className={styles.rsvpLabel}>RSVPs</span>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.eventDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>📅</span>
              <span className={styles.detailText}>{event.date}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>📍</span>
              <span className={styles.detailText}>Onchain Summit</span>
            </div>
          </div>

          <div className={styles.eventDescription}>
            <h3>About this event</h3>
            <p>{event.description}</p>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.rsvpButton}
            onClick={handleRSVP}
            disabled={isRSVPing}
            style={{ display: "none" }}
          >
            {isRSVPing ? "RSVPing..." : "RSVP Now"}
          </button>
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.learnMoreButton}
          >
            Learn More →
          </a>
        </div>
      </div>
    </div>
  );
}
