import { loadFromStorage, saveToStorage, removeFromStorage } from '../../utils/storage';

const AUTH_USER_STORAGE_KEY = 'sanko_gosei_auth_user_v1';
const AUTH_LOGGED_OUT_KEY = 'sanko_gosei_logged_out_v1';

export const defaultUser = {
  userId: 'RK-001',
  name: 'Rajesh Kumar',
  initials: 'RK',
  role: 'Maintenance Head',
  email: 'rajesh.kumar@sankogosei.com',
  plant: 'Plant-1 • Maintenance 4.0',
};

// Future backend integration: replace with real auth API calls
export const authService = {
  getSession() {
    const isLoggedOut = loadFromStorage(AUTH_LOGGED_OUT_KEY, false);
    if (isLoggedOut) {
      return { isAuthenticated: false, user: null };
    }
    const savedUser = loadFromStorage(AUTH_USER_STORAGE_KEY, defaultUser);
    return { isAuthenticated: true, user: savedUser };
  },

  login({ userId, rememberMe = false } = {}) {
    const user = {
      ...defaultUser,
      userId: userId?.trim() || defaultUser.userId,
      rememberMe,
    };
    saveToStorage(AUTH_USER_STORAGE_KEY, user);
    removeFromStorage(AUTH_LOGGED_OUT_KEY);
    return { isAuthenticated: true, user };
  },

  logout() {
    removeFromStorage(AUTH_USER_STORAGE_KEY);
    saveToStorage(AUTH_LOGGED_OUT_KEY, true);
    return { isAuthenticated: false, user: null };
  },
};
