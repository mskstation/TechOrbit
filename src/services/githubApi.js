
import axios from "axios";

const githubApi = axios.create({
  baseURL: "http://localhost:5000/api/github",
  timeout: 30000,
});

export default githubApi;
