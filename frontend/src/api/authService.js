import api from './apiService';

export const register = (data)=> api.post('/auth/register', data);
export const login = (data)=> api.post('/auth/login', data);

export const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
};
