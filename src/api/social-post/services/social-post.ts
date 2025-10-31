/**
 * social-post service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::social-post.social-post',
  ({ strapi }) => ({
    /**
     * Get posts by status
     */
    async getPostsByStatus(status: string) {
      return await strapi.entityService.findMany(
        'api::social-post.social-post',
        {
          filters: { status },
          populate: {
            media: true,
            campaign: true,
            author: { fields: ['username', 'email'] },
          },
        }
      );
    },

    /**
     * Get scheduled posts
     */
    async getScheduledPosts() {
      const now = new Date();
      return await strapi.entityService.findMany(
        'api::social-post.social-post',
        {
          filters: {
            status: 'scheduled',
            scheduledAt: {
              $lte: now,
            },
          },
          populate: {
            media: true,
            platforms: true,
          },
        }
      );
    },

    /**
     * Get posts pending approval
     */
    async getPendingApprovalPosts() {
      return await strapi.entityService.findMany(
        'api::social-post.social-post',
        {
          filters: {
            workflowStatus: 'in_review',
          },
          populate: {
            media: true,
            campaign: true,
            author: { fields: ['username', 'email'] },
          },
        }
      );
    },

    /**
     * Get posts by campaign
     */
    async getPostsByCampaign(campaignId: number) {
      return await strapi.entityService.findMany(
        'api::social-post.social-post',
        {
          filters: {
            campaign: { id: campaignId },
          },
          populate: {
            media: true,
            author: { fields: ['username', 'email'] },
          },
        }
      );
    },

    /**
     * Get posts by platform
     */
    async getPostsByPlatform(platform: string) {
      return await strapi.entityService.findMany(
        'api::social-post.social-post',
        {
          filters: {
            platforms: {
              $contains: platform,
            },
          },
          populate: {
            media: true,
            campaign: true,
            author: { fields: ['username', 'email'] },
          },
        }
      );
    },

    /**
     * Validate post content for platforms
     */
    validatePostForPlatforms(post: any) {
      const errors: any[] = [];
      const platforms = post.platforms || [];

      platforms.forEach((platform: string) => {
        switch (platform) {
          case 'twitter':
            if (post.content.length > 280) {
              errors.push({
                platform,
                field: 'content',
                message: 'Twitter posts must be 280 characters or less',
              });
            }
            break;
          case 'instagram':
            if (!post.media || post.media.length === 0) {
              errors.push({
                platform,
                field: 'media',
                message: 'Instagram posts require at least one image or video',
              });
            }
            if (post.content.length > 2200) {
              errors.push({
                platform,
                field: 'content',
                message: 'Instagram captions must be 2200 characters or less',
              });
            }
            break;
          case 'linkedin':
            if (post.content.length > 3000) {
              errors.push({
                platform,
                field: 'content',
                message: 'LinkedIn posts must be 3000 characters or less',
              });
            }
            break;
          case 'facebook':
            if (post.content.length > 63206) {
              errors.push({
                platform,
                field: 'content',
                message: 'Facebook posts must be 63206 characters or less',
              });
            }
            break;
        }
      });

      return {
        isValid: errors.length === 0,
        errors,
      };
    },

    /**
     * Get post analytics summary
     */
    async getPostAnalyticsSummary(postId: number) {
      const analytics = await strapi.entityService.findMany(
        'api::post-analytics.post-analytics',
        {
          filters: {
            post: { id: postId },
          },
        }
      );

      const summary = {
        totalImpressions: 0,
        totalEngagements: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        totalClicks: 0,
        totalReach: 0,
        averageEngagementRate: 0,
        byPlatform: {},
      };

      analytics.forEach((record: any) => {
        summary.totalImpressions += Number(record.impressions || 0);
        summary.totalEngagements += Number(record.engagements || 0);
        summary.totalLikes += Number(record.likes || 0);
        summary.totalComments += Number(record.comments || 0);
        summary.totalShares += Number(record.shares || 0);
        summary.totalClicks += Number(record.clicks || 0);
        summary.totalReach += Number(record.reach || 0);

        summary.byPlatform[record.platform] = {
          impressions: record.impressions,
          engagements: record.engagements,
          likes: record.likes,
          comments: record.comments,
          shares: record.shares,
          clicks: record.clicks,
          reach: record.reach,
          engagementRate: record.engagementRate,
        };
      });

      if (analytics.length > 0) {
        summary.averageEngagementRate =
          analytics.reduce(
            (sum: number, record: any) => sum + Number(record.engagementRate || 0),
            0
          ) / analytics.length;
      }

      return summary;
    },
  })
);
