import { NextRequest, NextResponse } from "next/server";
import { RSVPDatabase } from "@/app/lib/database";

// In-memory storage for events (in production, this would be a database)
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
    name: "ROOR OSC Party",
    date: "Friday 8:00-11:00 PM",
    description: "Exclusive party for Onchain Summit attendees",
    link: "https://lu.ma/roor-osc-party",
    rsvpCount: 15,
  },
  "dev-workshop": {
    id: "dev-workshop",
    name: "Developer Workshop",
    date: "Saturday 2:00-5:00 PM",
    description: "Hands-on blockchain development workshop",
    link: "https://lu.ma/dev-workshop",
    rsvpCount: 8,
  },
  "networking": {
    id: "networking",
    name: "Networking Mixer",
    date: "Sunday 6:00-9:00 PM",
    description: "Connect with fellow blockchain enthusiasts",
    link: "https://lu.ma/networking",
    rsvpCount: 31,
  },
  "panel-discussion": {
    id: "panel-discussion",
    name: "Panel Discussion",
    date: "Monday 3:00-4:30 PM",
    description: "Industry leaders discuss the future of Web3",
    link: "https://lu.ma/panel-discussion",
    rsvpCount: 12,
  },
};

// POST /api/events/[id]/rsvp - RSVP to an event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const eventId = resolvedParams.id;
    
    // Get user address from request body
    const body = await request.json();
    const userAddress = body.userAddress;

    if (!userAddress) {
      return NextResponse.json(
        { success: false, error: "User address is required" },
        { status: 400 }
      );
    }

    if (!EVENTS[eventId]) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if user has already RSVP'd
    if (RSVPDatabase.hasUserRSVPd(userAddress, eventId)) {
      return NextResponse.json(
        { success: false, error: "You have already RSVP'd to this event" },
        { status: 400 }
      );
    }

    // Add RSVP to database
    const rsvp = RSVPDatabase.addRSVP(userAddress, EVENTS[eventId]);
    
    // Update event RSVP count based on database
    const newRsvpCount = RSVPDatabase.getEventRSVPCount(eventId);
    EVENTS[eventId].rsvpCount = newRsvpCount;

    return NextResponse.json({
      success: true,
      data: {
        eventId,
        eventName: EVENTS[eventId].name,
        newRsvpCount,
        rsvpId: rsvp.id,
        message: `✅ You're RSVP'd for ${EVENTS[eventId].name}!`,
      },
    });
  } catch (error) {
    console.error("Error RSVPing to event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to RSVP to event" },
      { status: 500 }
    );
  }
}

// GET /api/events/[id]/rsvp - Get RSVP count for an event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const eventId = resolvedParams.id;

    if (!EVENTS[eventId]) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        eventId,
        eventName: EVENTS[eventId].name,
        rsvpCount: EVENTS[eventId].rsvpCount,
      },
    });
  } catch (error) {
    console.error("Error getting RSVP count:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get RSVP count" },
      { status: 500 }
    );
  }
}
