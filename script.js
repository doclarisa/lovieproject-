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
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Allow login page without authentication
  if (currentPage === 'index.html' || currentPage === '') {
    return; // Login page is always accessible
  }

  // Protected pages: redirect to login if not authenticated
  if (!isAuthenticated()) {
    window.location.href = 'index.html';
  }
}

// Logout function - clears authentication and redirects to login
function logout() {
  setAuthenticated(false);
  window.location.href = 'index.html';
}

// Initialize global functionality on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication on protected pages
  requireAuth();

  // Add logout functionality to logout links
  const logoutLinks = document.querySelectorAll('a[href="index.html"]');
  logoutLinks.forEach(link => {
    if (link.textContent.toLowerCase().includes('logout')) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
      });
    }
  });

  console.log('LovieProject initialized. Authenticated:', isAuthenticated());
});

// Log messages for debugging
console.log('Global script.js loaded');
