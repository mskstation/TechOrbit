
import axios from "axios";

const usersApi = axios.create({
  baseURL: "http://localhost:5000/api/users",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

usersApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("techorbit_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default usersApi;
