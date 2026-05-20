export const API_CONFIG = {
  CENTRAL_BASE_URL: process.env.NEXT_PUBLIC_CENTRAL_API_URL || 'https://admin.lawyers-multivendor.com/api',
  TENANT_BASE_URL_TEMPLATE: process.env.NEXT_PUBLIC_TENANT_API_URL_TEMPLATE || 'https://{subdomain}.lawyers-multivendor.com/api',
  MAIN_DOMAIN: process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'lawyers-multivendor.com',
};

export const STORAGE_KEYS = {
  CENTRAL_TOKEN: 'central_auth_token',
  TENANT_TOKEN: 'tenant_auth_token',
};
