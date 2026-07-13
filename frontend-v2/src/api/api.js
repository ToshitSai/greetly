const API_BASE_URL = '/api';

const authFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Unable to reach the server. Please check your connection and try again.');
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : { error: await response.text() };

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('auth-expired'));
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || 'An error occurred during the request.');
  }

  return data;
};

export const api = {
  login: (email, password) => authFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  
  register: (name, email, password) => authFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  }),
  
  generateMessage: (payload) => authFetch('/create', { // Backend route alias for /messages/generate
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  getMessages: () => authFetch('/messages'),

  getDashboardStats: () => authFetch('/dashboard/stats'),

  saveMessage: (messageId) => authFetch(`/messages/${messageId}/save`, {
    method: 'POST'
  }),

  editMessage: (messageId, message_text) => authFetch(`/messages/${messageId}`, {
    method: 'PUT',
    body: JSON.stringify({ message_text, edited_by: 'customer' })
  }),

  sendEmail: (to_email, to_name, message_text, subject = 'A special message just for you!') => authFetch('/send-email', {
    method: 'POST',
    body: JSON.stringify({ to_email, to_name, message_text, subject })
  })
};
