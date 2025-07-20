import axios from "axios";

const api = axios.create({
  baseURL: "https://api.mutifacebook.pro.vn",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/";
    } else if (status === 429) {
      return Promise.reject(new Error("Đã vượt quá giới hạn API. Vui lòng thử lại sau."));
    } else if (status === 500) {
      return Promise.reject(new Error("Lỗi server. Vui lòng thử lại sau."));
    }
    return Promise.reject(error);
  }
);

export default api;