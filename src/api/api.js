import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8000/',
    withCredentials: true,
    headers: {
        accept: 'application/json',
      },
});

export default api;