import type { Event, EventAPiResponse } from "../types/event";
import api from "./api";



export const getEvents = async (): Promise<Event[]> => {

    const response = await api.get<EventAPiResponse>("/events");

    if (!Array.isArray(response.data.events)) {
        throw new Error("Réponse API invalide : la liste des événements est absente");
    }

    return response.data.events;
}
