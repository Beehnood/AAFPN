export type EventStatus = "DRAFT" | "PUBLISSHED" | "CANCELLED";

export type CalendarSystem =
    | "GREGORIAN"
    | "IMPERIAL";

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  slug: string;

  location: string | null;
  imageUrl?: string | null ;

  startAt: string;
  endAt: string | null;

  calendarSystem: CalendarSystem;
  calendarDateLabel: string | null;
  
  sourceUrl: string | null;

  status: string;

  createdAt: string;
};

export type EventAPiResponse = {
    success: boolean;
    count: number;
    events: Event[];
};
