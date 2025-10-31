/**
 * Redis utility for caching and session management
 * Provides connection management and common cache operations
 */

import Redis from 'ioredis';
import logger from './logger';

let redisClient: Redis | null = null;

/**
 * Initialize Redis connection
 */
export const initRedis = (): Redis => {
  if (redisClient) {
    return redisClient;
  }

  const config = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0'),
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  };

  redisClient = new Redis(config);

  redisClient.on('connect', () => {
    logger.info('✅ Redis connected successfully');
  });

  redisClient.on('error', (err) => {
    logger.error('❌ Redis connection error:', err);
  });

  redisClient.on('close', () => {
    logger.warn('⚠️ Redis connection closed');
  });

  return redisClient;
};

/**
 * Get Redis client instance
 */
export const getRedisClient = (): Redis => {
  if (!redisClient) {
    return initRedis();
  }
  return redisClient;
};

/**
 * Cache wrapper with TTL
 */
export const cacheSet = async (
  key: string,
  value: any,
  ttl: number = 3600
): Promise<void> => {
  try {
    const client = getRedisClient();
    const serialized = JSON.stringify(value);
    await client.setex(key, ttl, serialized);
  } catch (error) {
    logger.error('Cache set error:', error);
    throw error;
  }
};

/**
 * Get cached value
 */
export const cacheGet = async <T = any>(key: string): Promise<T | null> => {
  try {
    const client = getRedisClient();
    const value = await client.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    logger.error('Cache get error:', error);
    return null;
  }
};

/**
 * Delete cached value
 */
export const cacheDelete = async (key: string): Promise<void> => {
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    logger.error('Cache delete error:', error);
    throw error;
  }
};

/**
 * Clear all cache with pattern
 */
export const cacheClearPattern = async (pattern: string): Promise<void> => {
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (error) {
    logger.error('Cache clear pattern error:', error);
    throw error;
  }
};

/**
 * Check if key exists in cache
 */
export const cacheExists = async (key: string): Promise<boolean> => {
  try {
    const client = getRedisClient();
    const result = await client.exists(key);
    return result === 1;
  } catch (error) {
    logger.error('Cache exists error:', error);
    return false;
  }
};

/**
 * Close Redis connection
 */
export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis connection closed');
  }
};
