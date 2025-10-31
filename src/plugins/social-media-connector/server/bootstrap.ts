/**
 * Plugin bootstrap lifecycle hook
 * This runs after the plugin is registered
 */

export default async ({ strapi }) => {
  strapi.log.info('🚀 Bootstrapping Social Media Connector plugin...');

  // Initialize API clients
  const config = strapi.config.get('plugin.social-media-connector');

  // Validate configuration
  if (!config) {
    strapi.log.warn('⚠️ Social Media Connector: No configuration found');
    return;
  }

  // Test connections to social media APIs
  const connectorService = strapi
    .plugin('social-media-connector')
    .service('connector');

  try {
    await connectorService.validateConnections();
    strapi.log.info('✅ Social Media Connector: All platform connections validated');
  } catch (error) {
    strapi.log.error('❌ Social Media Connector: Connection validation failed', error);
  }

  strapi.log.info('✨ Social Media Connector plugin bootstrap completed');
};
