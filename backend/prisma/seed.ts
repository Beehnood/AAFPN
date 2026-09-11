import {
  CalendarSystem,
  EventStatus,
  Role,
} from "../src/generated/prisma/client.js";
import { prisma } from "../src/config/prisma.js";

const SOURCE_IMPERIAL = "https://gahshomar.app/en/education/about_imperial/";
const SOURCE_EVENTS = "https://gahshomar.app/en/events/";

const legacySlugs = [
  "gatha-gahambar-iii-shahanshahi-2026",
  "pateti-shahanshahi-2026",
  "nouvel-an-parsi-shahanshahi-2026",
  "khordad-sal-shahanshahi-2026",
];

const events = [
  {
    slug: "sadeh-2584",
    title: "Sadeh 2584",
    description:
      "Fête du feu célébrée cinquante jours avant Norouz pour vaincre symboliquement le froid.",
    startAt: new Date("2026-01-30T17:00:00.000Z"),
    endAt: new Date("2026-01-30T21:00:00.000Z"),
    calendarDateLabel: "10 Bahman 2584 — 30 janvier 2026",
  },
  {
    slug: "norouz-2585",
    title: "Norouz 2585",
    description:
      "Nouvel An persan célébrant l’équinoxe de printemps, le renouveau et le retour de la lumière.",
    startAt: new Date("2026-03-21T09:00:00.000Z"),
    endAt: new Date("2026-03-21T17:00:00.000Z"),
    calendarDateLabel: "1 Farvardin 2585 — 21 mars 2026",
  },
  {
    slug: "grand-norouz-khordad-sal-2585",
    title: "Grand Norouz — Khordad Sal 2585",
    description:
      "Sixième jour de Norouz et commémoration traditionnelle de la naissance de Zarathoustra.",
    startAt: new Date("2026-03-26T09:00:00.000Z"),
    endAt: new Date("2026-03-26T17:00:00.000Z"),
    calendarDateLabel: "6 Farvardin 2585 — 26 mars 2026",
  },
  {
    slug: "sizdah-bedar-2585",
    title: "Sizdah Bedar 2585",
    description:
      "Fête de la nature marquant le treizième jour et la fin des célébrations de Norouz.",
    startAt: new Date("2026-04-02T09:00:00.000Z"),
    endAt: new Date("2026-04-02T17:00:00.000Z"),
    calendarDateLabel: "13 Farvardin 2585 — 2 avril 2026",
  },
  {
    slug: "tirgan-2585",
    title: "Tirgan 2585",
    description:
      "Fête estivale de la pluie et de l’eau associée à la légende d’Arash l’Archer.",
    startAt: new Date("2026-07-04T09:00:00.000Z"),
    endAt: new Date("2026-07-04T17:00:00.000Z"),
    calendarDateLabel: "13 Tir 2585 — 4 juillet 2026",
  },
  {
    slug: "mehregan-2585",
    title: "Mehregan 2585",
    description:
      "Fête automnale de Mithra célébrant les récoltes, la gratitude, la lumière et l’amitié.",
    startAt: new Date("2026-10-08T09:00:00.000Z"),
    endAt: new Date("2026-10-08T17:00:00.000Z"),
    calendarDateLabel: "16 Mehr 2585 — 8 octobre 2026",
  },
  {
    slug: "yalda-2585",
    title: "Nuit de Yalda 2585",
    description:
      "Célébration de la nuit la plus longue de l’année avec poésie, grenades et convivialité.",
    startAt: new Date("2026-12-21T18:00:00.000Z"),
    endAt: new Date("2026-12-21T22:30:00.000Z"),
    calendarDateLabel: "30 Azar 2585 — 21 décembre 2026",
  },
] as const;

async function main(): Promise<void> {
  const calendarAdmin = await prisma.user.upsert({
    where: { email: "calendrier@aafpn.local" },
    update: { role: Role.ADMIN, isActive: false },
    create: {
      firstName: "Calendrier",
      lastName: "AAFPN",
      email: "calendrier@aafpn.local",
      passwordHash: "COMPTE_SYSTEME_INACTIF",
      role: Role.ADMIN,
      isActive: false,
    },
  });

  await prisma.event.deleteMany({
    where: { slug: { in: legacySlugs } },
  });

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {
        ...event,
        status: EventStatus.PUBLISHED,
        calendarSystem: CalendarSystem.IMPERIAL,
        sourceUrl: SOURCE_EVENTS,
      },
      create: {
        ...event,
        status: EventStatus.PUBLISHED,
        calendarSystem: CalendarSystem.IMPERIAL,
        sourceUrl: SOURCE_EVENTS,
        createdById: calendarAdmin.id,
      },
    });
  }

  console.log(
    `${events.length} événements du calendrier impérial créés ou mis à jour (${SOURCE_IMPERIAL}).`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("Échec du seed des événements :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
