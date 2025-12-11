// src/services/apiClient.ts
import axios from "axios";
import { auth } from "../lib/firebase";

const apiClient = axios.create({
  baseURL: "http://localhost:5012/api/",
});

// Request interceptor: sisipkan Authorization Bearer token kalau user login
apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // create headers object compatible with Axios typings
        config.headers = { Authorization: `Bearer ${token}` } as any;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: jika Unauthorized, bisa redirect ke login
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
      // Paksa kembali ke login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;