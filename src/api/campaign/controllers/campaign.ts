/**
 * campaign controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::campaign.campaign',
  ({ strapi }) => ({
    /**
     * Get campaign analytics
     */
    async analytics(ctx) {
      const { id } = ctx.params;

      const campaign = await strapi.entityService.findOne(
        'api::campaign.campaign',
        id,
        {
          populate: {
            posts: {
              populate: {
                analytics: true,
              },
            },
          },
        }
      );

      if (!campaign) {
        return ctx.notFound('Campaign not found');
      }

      const analytics = {
        totalPosts: campaign.posts?.length || 0,
        publishedPosts: campaign.posts?.filter((p) => p.status === 'published').length || 0,
        scheduledPosts: campaign.posts?.filter((p) => p.status === 'scheduled').length || 0,
        draftPosts: campaign.posts?.filter((p) => p.status === 'draft').length || 0,
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

      campaign.posts?.forEach((post) => {
        post.analytics?.forEach((analytic) => {
          analytics.totalImpressions += Number(analytic.impressions || 0);
          analytics.totalEngagements += Number(analytic.engagements || 0);
          analytics.totalLikes += Number(analytic.likes || 0);
          analytics.totalComments += Number(analytic.comments || 0);
          analytics.totalShares += Number(analytic.shares || 0);
          analytics.totalClicks += Number(analytic.clicks || 0);
          analytics.totalReach += Number(analytic.reach || 0);

          if (!analytics.byPlatform[analytic.platform]) {
            analytics.byPlatform[analytic.platform] = {
              impressions: 0,
              engagements: 0,
              likes: 0,
              comments: 0,
              shares: 0,
              clicks: 0,
              reach: 0,
            };
          }

          analytics.byPlatform[analytic.platform].impressions += Number(
            analytic.impressions || 0
          );
          analytics.byPlatform[analytic.platform].engagements += Number(
            analytic.engagements || 0
          );
          analytics.byPlatform[analytic.platform].likes += Number(analytic.likes || 0);
          analytics.byPlatform[analytic.platform].comments += Number(
            analytic.comments || 0
          );
          analytics.byPlatform[analytic.platform].shares += Number(analytic.shares || 0);
          analytics.byPlatform[analytic.platform].clicks += Number(analytic.clicks || 0);
          analytics.byPlatform[analytic.platform].reach += Number(analytic.reach || 0);
        });
      });

      // Update campaign with aggregated analytics
      await strapi.entityService.update('api::campaign.campaign', id, {
        data: {
          totalImpressions: analytics.totalImpressions,
          totalEngagements: analytics.totalEngagements,
          totalReach: analytics.totalReach,
        },
      });

      return analytics;
    },
  })
);
