/**
 * Utility to extract and parse the current subdomain from the window location.
 * Handles different environments (local, production).
 * 
 * @returns {string|null} The subdomain or null if none exists.
 */
export const getSubdomain = () => {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  // Localhost or IP address handling
  if (hostname === 'localhost' || hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    // In local dev, you might use subdomains like firm1.localhost:3000
    // If you're just on localhost, there's no subdomain
    return null;
  }

  // Handle production subdomains (e.g., firm.lawyers-saas.com)
  // Assumes a structure like: subdomain.domain.com
  if (parts.length > 2) {
    return parts[0];
  }

  return null;
};

/**
 * Checks if the current environment is the Central Domain.
 * @returns {boolean}
 */
export const isCentralDomain = () => {
  const subdomain = getSubdomain();
  return !subdomain || subdomain === 'admin';
};
