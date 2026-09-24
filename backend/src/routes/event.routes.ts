import {Router} from "express";

import {
    createEvent,
    getEventBySlug,
    getEvents,
    updateEvent,
    deleteEvent,
    getEventsCalendar,
} from "../controllers/event.controller.js";


import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middlewares.js";

import {Role} from "../generated/prisma/client.js"

const router = Router();

// ===== PUBLIC =====

router.get("/", getEvents);
router.get("/calendar", getEventsCalendar);
router.get("/:slug", getEventBySlug);



// ====== ADMIN ====

router.post("/", 
    authenticate,
    authorizeRoles(Role.ADMIN),
    createEvent
)

router.put("/:id", 
    authenticate,
    authorizeRoles(Role.ADMIN),
    updateEvent
)

router.delete("/:id", 
    authenticate,
    authorizeRoles(Role.ADMIN),
    deleteEvent
)

export default router;