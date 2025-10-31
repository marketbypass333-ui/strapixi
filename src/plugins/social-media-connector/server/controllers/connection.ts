/**
 * Connection controller
 * Manages platform connection status and validation
 */

import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Get connection status for all platforms
   */
  async getStatus(ctx) {
    try {
      const connectorService = strapi
        .plugin('social-media-connector')
        .service('connector');

      const status = await connectorService.getConnectionStatus();

      ctx.body = {
        data: status,
      };
    } catch (error) {
      ctx.throw(500, `Failed to get connection status: ${error.message}`);
    }
  },

  /**
   * Validate connections
   */
  async validate(ctx) {
    try {
      const connectorService = strapi
        .plugin('social-media-connector')
        .service('connector');

      const results = await connectorService.validateConnections();

      ctx.body = {
        data: results,
      };
    } catch (error) {
      ctx.throw(500, `Failed to validate connections: ${error.message}`);
    }
  },
});
