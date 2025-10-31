/**
 * Facebook Connector Service
 * Handles Facebook Graph API interactions
 */

import axios from 'axios';
import type { Core } from '@strapi/strapi';

const FACEBOOK_API_URL = 'https://graph.facebook.com/v18.0';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Validate Facebook access token
   */
  async validateToken() {
    const { facebook } = strapi.config.get('plugin.social-media-connector');

    try {
      const response = await axios.get(`${FACEBOOK_API_URL}/me`, {
        params: {
          access_token: facebook.accessToken,
          fields: 'id,name',
        },
      });

      return {
        valid: true,
        user: response.data,
      };
    } catch (error) {
      throw new Error(`Facebook token validation failed: ${error.message}`);
    }
  },

  /**
   * Publish a post to Facebook Page
   */
  async publishPost(options: {
    message: string;
    media?: any[];
    accessToken: string;
    pageId?: string;
    link?: string;
    published?: boolean;
  }) {
    const {
      message,
      media,
      accessToken,
      pageId,
      link,
      published = true,
    } = options;

    try {
      // Determine the target page ID
      const targetPageId = pageId || (await this.getDefaultPageId(accessToken));

      let postData: any = {
        message,
        access_token: accessToken,
        published,
      };

      // Handle media
      if (media && media.length > 0) {
        if (media.length === 1) {
          const mediaItem = media[0];
          if (mediaItem.mime.startsWith('image')) {
            // Single image post
            postData.url = this.getMediaUrl(mediaItem);
            const endpoint = `${FACEBOOK_API_URL}/${targetPageId}/photos`;
            const response = await axios.post(endpoint, postData);
            return {
              success: true,
              postId: response.data.id,
              platform: 'facebook',
            };
          } else if (mediaItem.mime.startsWith('video')) {
            // Single video post
            postData.file_url = this.getMediaUrl(mediaItem);
            const endpoint = `${FACEBOOK_API_URL}/${targetPageId}/videos`;
            const response = await axios.post(endpoint, postData);
            return {
              success: true,
              postId: response.data.id,
              platform: 'facebook',
            };
          }
        } else {
          // Multiple images - create album or carousel
          // For simplicity, we'll upload the first image with the message
          const firstImage = media.find((m) => m.mime.startsWith('image'));
          if (firstImage) {
            postData.url = this.getMediaUrl(firstImage);
            const endpoint = `${FACEBOOK_API_URL}/${targetPageId}/photos`;
            const response = await axios.post(endpoint, postData);
            return {
              success: true,
              postId: response.data.id,
              platform: 'facebook',
            };
          }
        }
      }

      // Text post or link post
      if (link) {
        postData.link = link;
      }

      const endpoint = `${FACEBOOK_API_URL}/${targetPageId}/feed`;
      const response = await axios.post(endpoint, postData);

      return {
        success: true,
        postId: response.data.id,
        platform: 'facebook',
      };
    } catch (error) {
      throw new Error(
        `Facebook publish failed: ${error.response?.data?.error?.message || error.message}`
      );
    }
  },

  /**
   * Get default page ID for the account
   */
  async getDefaultPageId(accessToken: string) {
    try {
      const response = await axios.get(`${FACEBOOK_API_URL}/me/accounts`, {
        params: {
          access_token: accessToken,
        },
      });

      if (!response.data.data || response.data.data.length === 0) {
        throw new Error('No Facebook pages found for this account');
      }

      // Return the first page ID
      return response.data.data[0].id;
    } catch (error) {
      throw new Error(`Failed to get Facebook page: ${error.message}`);
    }
  },

  /**
   * Get full media URL
   */
  getMediaUrl(media: any): string {
    if (media.url.startsWith('http')) {
      return media.url;
    }
    // Construct full URL from relative path
    const baseUrl = strapi.config.get('server.url', 'http://localhost:1337');
    return `${baseUrl}${media.url}`;
  },

  /**
   * Get post analytics
   */
  async getPostAnalytics(postId: string, accessToken: string) {
    try {
      const response = await axios.get(
        `${FACEBOOK_API_URL}/${postId}/insights`,
        {
          params: {
            access_token: accessToken,
            metric: [
              'post_impressions',
              'post_engaged_users',
              'post_clicks',
              'post_reactions_by_type_total',
            ].join(','),
          },
        }
      );

      const insights = response.data.data;
      const analytics = {
        impressions: 0,
        engagements: 0,
        clicks: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      };

      insights.forEach((insight) => {
        switch (insight.name) {
          case 'post_impressions':
            analytics.impressions = insight.values[0]?.value || 0;
            break;
          case 'post_engaged_users':
            analytics.engagements = insight.values[0]?.value || 0;
            break;
          case 'post_clicks':
            analytics.clicks = insight.values[0]?.value || 0;
            break;
          case 'post_reactions_by_type_total':
            const reactions = insight.values[0]?.value || {};
            analytics.likes = reactions.like || 0;
            break;
        }
      });

      return analytics;
    } catch (error) {
      throw new Error(`Failed to fetch Facebook analytics: ${error.message}`);
    }
  },
});
