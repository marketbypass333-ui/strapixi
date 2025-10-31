/**
 * Main application entry point for Strapi v5
 * This file exports lifecycle hooks and bootstrap logic
 */

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi } */) {
    // Register custom plugins, middlewares, policies, etc.
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Bootstrap application logic
    strapi.log.info('🚀 Strapi application is bootstrapping...');

    // Initialize Redis connection
    if (strapi.config.get('plugin.redis')) {
      strapi.log.info('✅ Redis connection initialized');
    }

    // Run any database seeds if in development
    if (process.env.NODE_ENV === 'development') {
      strapi.log.info('📊 Development mode: Database seeds can be run');
    }

    strapi.log.info('✨ Strapi application bootstrap completed');
  },
};
