-- CreateEnum
CREATE TYPE "CalendarSystem" AS ENUM ('GREGORIAN', 'SHAHANSHAHI');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "calendarDateLabel" TEXT,
ADD COLUMN     "calendarSystem" "CalendarSystem" NOT NULL DEFAULT 'GREGORIAN',
ADD COLUMN     "sourceUrl" TEXT;
