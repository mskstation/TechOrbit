
import axios from "axios";

const postsApi = axios.create({
  baseURL: "http://localhost:5000/api/posts",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

postsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("techorbit_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default postsApi;
