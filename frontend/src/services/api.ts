
import axios from 'axios';
import { BASE_API } from '../config';

const api = axios.create({
    baseURL: BASE_API,
    headers: {
        "Content-Type" : "application/json",
    },
});

export default api;
