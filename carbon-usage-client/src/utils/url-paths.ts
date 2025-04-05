// src/constants/apiEndpoints.js

export const URL_PATHS = {
  general: '*',
  main: '/',
  login: '/login',
  dashboard: {
    general: '/dashboard/*',
    main: '/dashboard',
  },
  consumptions: {
    main: '/consumptions',
    list: 'consumptions/list',
    new: 'consumptions/new',
    data_collection: 'consumptions/data-collection',
    data_edit: 'consumptions/:id/edit',
  },
  products: {
    catalogue: 'products-catalogue',
  },
  production: {
    list: 'production/list',
  },
  company: {
    dashboard: 'company-dashboard',
  },
};
