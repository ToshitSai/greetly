const API_BASE_URL = 'http://localhost:5000/api'; // Default Flask backend port

const authFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

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

  sendEmail: (to_email, to_name, message_text) => authFetch('/send-email', {
    method: 'POST',
    body: JSON.stringify({ to_email, to_name, message_text, subject: 'A special message just for you!' })
  })
};
