import axios from "axios";

const BASE_API_URL = "https://malayaadventures.com/api/v1";
export const BASE_URL = "https://malayaadventures.com/";

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🟢 Tambahkan interceptor agar token dikirim otomatis
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken"); // ambil token dari localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
