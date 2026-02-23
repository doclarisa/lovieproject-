// Global JavaScript for LovieProject

// Utility function to navigate between pages
function navigateTo(page) {
  window.location.href = page;
}

// Utility function to check if user is authenticated (password protected)
function isAuthenticated() {
  return sessionStorage.getItem('lovieAuthenticated') === 'true';
}

// Set authentication status
function setAuthenticated(status) {
  if (status) {
    sessionStorage.setItem('lovieAuthenticated', 'true');
  } else {
    sessionStorage.removeItem('lovieAuthenticated');
  }
}

// Redirect to login if not authenticated (for protected pages)
function requireAuth() {
  if (!isAuthenticated() && window.location.pathname !== '/index.html' && !window.location.pathname.includes('index.html')) {
    // Allow access to protected pages only if authenticated
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== '' && currentPage !== 'index.html') {
      // Uncomment to enforce authentication
      // window.location.href = 'index.html';
    }
  }
}

// Initialize global functionality on page load
document.addEventListener('DOMContentLoaded', function() {
  // Run any initialization code here
  console.log('LovieProject loaded');
});

// Log messages for debugging
console.log('Global script.js loaded');
