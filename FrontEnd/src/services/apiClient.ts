import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api",
    timeout: 300000, // 5 minutes (for long AI operations like repo analysis)
    headers: {
        "Content-Type": "application/json",
    },
});

// REQUEST interceptor — attach JWT token to every outgoing request
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                if (config.headers?.set) {
                    config.headers.set("Authorization", `Bearer ${token}`);
                } else if (config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE interceptor — on 401 clear token and redirect to login
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                // Only redirect if not already on an auth page to avoid loops
                const isAuthPage = window.location.pathname.startsWith("/auth/");
                if (!isAuthPage) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("ai_bharat_user");
                    window.location.href = "/auth/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
export { apiClient };
