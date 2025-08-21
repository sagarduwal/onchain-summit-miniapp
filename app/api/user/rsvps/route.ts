import { NextRequest, NextResponse } from "next/server";
import { RSVPDatabase } from "@/app/lib/database";

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
