
import axios from 'axios';
import Cookies from 'js-cookie'
const API_BASE_URL = 'http://localhost:8001/v1';

const getToken = () => Cookies.get('token');
const getAccessId = () => Cookies.get('xCustomAccessId');

// Create an instance of axios with default settings
const apiService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token and access ID in every request
apiService.interceptors.request.use(
    (config) => {
        const token = getToken();
        const accessId = getAccessId();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (accessId) {
            config.headers['x-custom-access-id'] = accessId;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Generic API call function for get, post, put, delete
const apiRequest = {
    get: (url) => apiService.get(url),
    post: (url, data) => apiService.post(url, data),
    put: (url, data) => apiService.put(url, data),
    delete: (url) => apiService.delete(url),
};

export default apiRequest;
