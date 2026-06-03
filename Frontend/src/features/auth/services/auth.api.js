import axios from "axios";

const api = axios.create({
  baseURL: '/api/auth',
  withCredentials: true
});

export const login = async (credential, password) => {
  try {
    const response = await api.post('/login', { credential, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const signup = async (fullName, email, phone, password, confirmPassword, role) => {
  try {
    const response = await api.post('/signup', { fullName, email, phone, password, confirmPassword, role });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/me');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/logout');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};