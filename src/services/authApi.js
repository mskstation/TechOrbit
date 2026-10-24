import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default authApi;