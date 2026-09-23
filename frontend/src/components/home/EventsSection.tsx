import { useEffect, useState } from "react";

import { getEvents } from "../../services/event.services.ts";
import type { Event } from "../../types/event.ts";

const ITEMS_PER_PAGE = 2;

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);

        const data = await getEvents();

        const now = new Date();

        const upcomingEvents = data
          .filter((event) => {
            return (
              event.status === "PUBLISHED" &&
              new Date(event.endAt ?? event.startAt) >= now
            );
          })
          .sort(
            (a, b) =>
              new Date(a.startAt).getTime() -
              new Date(b.startAt).getTime()
          );

        if (active) setEvents(upcomingEvents);
      } catch (error) {
        console.error("Erreur événements :", error);

        if (active) {
          setError("Impossible de charger les événements pour le moment.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadEvents();

    return () => {
      active = false;
    };
  }, []);

  const visibleEvents = events.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  function previousEvents() {
    setStartIndex((previous) =>
      Math.max(previous - ITEMS_PER_PAGE, 0)
    );
  }

  function nextEvents() {
    setStartIndex((previous) =>
      Math.min(
        previous + ITEMS_PER_PAGE,
        Math.max((Math.ceil(events.length / ITEMS_PER_PAGE) - 1) * ITEMS_PER_PAGE, 0)
      )
    );
  }

  return (
    <section
      id="events"
      aria-labelledby="events-heading"
      aria-busy={loading}
      className="relative overflow-hidden bg-white px-5 py-16 sm:px-8 md:py-24"
    >
      <div className="mx-auto max-w-4xl">
        <h2
          id="events-heading"
          className="mb-10 text-center text-2xl font-bold uppercase tracking-wide text-[#0077c8] md:mb-12 md:text-3xl"
        >
          Nos événements
        </h2>

        {loading ? (
          <p role="status" className="flex min-h-64 items-center justify-center text-center text-[#0077c8]">
            Chargement des événements…
          </p>
        ) : error ? (
          <p role="alert" className="flex min-h-64 items-center justify-center text-center text-red-600">
            {error}
          </p>
        ) : events.length === 0 ? (
          <p className="flex min-h-64 items-center justify-center text-center text-gray-500">
            Aucun événement à venir pour le moment.
          </p>
        ) : (
          <>
            <div className="relative">
              <img
                src="/images/logo-couleur.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 m-auto max-h-full w-4/5 object-contain opacity-[0.05]"
              />
              <div id="events-list" className="relative grid gap-6">
                {visibleEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>

            {events.length > ITEMS_PER_PAGE && (
              <nav aria-label="Pagination des événements" className="mt-8 flex items-center justify-center gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={previousEvents}
                  disabled={startIndex === 0}
                  aria-label="Événements précédents"
                  aria-controls="events-list"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#0077c8]/30 text-[#0077c8] transition-colors enabled:hover:bg-[#0077c8] enabled:hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0077c8] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <span aria-hidden="true" className="text-2xl">←</span>
                </button>
                <p role="status" aria-atomic="true" className="text-center text-sm tabular-nums text-gray-600">
                  {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, events.length)} sur {events.length} événements
                </p>
                <button
                  type="button"
                  onClick={nextEvents}
                  disabled={startIndex + ITEMS_PER_PAGE >= events.length}
                  aria-label="Événements suivants"
                  aria-controls="events-list"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#0077c8]/30 text-[#0077c8] transition-colors enabled:hover:bg-[#0077c8] enabled:hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0077c8] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <span aria-hidden="true" className="text-2xl">→</span>
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
}

type EventCardProps = {
  event: Event;
};

function EventCard({ event }: EventCardProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const hasImage = Boolean(event.imageUrl && event.imageUrl !== failedImageUrl);

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white/25 hover:shadow-lg sm:flex-row transition-all duration-300">
      <div className="flex h-48 shrink-0 items-center justify-center overflow-hidden bg-sky-50 sm:h-auto sm:min-h-60 sm:w-[38%]">
        <img
          src={hasImage ? event.imageUrl! : "/images/logo-couleur.png"}
          alt=""
          loading="lazy"
          onError={hasImage ? () => setFailedImageUrl(event.imageUrl!) : undefined}
          className={hasImage ? "h-full w-full object-cover" : "h-32 w-32 object-contain p-3"}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-6 md:p-7">
        <h3 className="mb-3 text-xl font-semibold leading-snug wrap-anywhere text-gray-800">
          {event.title}
        </h3>
        {event.description && (
          <p className="mb-5 whitespace-pre-line text-sm leading-relaxed wrap-anywhere text-gray-600">
            {event.description}
          </p>
        )}
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm leading-relaxed">
          <dt className="font-semibold text-gray-700">Date :</dt>
          <dd className="wrap-anywhere text-gray-600">
            <time dateTime={event.startAt}>{event.calendarDateLabel || formatDate(event.startAt)}</time>
          </dd>
          <dt className="font-semibold text-gray-700">Horaire :</dt>
          <dd className="text-gray-600">{formatTimeRange(event.startAt, event.endAt)}</dd>
          <dt className="font-semibold text-gray-700">Lieu :</dt>
          <dd className="wrap-anywhere text-gray-600">{event.location?.trim() || "À préciser"}</dd>
        </dl>
      </div>
    </article>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(date));
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).format(new Date(date));
}

function formatTimeRange(
  startAt: string,
  endAt: string | null
) {
  if (!endAt) {
    return formatTime(startAt);
  }

  return `${formatTime(startAt)} – ${formatTime(endAt)}`;
}
