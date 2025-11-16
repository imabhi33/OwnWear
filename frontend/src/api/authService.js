import api from './apiService';

export const register = (data)=> api.post('/auth/register', data);
export const login = (data)=> api.post('/auth/login', data);

export const getAuthConfig = () => {
    const userStr = localStorage.getItem('ecart_user');
    const user = userStr ? JSON.parse(userStr) : null;
    const token = user?.token;
    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
};
