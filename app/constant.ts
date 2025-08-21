export interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  link: string;
  rsvpCount: number;
}

export const EVENTS: Record<string, Event> = {
  "art-show": {
    id: "art-show",
    name: "Onchain Summit Art Show",
    date: "Thursday 4:30-8:00 PM",
    description: "Digital art showcase featuring amazing artists",
    link: "https://lu.ma/gibwsgx3",
    rsvpCount: 0,
  },
  "roor-osc-party": {
    id: "roor-osc-party",
    name: "ROOR OSC Party",
    date: "Friday 8:00-11:00 PM",
    description: "Exclusive party for Onchain Summit attendees",
    link: "https://lu.ma/roor-osc-party",
    rsvpCount: 0,
  },
  "dev-workshop": {
    id: "dev-workshop",
    name: "Developer Workshop",
    date: "Saturday 2:00-5:00 PM",
    description: "Hands-on blockchain development workshop",
    link: "https://lu.ma/dev-workshop",
    rsvpCount: 0,
  },
  networking: {
    id: "networking",
    name: "Networking Mixer",
    date: "Sunday 6:00-9:00 PM",
    description: "Connect with fellow blockchain enthusiasts",
    link: "https://lu.ma/networking",
    rsvpCount: 0,
  },
  "panel-discussion": {
    id: "panel-discussion",
    name: "Panel Discussion",
    date: "Monday 3:00-4:30 PM",
    description: "Industry leaders discuss the future of Web3",
    link: "https://lu.ma/panel-discussion",
    rsvpCount: 0,
  },
};
