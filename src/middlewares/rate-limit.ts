/**
 * Rate limiting middleware using express-rate-limit
 * Prevents abuse and ensures API stability
 */

import rateLimit from 'express-rate-limit';

export default (config, { strapi }) => {
  const { enabled = true, max = 100, windowMs = 900000 } = config;

  if (!enabled) {
    return async (ctx, next) => {
      await next();
    };
  }

  const limiter = rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Too Many Requests',
      message: 'You have exceeded the request limit. Please try again later.',
      statusCode: 429,
    },
    handler: (req, res) => {
      strapi.log.warn(
        `Rate limit exceeded for IP: ${req.ip} on path: ${req.path}`
      );
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'You have exceeded the request limit. Please try again later.',
        statusCode: 429,
      });
    },
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/_health' || req.path === '/health';
    },
    keyGenerator: (req) => {
      // Use IP address as key
      return req.ip || req.connection.remoteAddress;
    },
  });

  return async (ctx, next) => {
    await new Promise((resolve, reject) => {
      limiter(ctx.request.req, ctx.response.res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(null);
        }
      });
    });

    await next();
  };
};
