// src/utils/axiosPrivate.js
import axios from 'axios';
import { host } from '../services/api';
import { store } from '../app/store';
import { refreshToken } from '../services/refreshToken';
import { logoutUser } from '../features/auth/authSlice';
// import { host } from '@data/constants/config';
// import { getItem } from '@data/repositories/mmkvStorage';
// import { refreshToken } from '@domain/services/internal/authServices';
// import { logoutUser } from '@data/redux/slices/auth/authSlice';
// import { store } from '@data/redux/store';
// import { resetToDrawerAndLogin } from './NavigationUtils';

// Create an Axios instance
const axiosPrivate = axios.create({
  baseURL: host,
});

// Function to get access token from Redux or AsyncStorage
const getAccessToken = async () => {
  const state = store.getState();
  const accessToken = state.auth.accessToken;
  return accessToken || localStorage.getItem('accessToken');
};

// Request Interceptor: Attach token
axiosPrivate.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    console.log("accessToken from axiosPrivate", accessToken)
    if (accessToken && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle token refresh
axiosPrivate.interceptors.response.use(
  response => response,
  async (error) => {
    const prevRequest = error?.config;
    // Check if the error is due to an invalid token and if the request was not retried
    if ((error?.response?.status === 401) && !prevRequest?.sent) {
      prevRequest.sent = true;

      try {
        // Refresh the access token
        const newAccessToken = await refreshToken();

        if (newAccessToken) {
          // Update the header with the new token
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest); // Retry the original request
        }
      } catch (err) {
        console.error('Token refresh failed:', err.message);
        store.dispatch(logoutUser());
        // navigate 
        window.location.href = "/auth/user-login"
      }
    }

    return Promise.reject(error);
  },
);

export default axiosPrivate;
