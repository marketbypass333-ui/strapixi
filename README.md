# StrapiXi - Enterprise Social Media Content Management System

![Strapi v5](https://img.shields.io/badge/Strapi-v5.4.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![License](https://img.shields.io/badge/license-MIT-green)

> A production-ready, enterprise-grade Strapi v5 application for comprehensive social media content management across multiple platforms.

## 🚀 Features

### Core Functionality
- **Multi-Platform Publishing**: Publish content to Facebook, Instagram, Twitter/X, LinkedIn, TikTok, and YouTube from a centralized dashboard
- **Content Scheduling**: Advanced scheduling with timezone support and automated publishing
- **Campaign Management**: Organize posts into campaigns with budget tracking and performance analytics
- **Content Templates**: Reusable templates with variable support for consistent branding
- **Workflow Management**: Approval processes with pending, review, approved, and rejected states
- **A/B Testing**: Test content variations to optimize engagement
- **Analytics Dashboard**: Real-time metrics and insights across all platforms
- **Multi-Language Support**: Built-in i18n for global content management
- **SEO Optimization**: Meta tags, keywords, and social media previews

### Technical Stack
- **Backend**: Strapi v5 (latest stable) with TypeScript
- **Database**: PostgreSQL (primary), MySQL (alternative), SQLite (development)
- **Cache**: Redis for session management and performance optimization
- **Containerization**: Docker with multi-stage builds
- **API**: REST and GraphQL support
- **Authentication**: JWT with refresh tokens and RBAC

### Security Features
- Rate limiting on API endpoints
- Helmet.js security headers
- CORS configuration
- Input validation and sanitization
- Activity logging and audit trails
- Role-based access control (Admin, Editor, Contributor, Viewer)

## 📋 Prerequisites

- Node.js 18+ (recommended: 20.x)
- npm 6+ or Yarn
- PostgreSQL 12+ or MySQL 8+ (for production)
- Redis 7+ (for caching)
- Docker and Docker Compose (optional, but recommended)

## 🛠️ Installation

### Option 1: Docker (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/marketbypass333-ui/strapixi.git
cd strapixi
```

2. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start with Docker Compose**
```bash
# For development
docker-compose -f docker-compose.dev.yml up -d

# For production
docker-compose up -d
```

4. **Access the application**
- Admin panel: http://localhost:1337/admin
- API: http://localhost:1337/api

### Option 2: Local Installation

1. **Clone and install dependencies**
```bash
git clone https://github.com/marketbypass333-ui/strapixi.git
cd strapixi
npm install
```

2. **Set up databases**
```bash
# Start PostgreSQL and Redis (if using Docker)
docker-compose -f docker-compose.dev.yml up -d postgres redis
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database and Redis credentials
```

4. **Run migrations and seeds**
```bash
npm run migrate
npm run seed # (optional, for development data)
```

5. **Start the development server**
```bash
npm run develop
```

## 🔧 Configuration

### Environment Variables

Key environment variables to configure:

```env
# Server
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys-here
ADMIN_JWT_SECRET=your-admin-secret
JWT_SECRET=your-jwt-secret

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapixi_cms
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your-password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Social Media API Keys
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-secret
TWITTER_BEARER_TOKEN=your-twitter-token
LINKEDIN_CLIENT_ID=your-linkedin-id
# ... (see .env.example for complete list)
```

### Social Media Platform Setup

#### Facebook & Instagram
1. Create a Facebook App at https://developers.facebook.com
2. Add Facebook Login and Instagram Basic Display products
3. Generate access tokens with required permissions
4. Configure in `.env` file

#### Twitter/X
1. Create a Twitter Developer account
2. Create an app and generate API keys
3. Enable OAuth 2.0 and get Bearer Token
4. Configure in `.env` file

#### LinkedIn
1. Create a LinkedIn App
2. Request necessary permissions for posting
3. Generate OAuth 2.0 tokens
4. Configure in `.env` file

#### YouTube
1. Create a Google Cloud Project
2. Enable YouTube Data API v3
3. Create OAuth 2.0 credentials
4. Configure in `.env` file

#### TikTok
1. Apply for TikTok for Business API access
2. Create an app in TikTok for Developers
3. Generate access tokens
4. Configure in `.env` file

## 📁 Project Structure

```
strapixi/
├── config/                 # Strapi configuration files
│   ├── admin.ts           # Admin panel config
│   ├── api.ts             # API configuration
│   ├── database.ts        # Database configuration
│   ├── middlewares.ts     # Middleware stack
│   ├── plugins.ts         # Plugin configuration
│   └── server.ts          # Server configuration
├── src/
│   ├── api/               # Content-types, controllers, services
│   │   ├── social-post/
│   │   ├── campaign/
│   │   ├── content-template/
│   │   └── post-analytics/
│   ├── plugins/           # Custom Strapi plugins
│   │   ├── social-media-connector/
│   │   ├── content-scheduler/
│   │   ├── analytics-dashboard/
│   │   └── workflow-management/
│   ├── extensions/        # Admin panel customizations
│   ├── middlewares/       # Custom middleware
│   ├── policies/          # Access control policies
│   ├── services/          # Global services
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   └── index.ts           # Application entry point
├── tests/                 # Test suites
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/               # Deployment and utility scripts
├── docs/                  # Documentation
├── docker-compose.yml     # Production Docker setup
├── docker-compose.dev.yml # Development Docker setup
├── Dockerfile             # Multi-stage Docker build
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 Custom Plugins

### Social Media Connector
Handles connections and publishing to social media platforms.

**Features:**
- Multi-platform API integration
- Token validation and management
- Media upload support
- Error handling and retry logic

### Content Scheduler
Manages scheduled posts with cron jobs.

**Features:**
- Timezone-aware scheduling
- Automatic publishing at scheduled times
- Failed post retry mechanism
- Schedule conflict detection

### Analytics Dashboard
Real-time analytics and reporting.

**Features:**
- Platform-specific metrics
- Campaign performance tracking
- Custom date range reports
- Export functionality

### Workflow Management
Approval workflows and A/B testing.

**Features:**
- Multi-stage approval process
- Comment and feedback system
- A/B test variant management
- Approval notifications

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm test -- --coverage
```

## 📚 API Documentation

### REST API
- Base URL: `http://localhost:1337/api`
- Documentation: `http://localhost:1337/documentation`

### GraphQL API
- Endpoint: `http://localhost:1337/graphql`
- Playground: `http://localhost:1337/graphql` (development only)

### Key Endpoints

#### Social Posts
```
GET    /api/social-posts              # List all posts
POST   /api/social-posts              # Create a post
GET    /api/social-posts/:id          # Get post by ID
PUT    /api/social-posts/:id          # Update post
DELETE /api/social-posts/:id          # Delete post
POST   /api/social-posts/:id/schedule # Schedule post
POST   /api/social-posts/:id/publish  # Publish post immediately
POST   /api/social-posts/:id/approve  # Approve post
POST   /api/social-posts/:id/reject   # Reject post
POST   /api/social-posts/bulk-publish # Bulk publish posts
```

#### Campaigns
```
GET    /api/campaigns              # List all campaigns
POST   /api/campaigns              # Create campaign
GET    /api/campaigns/:id          # Get campaign by ID
GET    /api/campaigns/:id/analytics # Get campaign analytics
```

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Docker Deployment

```bash
# Build production image
docker build -t strapixi-cms:latest .

# Run with docker-compose
docker-compose up -d
```

### Environment-Specific Deployment

**Staging:**
```bash
NODE_ENV=staging npm run build
npm run start
```

**Production:**
```bash
NODE_ENV=production npm run build
npm run start
```

## 🔐 Security Best Practices

1. **Never commit** `.env` files or secrets
2. **Use strong passwords** for database and admin accounts
3. **Enable HTTPS** in production
4. **Configure CORS** appropriately for your domain
5. **Keep dependencies updated** regularly
6. **Enable rate limiting** on public endpoints
7. **Use environment variables** for all sensitive data
8. **Implement proper RBAC** for user access control

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `chore:` Maintenance tasks
- `refactor:` Code refactoring
- `test:` Test additions or changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Strapi](https://strapi.io/) - The leading open-source headless CMS
- All social media platform APIs for enabling integrations
- The open-source community for tools and libraries

## 📞 Support

For support, please:
- Open an issue on GitHub
- Check the [documentation](./docs)
- Contact the development team

## 🗺️ Roadmap

- [ ] Complete all platform connectors (Twitter, LinkedIn, TikTok, YouTube)
- [ ] Implement content scheduler plugin
- [ ] Build analytics dashboard plugin
- [ ] Add workflow management plugin
- [ ] Create admin panel customizations
- [ ] Implement comprehensive testing suite
- [ ] Set up CI/CD pipeline
- [ ] Add Swagger/OpenAPI documentation
- [ ] Implement real-time notifications
- [ ] Add advanced analytics and AI-powered insights

---

**Built with ❤️ using Strapi v5 and TypeScript**
