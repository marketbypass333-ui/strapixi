/**
 * Service exports for social-media-connector plugin
 */

import publisher from './publisher';
import connector from './connector';
import facebook from './connectors/facebook';

export default {
  publisher,
  connector,
  connectors: {
    facebook,
    instagram: facebook, // Instagram uses Facebook API
    twitter: () => ({}), // Placeholder
    linkedin: () => ({}), // Placeholder
    tiktok: () => ({}), // Placeholder
    youtube: () => ({}), // Placeholder
  },
};
