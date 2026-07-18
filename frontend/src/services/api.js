import axios from 'axios';

const AUTH_URL = '/auth';
const LIBRARY_URL = '';
const STATISTICS_URL = '';

const authApi = axios.create({ baseURL: AUTH_URL });
const libraryApi = axios.create({ baseURL: LIBRARY_URL });
const statisticsApi = axios.create({ baseURL: STATISTICS_URL });

const addAuthInterceptor = (apiInstance) => {
    apiInstance.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    apiInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
};

addAuthInterceptor(authApi);
addAuthInterceptor(libraryApi);
addAuthInterceptor(statisticsApi);

export const authService = {
    register: (data) => authApi.post('/register', data),
    login: (data) => authApi.post('/login', data),
    getProfile: () => authApi.get('/profile'),
};

export const bookService = {
    getAll: (params) => libraryApi.get('/books', { params }),
    getById: (id) => libraryApi.get(`/books/${id}`),
    create: (data) => libraryApi.post('/books', data),
    update: (id, data) => libraryApi.put(`/books/${id}`, data),
    delete: (id) => libraryApi.delete(`/books/${id}`),
};

export const loanService = {
    getAll: () => libraryApi.get('/loans'),
    getActive: () => libraryApi.get('/loans/active'),
    create: (data) => libraryApi.post('/loans', data),
    return: (data) => libraryApi.post('/returns', data),
};

export const statisticsService = {
    getStatistics: () => statisticsApi.get('/statistics'),
    getCategories: () => statisticsApi.get('/statistics/categories'),
    getRecommendations: (category) => statisticsApi.get(`/recommendations/${category}`),
    getSummary: () => statisticsApi.get('/summary'),
};

export default { authService, bookService, loanService, statisticsService };