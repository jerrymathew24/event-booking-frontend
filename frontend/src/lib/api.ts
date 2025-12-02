import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    withCredentials: true, // Send cookies with requests
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized globally if needed (e.g., redirect to login)
        if (error.response?.status === 401) {
            // console.log('Unauthorized, redirecting to login...');
        }
        return Promise.reject(error);
    }
);

export default api;
