// utils/customFetch.js
export async function customFetch(url, options = {}) {
  const token = localStorage.getItem('token'); 

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (response.status === 401 || response.status === 410) {
      window.dispatchEvent(new Event('session-timeout'));
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    
  
    if (error.message.includes('Failed to fetch') || 
        error.message.includes('NetworkError') || 
        error.message.includes('Network request failed') ||
        !navigator.onLine) {
    
      window.dispatchEvent(new Event('server-unreachable'));
    }
    
    throw error;
  }
}