import { NextRequest, NextResponse } from 'next/server';

// Event data structure
export interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  link: string;
  rsvpCount: number;
}

// In-memory storage (in production, use a database)
const EVENTS: Record<string, Event> = {
  "art-show": {
    id: "art-show",
    name: "Onchain Summit Art Show",
    date: "Thursday 4:30-8:00 PM",
    description: "Digital art showcase featuring amazing artists",
    link: "https://lu.ma/gibwsgx3",
    rsvpCount: 23
  },
  "roor-osc-party": {
    id: "roor-osc-party",
    name: "ROOR OSC Party - Mustache Harbor", 
    date: "Friday 9:30 PM",
    description: "ROOR OSC Party at Mustache Harbor, 111 Minna, SF, CA 94105",
    link: "https://www.onchainsummit.io",
    rsvpCount: 45
  },
  "happy-hour": {
    id: "happy-hour",
    name: "Onchain Summit Happy Hour",
    date: "Friday 5:00-9:00 PM", 
    description: "OSC Opening Happy Hour with DJ Mark Divita",
    link: "https://www.onchainsummit.io",
    rsvpCount: 67
  },
  "main-stage": {
    id: "main-stage",
    name: "Onchain Summit Main Stage",
    date: "Saturday 1:30-5:00 PM",
    description: "Main stage presentations and talks", 
    link: "https://www.onchainsummit.io",
    rsvpCount: 89
  },
  "casino-night": {
    id: "casino-night",
    name: "OSC Casino Night",
    date: "Saturday 7:00-11:00 PM",
    description: "Casino Night hosted by Franco Finn",
    link: "https://www.onchainsummit.io",
    rsvpCount: 34
  }
};

// GET /api/events - List all events
export async function GET() {
  try {
    const events = Object.values(EVENTS);
    const totalEvents = events.length;
    const totalRSVPs = events.reduce((sum, event) => sum + event.rsvpCount, 0);

    return NextResponse.json({
      success: true,
      data: {
        events,
        stats: {
          totalEvents,
          totalRSVPs
        }
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event (for future use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, date, description, link } = body;

    if (!name || !date || !description || !link) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    const newEvent: Event = {
      id,
      name,
      date,
      description,
      link,
      rsvpCount: 0
    };

    EVENTS[id] = newEvent;

    return NextResponse.json({
      success: true,
      data: newEvent
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
