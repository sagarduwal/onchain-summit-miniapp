import { EVENTS, Event } from '@/app/constant';
import { NextRequest, NextResponse } from 'next/server';


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
  } catch {
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
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
