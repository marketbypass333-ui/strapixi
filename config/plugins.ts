/**
 * Plugin configuration
 * Reference: https://docs.strapi.io/dev-docs/configurations/plugins
 */

export default ({ env }) => ({
  // GraphQL Plugin Configuration
  graphql: {
    enabled: env.bool('GRAPHQL_ENABLED', true),
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: env.bool('GRAPHQL_PLAYGROUND', false),
      depthLimit: 10,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },

  // i18n Plugin Configuration
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'en',
      locales: ['en', 'es', 'fr', 'de', 'ja', 'zh', 'ko', 'ar'],
    },
  },

  // Users & Permissions Plugin Configuration
  'users-permissions': {
    enabled: true,
    config: {
      jwt: {
        expiresIn: '7d',
      },
      register: {
        allowedFields: ['username', 'email', 'password'],
      },
      ratelimit: {
        enabled: env.bool('RATE_LIMIT_ENABLED', true),
        interval: 60000,
        max: 10,
      },
    },
  },

  // Sentry Plugin Configuration
  sentry: {
    enabled: env.bool('SENTRY_ENABLED', false),
    config: {
      dsn: env('SENTRY_DSN'),
      sendMetadata: true,
      init: {
        environment: env('NODE_ENV', 'development'),
        release: env('npm_package_version', '1.0.0'),
        tracesSampleRate: env.float('SENTRY_TRACES_SAMPLE_RATE', 0.1),
      },
    },
  },

  // Upload Plugin Configuration (AWS S3)
  upload: {
    enabled: true,
    config: {
      provider: env('UPLOAD_PROVIDER', 'local'),
      providerOptions: {
        s3: {
          accessKeyId: env('AWS_ACCESS_KEY_ID'),
          secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
          region: env('AWS_REGION', 'us-east-1'),
          params: {
            Bucket: env('AWS_S3_BUCKET'),
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },

  // Email Plugin Configuration
  email: {
    enabled: true,
    config: {
      provider: env('EMAIL_PROVIDER', 'sendgrid'),
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', 'noreply@strapixi.com'),
        defaultReplyTo: env('EMAIL_REPLY_TO', 'support@strapixi.com'),
      },
    },
  },

  // Custom Social Media Connector Plugin
  'social-media-connector': {
    enabled: true,
    config: {
      facebook: {
        appId: env('FACEBOOK_APP_ID'),
        appSecret: env('FACEBOOK_APP_SECRET'),
        accessToken: env('FACEBOOK_ACCESS_TOKEN'),
      },
      twitter: {
        apiKey: env('TWITTER_API_KEY'),
        apiSecret: env('TWITTER_API_SECRET'),
        accessToken: env('TWITTER_ACCESS_TOKEN'),
        accessTokenSecret: env('TWITTER_ACCESS_TOKEN_SECRET'),
        bearerToken: env('TWITTER_BEARER_TOKEN'),
      },
      linkedin: {
        clientId: env('LINKEDIN_CLIENT_ID'),
        clientSecret: env('LINKEDIN_CLIENT_SECRET'),
        accessToken: env('LINKEDIN_ACCESS_TOKEN'),
      },
      tiktok: {
        clientKey: env('TIKTOK_CLIENT_KEY'),
        clientSecret: env('TIKTOK_CLIENT_SECRET'),
        accessToken: env('TIKTOK_ACCESS_TOKEN'),
      },
      youtube: {
        apiKey: env('YOUTUBE_API_KEY'),
        clientId: env('YOUTUBE_CLIENT_ID'),
        clientSecret: env('YOUTUBE_CLIENT_SECRET'),
        accessToken: env('YOUTUBE_ACCESS_TOKEN'),
        refreshToken: env('YOUTUBE_REFRESH_TOKEN'),
      },
    },
  },

  // Content Scheduler Plugin
  'content-scheduler': {
    enabled: true,
    config: {
      timezone: env('TZ', 'UTC'),
      checkInterval: env.int('SCHEDULER_CHECK_INTERVAL', 60000), // Check every minute
    },
  },

  // Analytics Dashboard Plugin
  'analytics-dashboard': {
    enabled: true,
    config: {
      refreshInterval: env.int('ANALYTICS_REFRESH_INTERVAL', 300000), // 5 minutes
    },
  },

  // Workflow Management Plugin
  'workflow-management': {
    enabled: true,
    config: {
      defaultWorkflow: 'standard',
      approvalRequired: env.bool('APPROVAL_REQUIRED', true),
    },
  },
});
