// BloodBond Frontend - API helper
// Every call to the backend (Step 2, http://localhost:5000/api) goes through here.
// The JWT token (after login) is sent automatically in the Authorization header.

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Get the saved token from the browser (localStorage). Empty string = not logged in.
export function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('bloodbond_token') || '';
}

// Save / remove the token on login / logout.
export function saveToken(token) {
  localStorage.setItem('bloodbond_token', token);
}
export function clearToken() {
  localStorage.removeItem('bloodbond_token');
  localStorage.removeItem('bloodbond_user');
}

// Read the logged-in user saved at login time.
export function getSavedUser() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('bloodbond_user') || 'null');
  } catch {
    return null;
  }
}

// One fetch call. path = '/donors/available', options = { method: 'POST', body: {...} }
// Returns the JSON answer. If the backend says error, throws an Error with its message.
export async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = 'Bearer ' + token;

  const res = await fetch(API_URL + path, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error((data && data.message) || 'Kichu ekta vul hoyeche. Abar try koro.');
  }
  return data;
}

// Blood groups used in every form.
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const OCCUPATIONS = ['Student', 'Job', 'Business', 'Doctor', 'Teacher', 'Worker', 'Other'];
