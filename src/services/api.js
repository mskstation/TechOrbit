
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
