import { NextResponse } from "next/server";

interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  link: string;
  rsvpCount: number;
}

const EVENTS: Record<string, Event> = {
  "art-show": {
    id: "art-show",
    name: "Onchain Summit Art Show",
    date: "Thursday 4:30-8:00 PM",
    description: "Digital art showcase featuring amazing artists",
    link: "https://lu.ma/gibwsgx3",
    rsvpCount: 23,
  },
  "roor-osc-party": {
    id: "roor-osc-party",
    name: "ROOR OSC Party - Mustache Harbor",
    date: "Friday 9:30 PM",
    description: "ROOR OSC Party at Mustache Harbor, 111 Minna, SF, CA 94105",
    link: "https://www.onchainsummit.io",
    rsvpCount: 45,
  },
  "happy-hour": {
    id: "happy-hour",
    name: "Onchain Summit Happy Hour",
    date: "Friday 5:00-9:00 PM",
    description: "OSC Opening Happy Hour with DJ Mark Divita",
    link: "https://www.onchainsummit.io",
    rsvpCount: 67,
  },
  "main-stage": {
    id: "main-stage",
    name: "Onchain Summit Main Stage",
    date: "Saturday 1:30-5:00 PM",
    description: "Main stage presentations and talks",
    link: "https://www.onchainsummit.io",
    rsvpCount: 89,
  },
  "casino-night": {
    id: "casino-night",
    name: "OSC Casino Night",
    date: "Saturday 7:00-11:00 PM",
    description: "Casino Night hosted by Franco Finn",
    link: "https://www.onchainsummit.io",
    rsvpCount: 34,
  },
};

// GET /api/events/popular - Get most popular events sorted by RSVP count
export async function GET() {
  try {
    const events = Object.values(EVENTS);

    const popularEvents = events.sort((a, b) => b.rsvpCount - a.rsvpCount);

    const top3Events = popularEvents.slice(0, 3);

    return NextResponse.json({
      success: true,
      data: {
        popularEvents,
        top3Events,
        mostPopular: popularEvents[0] || null,
      },
    });
  } catch (error) {
    console.error("Error fetching popular events:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch popular events" },
      { status: 500 }
    );
  }
}
