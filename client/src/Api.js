import axios from 'axios'

import { getIdToken } from '../authService';

// Modifying the Axios default settings to include the Firebase idToken in requests:
axios.interceptors.request.use(
  async (config) => {
    const token = await getIdToken();
    if (token) {
      config.headers.Authorization = `${token}`; // removed "Bearer ", no need for it.
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const Api = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost:3000/api'
})
