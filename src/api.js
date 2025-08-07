// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://askpolicy-backend.onrender.com/', 
  withCredentials: true 
});

export default api;

