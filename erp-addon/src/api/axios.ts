import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

// ─── Instance gọi Auth (login, refresh token) ───────────────────────────────
export const authApi = axios.create({
  baseURL: "/auth",
  timeout: 30000,
headers: {
  "Content-Type": "application/json",
  Accept: "application/json",
},
});

// ─── Instance gọi Portal API ─────────────────────────────────────────────────
export const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});


// gọi api ticket
export const ticket = axios.create({
  baseURL: "/ticket",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});



// ─── Refresh token ────────────────────────────────────────────────────────────
async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  const response = await authApi.post("/auth/refresh", { refreshToken });

  const { token, refreshToken: newRefreshToken } = response.data;

  localStorage.setItem("token", token); // ✅ dùng key "token" nhất quán

  if (newRefreshToken) {
    localStorage.setItem("refreshToken", newRefreshToken);
  }

  return token;
}

// ─── Request interceptor: đính Bearer token vào mọi request ──────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token"); // ✅ cùng key với lúc login lưu

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

ticket.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: tự động refresh khi gặp 401 ───────────────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ─── Helper lấy error message ─────────────────────────────────────────────────
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error.response?.data as any)?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}