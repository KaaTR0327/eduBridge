export const API_BASE = 'http://localhost:4000/api';
export const TOKEN_KEY = 'shine_token';
export const USER_KEY = 'shine_user';

export const demoAccounts = [
  { label: 'Admin', email: 'admin@shine.mn', password: '123456' },
  { label: 'Instructor', email: 'nomin@shine.mn', password: '123456' },
  { label: 'Student', email: 'ariunaa@shine.mn', password: '123456' }
];

export function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch (_error) {
    return null;
  }
}

export async function apiFetch(path, options = {}, token) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value || 0);
}
