import { NextRequest, NextResponse } from "next/server";
import { RSVPDatabase } from "@/app/lib/database";
import { EVENTS } from "@/app/constant";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get("userAddress");

    if (!userAddress) {
      return NextResponse.json(
        {
          success: false,
          error: "User address is required",
        },
        { status: 400 }
      );
    }

    const userRSVPs = RSVPDatabase.getUserRSVPs(userAddress);

    return NextResponse.json({
      success: true,
      data: {
        rsvps: userRSVPs,
        count: userRSVPs.length,
      },
    });
  } catch (error) {
    console.error("Error fetching user RSVPs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user RSVPs",
      },
      { status: 500 }
    );
  }
}


export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get("userAddress");
    const eventId = searchParams.get("eventId");

    if (!userAddress || !eventId) {
      return NextResponse.json(
        { success: false, error: "User address and event ID are required" },
        { status: 400 }
      );
    }

    const removed = RSVPDatabase.removeRSVP(userAddress, eventId);

    if (!removed) {
      return NextResponse.json(
        { success: false, error: "RSVP not found for this user and event" },
        { status: 404 }
      );
    }

    if (EVENTS[eventId]) {
      EVENTS[eventId].rsvpCount = RSVPDatabase.getEventRSVPCount(eventId);
    }

    return NextResponse.json({
      success: true,
      message: `✅ RSVP removed for event ${eventId} by user ${userAddress}`,
      newRsvpCount: EVENTS[eventId]?.rsvpCount ?? 0,
    });
  } catch (error) {
    console.error("Error removing RSVP:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove RSVP" },
      { status: 500 }
    );
  }
}