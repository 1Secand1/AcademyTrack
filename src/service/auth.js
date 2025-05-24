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
      
      console.log('[Auth] Login successful:', { user });
      return { token: access_token, user };
    } catch (error) {
      console.error('[Auth] Login error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      console.log('[Auth] Starting logout process');
      await apiClient.post('auth/logout');
      deleteCookie(TOKEN_KEY);
      deleteCookie(USER_KEY);
      console.log('[Auth] Logout successful');
    } catch (error) {
      console.error('[Auth] Logout error:', error);
      // Even if the server request fails, we still want to clear local auth state
      deleteCookie(TOKEN_KEY);
      deleteCookie(USER_KEY);
      throw error;
    }
  },

  getCurrentUser() {
    const userData = getCookie(USER_KEY);
    const user = userData ? JSON.parse(userData) : null;
    console.log('[Auth] Getting current user:', user);
    return user;
  },

  isAuthenticated() {
    const hasToken = !!getCookie(TOKEN_KEY);
    console.log('[Auth] Checking authentication:', hasToken);
    return hasToken;
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