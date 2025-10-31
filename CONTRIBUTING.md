# Contributing to StrapiXi

Thank you for your interest in contributing to StrapiXi! This document provides guidelines and instructions for contributing to this project.

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm 6+
- Docker and Docker Compose (recommended)
- Git
- A GitHub account

### Development Setup

1. **Fork and clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/strapixi.git
cd strapixi
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment**
```bash
cp .env.example .env
./scripts/generate-keys.sh  # Generate secure keys
# Edit .env and configure your database, Redis, etc.
```

4. **Start development environment**
```bash
# Option 1: Using Docker (recommended)
docker-compose -f docker-compose.dev.yml up -d
npm run develop

# Option 2: Local setup
npm run develop
```

5. **Verify installation**
```bash
./scripts/verify-installation.sh
```

6. **Access the application**
- Admin panel: http://localhost:1337/admin
- API: http://localhost:1337/api

## 📝 Development Workflow

### Branch Naming Convention

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring
- `test/description` - Test additions or changes
- `chore/description` - Maintenance tasks

### Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

**Examples:**
```bash
feat(social-post): add support for video posts
fix(campaign): resolve analytics calculation issue
docs(readme): update installation instructions
test(publisher): add unit tests for Facebook connector
```

### Pull Request Process

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
- Write clean, readable code
- Follow existing code style
- Add tests for new functionality
- Update documentation as needed

3. **Test your changes**
```bash
npm run lint          # Check code style
npm run type-check    # Check TypeScript types
npm test              # Run tests
npm run build         # Ensure build works
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat(scope): description of changes"
```

5. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request**
- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your branch
- Fill in the PR template with:
  - Description of changes
  - Related issues
  - Testing done
  - Screenshots (if applicable)

## 🧪 Testing Guidelines

### Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# With coverage
npm test -- --coverage
```

### Writing Tests

- Place tests in the `tests/` directory
- Use descriptive test names
- Follow the AAA pattern: Arrange, Act, Assert
- Mock external dependencies
- Aim for 80%+ code coverage

**Example test structure:**
```typescript
describe('Social Post Service', () => {
  describe('validatePostForPlatforms', () => {
    it('should return errors for Twitter posts over 280 characters', () => {
      // Arrange
      const post = { content: 'a'.repeat(300), platforms: ['twitter'] };
      
      // Act
      const result = service.validatePostForPlatforms(post);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].platform).toBe('twitter');
    });
  });
});
```

## 🎨 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define interfaces and types for all data structures
- Avoid `any` type when possible
- Use explicit return types for functions
- Leverage path mappings (`@/`, `@plugins/`, etc.)

### Formatting

- Use Prettier for code formatting (configured in `.prettierrc`)
- Run `npm run format` before committing
- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line structures

### Naming Conventions

- **Files**: kebab-case (`social-post.ts`)
- **Directories**: kebab-case (`social-media-connector/`)
- **Classes**: PascalCase (`SocialPostService`)
- **Interfaces/Types**: PascalCase (`PostAnalytics`)
- **Functions/Variables**: camelCase (`publishPost`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)

### Comments and Documentation

- Use JSDoc comments for functions and classes
- Explain complex logic with inline comments
- Keep comments up-to-date with code changes
- Document API endpoints in controller files

**Example:**
```typescript
/**
 * Publish a social media post to selected platforms
 * 
 * @param post - The post object with content and platform configuration
 * @returns Promise resolving to publish results for each platform
 * @throws Error if no platforms are selected or API credentials are missing
 */
async publishPost(post: SocialPost): Promise<PublishResult> {
  // Implementation
}
```

## 📦 Adding Dependencies

- Use `npm install` to add dependencies
- Justify the need for new dependencies
- Check for security vulnerabilities: `npm audit`
- Update package.json with appropriate version ranges

## 🔌 Creating Custom Plugins

### Plugin Structure

```
src/plugins/your-plugin/
├── admin/
│   └── src/
│       └── index.tsx
├── server/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── bootstrap.ts
│   ├── register.ts
│   └── index.ts
├── package.json
└── README.md
```

### Plugin Guidelines

1. Follow Strapi v5 plugin conventions
2. Separate admin (frontend) and server (backend) code
3. Export lifecycle hooks (register, bootstrap)
4. Provide configuration schema
5. Document plugin usage and API

## 🐛 Reporting Bugs

### Before Submitting

- Check existing issues to avoid duplicates
- Test with the latest version
- Gather relevant information:
  - Node.js version
  - Operating system
  - Database type and version
  - Error messages and stack traces
  - Steps to reproduce

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Node.js version:
- Strapi version:
- Database:
- OS:

**Additional Context**
Any other relevant information
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Proposed Solution**
How you think it should be solved

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Any other relevant information
```

## 📚 Documentation

### Documentation Structure

- Keep README.md up-to-date with major changes
- Document new features in appropriate docs/
- Include code examples
- Add screenshots for UI changes
- Update API documentation

### Documentation Style

- Use clear, concise language
- Include practical examples
- Organize with headers and lists
- Link to relevant resources
- Keep formatting consistent

## 🔍 Code Review Process

### As a Reviewer

- Be constructive and respectful
- Explain reasoning for suggested changes
- Approve when ready or request changes
- Test the changes locally if possible

### As an Author

- Respond to feedback promptly
- Be open to suggestions
- Make requested changes
- Update the PR description as needed

## 🏆 Recognition

Contributors will be:
- Listed in the project README
- Credited in release notes
- Mentioned in commit messages (Co-authored-by)

## 📞 Getting Help

- Open a GitHub issue for bugs or questions
- Tag issues with appropriate labels
- Be patient and respectful

## 📜 License

By contributing to StrapiXi, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to StrapiXi! 🎉

For questions or clarifications, feel free to open an issue or contact the maintainers.
