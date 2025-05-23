import { apiClient } from './apiClient.js';
import { setCookie, getCookie, deleteCookie } from '@utils/cookie.js';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const authService = {
  async register(userData) {
    try {
      const response = await apiClient.post('auth/register', { json: userData }).json();
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(credentials) {
    try {
      const response = await apiClient.post('auth/login', { json: credentials }).json();
      const { access_token, user } = response;
      
      setCookie(TOKEN_KEY, access_token);
      setCookie(USER_KEY, JSON.stringify(user));
      
      return { token: access_token, user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await apiClient.post('auth/logout');
      deleteCookie(TOKEN_KEY);
      deleteCookie(USER_KEY);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getCurrentUser() {
    const userData = getCookie(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated() {
    return !!getCookie(TOKEN_KEY);
  },

  hasRole(role) {
    const user = this.getCurrentUser();
    console.log('Checking role:', role);
    console.log('User roles:', user?.roles);
    return user?.roles?.includes(role) || false;
  },

  isAdmin() {
    const isAdmin = this.hasRole('admin');
    console.log('Is admin check:', isAdmin);
    return isAdmin;
  },

  isTeacher() {
    return this.hasRole('teacher');
  },

  async checkAuth() {
    try {
      const token = getCookie(TOKEN_KEY);
      if (!token) return false;
      
      const response = await apiClient.get('auth/check').json();
      
      if (response) {
        setCookie(USER_KEY, JSON.stringify(response));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth check error:', error);
      if (error.status === 401) {
        deleteCookie(TOKEN_KEY);
        deleteCookie(USER_KEY);
      }
      return false;
    }
  }
}; 