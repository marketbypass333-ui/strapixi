/**
 * Publisher Service
 * Handles publishing posts to social media platforms
 */

import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Publish a post to all selected platforms
   */
  async publishPost(post: any) {
    const { platforms, content, media, platformConfigs } = post;
    const results = {
      successful: [],
      failed: [],
      errors: [],
    };

    if (!platforms || platforms.length === 0) {
      return {
        ...results,
        errors: [{ message: 'No platforms selected' }],
      };
    }

    for (const platform of platforms) {
      try {
        strapi.log.info(`Publishing to ${platform}...`);

        const platformConfig = platformConfigs?.[platform] || {};
        let result;

        switch (platform) {
          case 'facebook':
            result = await this.publishToFacebook(post, platformConfig);
            break;
          case 'instagram':
            result = await this.publishToInstagram(post, platformConfig);
            break;
          case 'twitter':
            result = await this.publishToTwitter(post, platformConfig);
            break;
          case 'linkedin':
            result = await this.publishToLinkedIn(post, platformConfig);
            break;
          case 'tiktok':
            result = await this.publishToTikTok(post, platformConfig);
            break;
          case 'youtube':
            result = await this.publishToYouTube(post, platformConfig);
            break;
          default:
            throw new Error(`Unsupported platform: ${platform}`);
        }

        results.successful.push({
          platform,
          ...result,
        });

        strapi.log.info(`✅ Successfully published to ${platform}`);
      } catch (error) {
        strapi.log.error(`❌ Failed to publish to ${platform}:`, error);
        results.failed.push(platform);
        results.errors.push({
          platform,
          message: error.message,
          stack: error.stack,
        });
      }
    }

    return results;
  },

  /**
   * Publish post by ID
   */
  async publishPostById(postId: number) {
    const post = await strapi.entityService.findOne(
      'api::social-post.social-post',
      postId,
      {
        populate: {
          media: true,
        },
      }
    );

    if (!post) {
      throw new Error(`Post with ID ${postId} not found`);
    }

    return await this.publishPost(post);
  },

  /**
   * Publish to Facebook
   */
  async publishToFacebook(post: any, config: any) {
    const { facebook } = strapi.config.get('plugin.social-media-connector');

    if (!facebook?.accessToken) {
      throw new Error('Facebook access token not configured');
    }

    const connector = strapi
      .plugin('social-media-connector')
      .service('connectors')
      .facebook;

    const result = await connector.publishPost({
      message: post.content,
      media: post.media,
      accessToken: facebook.accessToken,
      ...config,
    });

    return result;
  },

  /**
   * Publish to Instagram
   */
  async publishToInstagram(post: any, config: any) {
    const { facebook } = strapi.config.get('plugin.social-media-connector');

    if (!facebook?.accessToken) {
      throw new Error('Instagram (Facebook) access token not configured');
    }

    const connector = strapi
      .plugin('social-media-connector')
      .service('connectors')
      .instagram;

    const result = await connector.publishPost({
      caption: post.content,
      media: post.media,
      accessToken: facebook.accessToken,
      ...config,
    });

    return result;
  },

  /**
   * Publish to Twitter
   */
  async publishToTwitter(post: any, config: any) {
    const { twitter } = strapi.config.get('plugin.social-media-connector');

    if (!twitter?.bearerToken) {
      throw new Error('Twitter bearer token not configured');
    }

    const connector = strapi
      .plugin('social-media-connector')
      .service('connectors')
      .twitter;

    const result = await connector.publishPost({
      text: post.content,
      media: post.media,
      ...config,
    });

    return result;
  },

  /**
   * Publish to LinkedIn
   */
  async publishToLinkedIn(post: any, config: any) {
    const { linkedin } = strapi.config.get('plugin.social-media-connector');

    if (!linkedin?.accessToken) {
      throw new Error('LinkedIn access token not configured');
    }

    const connector = strapi
      .plugin('social-media-connector')
      .service('connectors')
      .linkedin;

    const result = await connector.publishPost({
      text: post.content,
      media: post.media,
      accessToken: linkedin.accessToken,
      ...config,
    });

    return result;
  },

  /**
   * Publish to TikTok
   */
  async publishToTikTok(post: any, config: any) {
    const { tiktok } = strapi.config.get('plugin.social-media-connector');

    if (!tiktok?.accessToken) {
      throw new Error('TikTok access token not configured');
    }

    const connector = strapi
      .plugin('social-media-connector')
      .service('connectors')
      .tiktok;

    const result = await connector.publishPost({
      description: post.content,
      video: post.media?.find((m) => m.mime.startsWith('video')),
      accessToken: tiktok.accessToken,
      ...config,
    });

    return result;
  },

  /**
   * Publish to YouTube
   */
  async publishToYouTube(post: any, config: any) {
    const { youtube } = strapi.config.get('plugin.social-media-connector');

    if (!youtube?.accessToken) {
      throw new Error('YouTube access token not configured');
    }

    const connector = strapi
      .plugin('social-media-connector')
      .service('connectors')
      .youtube;

    const result = await connector.publishPost({
      title: post.title,
      description: post.content,
      video: post.media?.find((m) => m.mime.startsWith('video')),
      accessToken: youtube.accessToken,
      ...config,
    });

    return result;
  },
});
