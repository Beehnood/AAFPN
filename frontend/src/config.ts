const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const BASE_API = (
    configuredApiBaseUrl || "http://localhost:3000/api"
).replace(/\/$/, "");

export const API_ORIGIN = BASE_API.replace(/\/api$/,"");



