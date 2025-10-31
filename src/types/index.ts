/**
 * Global type definitions for the application
 */

export interface StrapiContext {
  strapi: any;
}

export interface User {
  id: number;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  type: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  action: string;
  subject?: string;
  properties?: any;
  conditions?: any;
}

export enum SocialPlatform {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  TIKTOK = 'tiktok',
  YOUTUBE = 'youtube',
}

export enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed',
  ARCHIVED = 'archived',
}

export enum WorkflowStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PUBLISHED = 'published',
}

export interface SocialPost {
  id: number;
  title: string;
  content: string;
  platforms: SocialPlatform[];
  status: PostStatus;
  scheduledAt?: Date;
  publishedAt?: Date;
  media?: MediaFile[];
  campaign?: Campaign;
  author?: User;
  workflowStatus?: WorkflowStatus;
  analytics?: PostAnalytics;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaFile {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: any;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'paused' | 'completed';
  budget?: number;
  posts?: SocialPost[];
  analytics?: CampaignAnalytics;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostAnalytics {
  id: number;
  post: SocialPost;
  platform: SocialPlatform;
  impressions: number;
  engagements: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  reach: number;
  engagementRate: number;
  clickThroughRate: number;
  fetchedAt: Date;
}

export interface CampaignAnalytics {
  id: number;
  campaign: Campaign;
  totalImpressions: number;
  totalEngagements: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalClicks: number;
  totalReach: number;
  averageEngagementRate: number;
  roi?: number;
  updatedAt: Date;
}

export interface ContentTemplate {
  id: number;
  name: string;
  description?: string;
  content: string;
  platforms: SocialPlatform[];
  category?: string;
  variables?: TemplateVariable[];
  createdBy?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'media';
  required: boolean;
  defaultValue?: any;
  description?: string;
}

export interface ScheduledJob {
  id: string;
  type: 'publish_post' | 'fetch_analytics' | 'cleanup';
  payload: any;
  scheduledAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
  error?: ApiError;
}

export interface ApiError {
  status: number;
  name: string;
  message: string;
  details?: any;
}

export interface PlatformCredentials {
  platform: SocialPlatform;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  userId?: string;
  metadata?: any;
}

export interface WebhookPayload {
  event: string;
  model: string;
  entry: any;
  createdAt: Date;
}
