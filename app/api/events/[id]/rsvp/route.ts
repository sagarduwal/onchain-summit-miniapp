import { NextRequest, NextResponse } from "next/server";
import { RSVPDatabase } from "@/app/lib/database";
import { EVENTS, Event } from '@/app/constant';

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
