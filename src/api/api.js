import axios from "axios";

const api = axios.create({
    // baseURL: 'https://api.mini-crm.org/',
    baseURL: 'http://localhost:8000/',
    withCredentials: true,
    headers: {
        accept: 'application/json',
      },
});

export default api;