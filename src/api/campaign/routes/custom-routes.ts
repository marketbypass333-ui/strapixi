/**
 * Custom routes for campaign
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/campaigns/:id/analytics',
      handler: 'campaign.analytics',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};