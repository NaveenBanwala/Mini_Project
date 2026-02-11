import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' }
});

// Auto-attach JWT Token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, (error) => Promise.reject(error));

// Global Response Interceptor: Handles Token Expiry
API.interceptors.response.use(
    (response) => response,
    (error) => {
        // If backend returns 401 Unauthorized, clear local storage and redirect
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

/**
 * Authentication Endpoints
 */
export const authAPI = {
    login: (creds) => API.post('/auth/login', creds),
    signup: (data) => API.post('/auth/signup', data),
    me: () => API.get('/auth/me'),

    updateProfile: (data) => API.put('/auth/profile', data),
};

/**
 * Mentee (Admin/Mentor) Endpoints
 */
export const menteeAPI = {
    // Attendance & Bulk Data
    uploadExcel: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return API.post('/mentee/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    
    // Dashboard & Students
    getDashboardStats: () => API.get('/mentee/stats'),
    // Logic: This hits /mentee/students which returns ONLY the logged-in mentor's students
    getStudents: () => API.get('/mentee/students'),
    getStudentById: (id) => API.get(`/mentee/students/${id}`),
    
    // Updates
    // FIXED: Removed "/attendance" from the end to match the backend route below
    updateAttendance: (rollNo, data) => API.put(`/mentee/students/${rollNo}`, data),
    
    // Alerts
    sendBulkAlerts: () => API.post('/mentee/send-alerts'),

    getProfile: () => API.get('/mentee/profile'),
};
/**
 * Parent Endpoints
 */
export const parentAPI = {
    // Fetches data using either the Roll Number or Parent ID
    getChildData: (identifier) => {
        if (!identifier) {
            console.error("API Error: No identifier provided to getChildData");
            return;
        }
        return API.get(`/parent/child/${identifier}`);
    },
    
    getParentDashboard: () => API.get('/parent/dashboard'),
};
/**
 * Chat & Communication Endpoints
 */
export const chatAPI = {
    // Get list of people the user can talk to
    getContacts: () => API.get('/chat/contacts'),
    
    // Fetch conversation history
    getHistory: (targetUserId) => API.get(`/chat/history/${targetUserId}`),
    
    // Send a new message
    sendMessage: (msg) => API.post('/chat/send', msg),
    
    // Mark messages as read
    markAsRead: (senderId) => API.put(`/chat/read/${senderId}`),
};

export default API;