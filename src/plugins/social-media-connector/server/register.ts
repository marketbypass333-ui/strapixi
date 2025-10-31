/**
 * Plugin register lifecycle hook
 * This runs during the plugin registration phase
 */

export default ({ strapi }) => {
  strapi.log.info('🔌 Registering Social Media Connector plugin...');

  // Register custom permissions if needed
  // Register custom content types if needed
  // Register webhooks if needed

  strapi.log.info('✅ Social Media Connector plugin registered');
};
