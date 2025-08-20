import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (same as events route - in production, use shared database)
const EVENTS: Record<string, any> = {
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

// POST /api/events/[id]/rsvp - RSVP to an event
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    
    if (!EVENTS[eventId]) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Increment RSVP count
    EVENTS[eventId].rsvpCount += 1;

    return NextResponse.json({
      success: true,
      data: {
        eventId,
        eventName: EVENTS[eventId].name,
        newRsvpCount: EVENTS[eventId].rsvpCount,
        message: `✅ You're RSVP'd for ${EVENTS[eventId].name}!`
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to RSVP to event' },
      { status: 500 }
    );
  }
}

// GET /api/events/[id]/rsvp - Get RSVP count for an event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    
    if (!EVENTS[eventId]) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        eventId,
        eventName: EVENTS[eventId].name,
        rsvpCount: EVENTS[eventId].rsvpCount
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get RSVP count' },
      { status: 500 }
    );
  }
}
