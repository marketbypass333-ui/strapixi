/**
 * Routes for social-media-connector plugin
 */

export default [
  {
    method: 'GET',
    path: '/connection/status',
    handler: 'connection.getStatus',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/connection/validate',
    handler: 'connection.validate',
    config: {
      policies: [],
    },
  },
];
