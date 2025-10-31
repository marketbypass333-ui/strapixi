/**
 * Plugin configuration
 */

export default {
  default: {
    facebook: {
      enabled: true,
    },
    twitter: {
      enabled: true,
    },
    linkedin: {
      enabled: true,
    },
    tiktok: {
      enabled: false, // Requires approval
    },
    youtube: {
      enabled: true,
    },
  },
  validator: () => {},
};
