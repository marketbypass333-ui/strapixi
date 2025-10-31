/**
 * Admin panel configuration
 * Reference: https://docs.strapi.io/dev-docs/configurations/admin-panel
 */

export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'tobemodified'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'tobemodified'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'tobemodified'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  url: env('ADMIN_URL', '/admin'),
  autoOpen: env.bool('ADMIN_AUTO_OPEN', false),
  watchIgnoreFiles: [
    './src/**/*.test.ts',
    './src/**/*.spec.ts',
    './tests/**/*',
  ],
  host: env('ADMIN_HOST', 'localhost'),
  port: env.int('ADMIN_PORT', 1337),
  serveAdminPanel: env.bool('SERVE_ADMIN', true),
  forgotPassword: {
    emailTemplate: {
      subject: 'Reset password',
    },
  },
  rateLimit: {
    enabled: env.bool('ADMIN_RATE_LIMIT_ENABLED', true),
    interval: env.int('ADMIN_RATE_LIMIT_INTERVAL', 60000),
    max: env.int('ADMIN_RATE_LIMIT_MAX', 5),
  },
});
