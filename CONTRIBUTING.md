# Contributing to Hono Mail Service API

Thank you for your interest in contributing to the Hono Mail Service API! We welcome contributions from the community and are pleased to have you join us.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [ismaelhv@outlook.com](mailto:ismaelhv@outlook.com).

### Our Pledge

We pledge to make participation in our project and community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find that you don't need to create one. When creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots if applicable**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible
- Follow the TypeScript and JavaScript styleguides
- Include thoughtfully-worded, well-structured tests
- Document new code based on the Documentation Styleguide
- End all files with a newline

## Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/IsmaellHV/hono-cf.git worker-file-api
   cd worker-file-api
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Set up environment variables** (Workers uses `.dev.vars`):

   ```bash
   cp .dev.vars.example .dev.vars
   # Edit .dev.vars with your configuration
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

## Making Changes

1. **Create a topic branch** from `main`:

   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes** in logical commits
3. **Test your changes** thoroughly
4. **Add or update tests** as necessary
5. **Update documentation** if needed

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Example:

```
Add email validation to user registration

- Implement email format validation
- Add comprehensive tests for email validation
- Update error messages for better user experience

Fixes #123
```

## Submitting Changes

1. **Push your changes** to your fork:

   ```bash
   git push origin feature/amazing-feature
   ```

2. **Create a Pull Request** on GitHub
3. **Wait for review** - we'll review your PR as soon as possible
4. **Address feedback** if any changes are requested

## Style Guidelines

### TypeScript Style Guide

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Use strict TypeScript configuration

### Code Structure

- Follow the existing architecture pattern (Domain-Driven Design)
- Place business logic in the Domain layer
- Keep infrastructure concerns separate
- Use dependency injection where appropriate

### File Organization

- Use kebab-case for file names
- Group related files in directories
- Keep files focused on a single responsibility
- Use index.ts files for clean exports

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write tests for all new functionality
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Test both happy paths and error cases

### Test Structure

```typescript
describe('FeatureName', () => {
  describe('when condition', () => {
    it('should do something', () => {
      // Arrange
      const input = {};

      // Act
      const result = doSomething(input);

      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

## Documentation

### Code Documentation

- Document all public APIs with JSDoc
- Include examples in documentation
- Keep documentation up to date with code changes
- Use clear and concise language

### README Updates

- Update README.md if your changes affect usage
- Add new features to the features list
- Update installation or setup instructions if needed

## Community

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Email**: [ismaelhv@outlook.com](mailto:ismaelhv@outlook.com) for general questions
- **LinkedIn**: [Ismael Hurtado](https://www.linkedin.com/in/ihurtadov/) for professional inquiries

### Recognition

Contributors will be recognized in the project's README.md file and release notes.

## Development Environment

### Required Tools

- Node.js 20 or higher
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Recommended VS Code Extensions

- TypeScript Hero
- ESLint
- Prettier
- GitLens
- Thunder Client (for API testing)

### Environment Variables

Create a `.dev.vars` file with the following variables:

```ini
PREFIX=v1
DOMAINS=["localhost"]
RESEND_API_TOKEN=re_xxxxxxxx
RESEND_FROM=NOTIFICACIONES <no-reply@yourdomain.com>
```

## Release Process

1. Version bumping follows semantic versioning
2. Create a release branch from `main`
3. Update version in `package.json`
4. Update CHANGELOG.md
5. Create a pull request for the release
6. After merge, create a GitHub release with appropriate tags

## Questions?

Don't hesitate to reach out if you have any questions about contributing. We're here to help!

Thank you for contributing to the Hono Mail Service API! 🚀
