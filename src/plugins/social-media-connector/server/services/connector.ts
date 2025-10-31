/**
 * Connector Service
 * Validates and manages connections to social media platforms
 */

import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Validate all platform connections
   */
  async validateConnections() {
    const config = strapi.config.get('plugin.social-media-connector');
    const results = {};

    // Validate Facebook
    if (config.facebook?.enabled && config.facebook?.accessToken) {
      results['facebook'] = await this.validateFacebookConnection();
    }

    // Validate Twitter
    if (config.twitter?.enabled && config.twitter?.bearerToken) {
      results['twitter'] = await this.validateTwitterConnection();
    }

    // Validate LinkedIn
    if (config.linkedin?.enabled && config.linkedin?.accessToken) {
      results['linkedin'] = await this.validateLinkedInConnection();
    }

    // Validate TikTok
    if (config.tiktok?.enabled && config.tiktok?.accessToken) {
      results['tiktok'] = await this.validateTikTokConnection();
    }

    // Validate YouTube
    if (config.youtube?.enabled && config.youtube?.accessToken) {
      results['youtube'] = await this.validateYouTubeConnection();
    }

    return results;
  },

  /**
   * Validate Facebook connection
   */
  async validateFacebookConnection() {
    try {
      const connector = strapi
        .plugin('social-media-connector')
        .service('connectors')
        .facebook;

      await connector.validateToken();
      return { valid: true };
    } catch (error) {
      strapi.log.error('Facebook validation failed:', error);
      return { valid: false, error: error.message };
    }
  },

  /**
   * Validate Twitter connection
   */
  async validateTwitterConnection() {
    try {
      const connector = strapi
        .plugin('social-media-connector')
        .service('connectors')
        .twitter;

      await connector.validateToken();
      return { valid: true };
    } catch (error) {
      strapi.log.error('Twitter validation failed:', error);
      return { valid: false, error: error.message };
    }
  },

  /**
   * Validate LinkedIn connection
   */
  async validateLinkedInConnection() {
    try {
      const connector = strapi
        .plugin('social-media-connector')
        .service('connectors')
        .linkedin;

      await connector.validateToken();
      return { valid: true };
    } catch (error) {
      strapi.log.error('LinkedIn validation failed:', error);
      return { valid: false, error: error.message };
    }
  },

  /**
   * Validate TikTok connection
   */
  async validateTikTokConnection() {
    try {
      const connector = strapi
        .plugin('social-media-connector')
        .service('connectors')
        .tiktok;

      await connector.validateToken();
      return { valid: true };
    } catch (error) {
      strapi.log.error('TikTok validation failed:', error);
      return { valid: false, error: error.message };
    }
  },

  /**
   * Validate YouTube connection
   */
  async validateYouTubeConnection() {
    try {
      const connector = strapi
        .plugin('social-media-connector')
        .service('connectors')
        .youtube;

      await connector.validateToken();
      return { valid: true };
    } catch (error) {
      strapi.log.error('YouTube validation failed:', error);
      return { valid: false, error: error.message };
    }
  },

  /**
   * Get connection status for all platforms
   */
  async getConnectionStatus() {
    const config = strapi.config.get('plugin.social-media-connector');
    const status = {};

    const platforms = ['facebook', 'twitter', 'linkedin', 'tiktok', 'youtube'];

    for (const platform of platforms) {
      status[platform] = {
        enabled: config[platform]?.enabled || false,
        configured: !!(
          config[platform]?.accessToken ||
          config[platform]?.bearerToken
        ),
        connected: false,
      };

      if (status[platform].configured) {
        try {
          const validation = await this[
            `validate${platform.charAt(0).toUpperCase() + platform.slice(1)}Connection`
          ]();
          status[platform].connected = validation.valid;
        } catch (error) {
          status[platform].connected = false;
        }
      }
    }

    return status;
  },
});
