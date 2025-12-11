// src/services/apiClient.ts
import axios from "axios";
import { auth } from "../lib/firebase";

// Ambil baseURL dari .env, fallback ke localhost kalau belum di-set
const baseURL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:5012/api/";

const apiClient = axios.create({
  baseURL,
});

// Request interceptor: sisipkan Authorization Bearer token kalau user login
apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      if (!config.headers) {
        config.headers = {} as any;
      }
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: jika Unauthorized, paksa logout & redirect ke /login
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.error;

    if (
      status === 401 &&
      (message === "Unauthorized: No token provided" ||
        message === "Unauthorized: Invalid or expired token")
    ) {
      try {
        await auth.signOut();
      } catch {
        // ignore
      }

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;