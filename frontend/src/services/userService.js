/**
 * User storage and authentication service for Vayu Rakshak.
 * Stores existing users in localStorage so returning users can log in directly
 * or switch between accounts, while new users complete onboarding to register.
 */

const STORAGE_USERS_KEY = 'vayu_rakshak_users';
const STORAGE_CURRENT_USER_KEY = 'vayu_rakshak_current_user';

export function getAllUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse users from localStorage', e);
    return [];
  }
}

export function saveUser(userProfile) {
  if (!userProfile || !userProfile.name) return null;
  const users = getAllUsers();
  
  // Normalize name key for login match
  const nameKey = userProfile.name.trim().toLowerCase();
  const existingIdx = users.findIndex(u => u.name.trim().toLowerCase() === nameKey);
  
  const updatedUser = {
    ...userProfile,
    id: userProfile.id || `user_${Date.now()}`,
    updatedAt: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    users[existingIdx] = updatedUser;
  } else {
    users.push(updatedUser);
  }

  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(updatedUser));
  return updatedUser;
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function loginUser(name) {
  const users = getAllUsers();
  const nameKey = name.trim().toLowerCase();
  const found = users.find(u => u.name.trim().toLowerCase() === nameKey);
  if (found) {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(found));
    return found;
  }
  return null;
}

export function logoutUser() {
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
}
