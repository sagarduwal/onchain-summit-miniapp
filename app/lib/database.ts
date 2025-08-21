// Simple in-memory database for user RSVPs
// In production, this would be replaced with a real database like PostgreSQL, MongoDB, etc.

export interface UserRSVP {
  id: string;
  userAddress: string;
  eventId: string;
  rsvpDate: string;
  eventName: string;
  eventDate: string;
  eventDescription: string;
  eventLink: string;
}

// In-memory storage for user RSVPs
let userRSVPs: UserRSVP[] = [];

export class RSVPDatabase {
  // Add a new RSVP for a user
  static addRSVP(userAddress: string, event: { id: string; name: string; date: string; description: string; link: string }): UserRSVP {
    const rsvpId = `rsvp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newRSVP: UserRSVP = {
      id: rsvpId,
      userAddress: userAddress.toLowerCase(),
      eventId: event.id,
      rsvpDate: new Date().toISOString(),
      eventName: event.name,
      eventDate: event.date,
      eventDescription: event.description,
      eventLink: event.link,
    };

    userRSVPs.push(newRSVP);
    return newRSVP;
  }

  // Check if user has already RSVP'd to an event
  static hasUserRSVPd(userAddress: string, eventId: string): boolean {
    return userRSVPs.some(
      rsvp => rsvp.userAddress === userAddress.toLowerCase() && rsvp.eventId === eventId
    );
  }

  // Get all RSVPs for a specific user
  static getUserRSVPs(userAddress: string): UserRSVP[] {
    return userRSVPs.filter(rsvp => rsvp.userAddress === userAddress.toLowerCase());
  }

  // Remove an RSVP (if user wants to cancel)
  static removeRSVP(userAddress: string, eventId: string): boolean {
    const initialLength = userRSVPs.length;
    userRSVPs = userRSVPs.filter(
      rsvp => !(rsvp.userAddress === userAddress.toLowerCase() && rsvp.eventId === eventId)
    );
    return userRSVPs.length < initialLength;
  }

  // Get total RSVP count for an event
  static getEventRSVPCount(eventId: string): number {
    return userRSVPs.filter(rsvp => rsvp.eventId === eventId).length;
  }

  // Get all RSVPs (for admin purposes)
  static getAllRSVPs(): UserRSVP[] {
    return [...userRSVPs];
  }
}
