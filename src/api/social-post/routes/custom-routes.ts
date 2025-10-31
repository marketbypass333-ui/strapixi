/**
 * Custom routes for social-post
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/social-posts/:id/schedule',
      handler: 'social-post.schedule',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/social-posts/:id/publish',
      handler: 'social-post.publish',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/social-posts/:id/approve',
      handler: 'social-post.approve',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/social-posts/:id/reject',
      handler: 'social-post.reject',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/social-posts/:id/duplicate',
      handler: 'social-post.duplicate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/social-posts/bulk-publish',
      handler: 'social-post.bulkPublish',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
