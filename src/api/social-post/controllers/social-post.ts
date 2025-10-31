/**
 * social-post controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::social-post.social-post',
  ({ strapi }) => ({
    /**
     * Find all social posts with custom filters
     */
    async find(ctx) {
      const { query } = ctx;

      // Apply custom filters
      const filters = {
        ...query.filters,
      };

      // Add user-based filters for non-admin users
      if (!ctx.state.user?.role || ctx.state.user.role.type !== 'admin') {
        filters.author = { id: ctx.state.user.id };
      }

      const posts = await strapi.entityService.findMany(
        'api::social-post.social-post',
        {
          ...query,
          filters,
          populate: {
            media: true,
            campaign: true,
            author: { fields: ['username', 'email'] },
            approver: { fields: ['username', 'email'] },
            analytics: true,
          },
        }
      );

      return posts;
    },

    /**
     * Find one social post by ID
     */
    async findOne(ctx) {
      const { id } = ctx.params;

      const post = await strapi.entityService.findOne(
        'api::social-post.social-post',
        id,
        {
          populate: {
            media: true,
            campaign: true,
            template: true,
            author: { fields: ['username', 'email'] },
            approver: { fields: ['username', 'email'] },
            analytics: true,
          },
        }
      );

      return post;
    },

    /**
     * Create a new social post
     */
    async create(ctx) {
      const { data } = ctx.request.body;

      // Set the author to the current user
      const postData = {
        ...data,
        author: ctx.state.user.id,
        workflowStatus: 'pending',
      };

      const post = await strapi.entityService.create(
        'api::social-post.social-post',
        {
          data: postData,
          populate: {
            media: true,
            campaign: true,
            author: { fields: ['username', 'email'] },
          },
        }
      );

      return post;
    },

    /**
     * Schedule a post for publishing
     */
    async schedule(ctx) {
      const { id } = ctx.params;
      const { scheduledAt, timezone } = ctx.request.body;

      const post = await strapi.entityService.update(
        'api::social-post.social-post',
        id,
        {
          data: {
            scheduledAt,
            timezone: timezone || 'UTC',
            status: 'scheduled',
          },
          populate: {
            media: true,
            campaign: true,
            author: { fields: ['username', 'email'] },
          },
        }
      );

      // Add job to scheduler
      await strapi
        .plugin('content-scheduler')
        .service('scheduler')
        .schedulePost(post);

      return post;
    },

    /**
     * Publish a post immediately
     */
    async publish(ctx) {
      const { id } = ctx.params;

      const post = await strapi.entityService.findOne(
        'api::social-post.social-post',
        id,
        {
          populate: {
            media: true,
            platforms: true,
          },
        }
      );

      if (!post) {
        return ctx.notFound('Post not found');
      }

      // Publish to selected platforms
      const publishResults = await strapi
        .plugin('social-media-connector')
        .service('publisher')
        .publishPost(post);

      // Update post status
      const updatedPost = await strapi.entityService.update(
        'api::social-post.social-post',
        id,
        {
          data: {
            status: 'published',
            publishedAt: new Date(),
            publishErrors: publishResults.errors || [],
          },
          populate: {
            media: true,
            campaign: true,
            author: { fields: ['username', 'email'] },
          },
        }
      );

      return { post: updatedPost, results: publishResults };
    },

    /**
     * Approve a post
     */
    async approve(ctx) {
      const { id } = ctx.params;

      const post = await strapi.entityService.update(
        'api::social-post.social-post',
        id,
        {
          data: {
            workflowStatus: 'approved',
            approver: ctx.state.user.id,
          },
          populate: {
            author: { fields: ['username', 'email'] },
            approver: { fields: ['username', 'email'] },
          },
        }
      );

      return post;
    },

    /**
     * Reject a post
     */
    async reject(ctx) {
      const { id } = ctx.params;
      const { reason } = ctx.request.body;

      const post = await strapi.entityService.update(
        'api::social-post.social-post',
        id,
        {
          data: {
            workflowStatus: 'rejected',
            approver: ctx.state.user.id,
            publishErrors: [{ type: 'rejection', message: reason }],
          },
          populate: {
            author: { fields: ['username', 'email'] },
            approver: { fields: ['username', 'email'] },
          },
        }
      );

      return post;
    },

    /**
     * Duplicate a post
     */
    async duplicate(ctx) {
      const { id } = ctx.params;

      const originalPost = await strapi.entityService.findOne(
        'api::social-post.social-post',
        id,
        {
          populate: {
            media: true,
            campaign: true,
          },
        }
      );

      if (!originalPost) {
        return ctx.notFound('Post not found');
      }

      const { id: _id, createdAt, updatedAt, publishedAt, ...postData } = originalPost;

      const duplicatedPost = await strapi.entityService.create(
        'api::social-post.social-post',
        {
          data: {
            ...postData,
            title: `${postData.title} (Copy)`,
            status: 'draft',
            workflowStatus: 'pending',
            author: ctx.state.user.id,
            parentPost: id,
          },
          populate: {
            media: true,
            campaign: true,
            author: { fields: ['username', 'email'] },
          },
        }
      );

      return duplicatedPost;
    },

    /**
     * Bulk publish posts
     */
    async bulkPublish(ctx) {
      const { ids } = ctx.request.body;

      const results = await Promise.allSettled(
        ids.map((id) =>
          strapi
            .plugin('social-media-connector')
            .service('publisher')
            .publishPostById(id)
        )
      );

      return {
        successful: results.filter((r) => r.status === 'fulfilled').length,
        failed: results.filter((r) => r.status === 'rejected').length,
        results,
      };
    },
  })
);
