/**
 * API configuration
 * Reference: https://docs.strapi.io/dev-docs/configurations/api
 */

export default ({ env }) => ({
  rest: {
    defaultLimit: env.int('API_DEFAULT_LIMIT', 25),
    maxLimit: env.int('API_MAX_LIMIT', 100),
    withCount: true,
  },
  responses: {
    privateAttributes: ['_v', 'id', 'created_at'],
  },
});
