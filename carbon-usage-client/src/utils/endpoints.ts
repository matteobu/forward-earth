const BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  ACTIVITY_TYPES: `${BASE_URL}/activity-types/`,
  AUTH_USER: `${BASE_URL}/auth/user`,
  AUTH_LOGIN: `${BASE_URL}/auth/login`,
  AUTH_LOGOUT: `${BASE_URL}/auth/logout`,
  COMPANIES: `${BASE_URL}/companies/`,
  CONSUMPTION: `${BASE_URL}/consumption/`,
  CONSUMPTION_PATCH: `${BASE_URL}/consumption/patch/`,
  CONSUMPTION_DELETE: `${BASE_URL}/consumption/delete/`,
  PRODUCTION: `${BASE_URL}/production/`,
  PRODUCTS: `${BASE_URL}/products/`,
  UNITS: `${BASE_URL}/units/`,
};
