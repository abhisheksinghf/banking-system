/**
 * Authentication Service
 */
define(['knockout'], function(ko) {
  'use strict';

  // Hardcoded credentials for demo
  const VALID_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  };

  // Session storage keys
  const AUTH_KEY = 'bankingApp_auth';
  const USER_KEY = 'bankingApp_user';

  // Observable state
  const isAuthenticated = ko.observable(false);
  const currentUser = ko.observable(null);

  /**
   * Initialize authentication state from session storage
   */
  function initAuth() {
    const authData = sessionStorage.getItem(AUTH_KEY);
    const userData = sessionStorage.getItem(USER_KEY);
    
    if (authData === 'true' && userData) {
      isAuthenticated(true);
      currentUser(JSON.parse(userData));
    }
  }

  /**
   * Login with username and password
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<Object>} Login result
   */
  function login(username, password) {
    return new Promise((resolve, reject) => {
      // Simulate async operation
      setTimeout(() => {
        if (username === VALID_CREDENTIALS.username && 
            password === VALID_CREDENTIALS.password) {
          
          const user = {
            username: username,
            displayName: 'Administrator',
            loginTime: new Date().toISOString()
          };

          // Store in session storage
          sessionStorage.setItem(AUTH_KEY, 'true');
          sessionStorage.setItem(USER_KEY, JSON.stringify(user));

          // Update observables
          isAuthenticated(true);
          currentUser(user);

          resolve({
            success: true,
            user: user
          });
        } else {
          reject({
            success: false,
            error: 'Invalid username or password'
          });
        }
      }, 500);
    });
  }

  /**
   * Logout current user
   */
  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(USER_KEY);
    isAuthenticated(false);
    currentUser(null);
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  function checkAuth() {
    return isAuthenticated();
  }

  /**
   * Get current user
   * @returns {Object|null}
   */
  function getCurrentUser() {
    return currentUser();
  }

  // Initialize auth state on load
  initAuth();

  // Return public API
  return {
    login: login,
    logout: logout,
    checkAuth: checkAuth,
    isAuthenticated: isAuthenticated,
    currentUser: currentUser,
    getCurrentUser: getCurrentUser
  };
});
