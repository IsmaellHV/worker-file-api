# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible receiving such patches depend on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

The team and community take security bugs seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

To report a security issue, please use one of the following methods:

### Email

Send an email to **ismaelhv@outlook.com** with the following information:

- Type of issue (buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### What to expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 2 business days.
- **Investigation**: We will investigate the issue and determine its severity and impact.
- **Response**: We will provide a more detailed response within 5 business days indicating our assessment and next steps.
- **Resolution**: We will work to fix the issue as quickly as possible and keep you informed of our progress.

## Security Update Process

1. **Assessment**: We assess the vulnerability and determine its severity.
2. **Fix Development**: We develop a fix for the vulnerability.
3. **Testing**: We test the fix to ensure it resolves the issue without introducing new problems.
4. **Release**: We release the fix as a security update.
5. **Notification**: We notify users about the security update and provide guidance on how to apply it.

## Security Best Practices

When using this project, please follow these security best practices:

### Environment Variables

- Never commit sensitive information like API keys, passwords, or tokens to version control
- Use environment variables for configuration
- Use strong, unique passwords and API keys

### Input Validation

- Always validate and sanitize user inputs
- Use the built-in validation features provided by the application
- Never trust user-provided data without proper validation

### Updates

- Keep dependencies up to date
- Regularly update the application to the latest version
- Monitor security advisories for the frameworks and libraries used

### Deployment

- Use HTTPS in production
- Implement proper authentication and authorization
- Use security headers to protect against common attacks
- Regularly audit your deployment configuration

## Responsible Disclosure

We kindly ask that you:

- Give us reasonable time to investigate and mitigate an issue you report before making any information public
- Do not access or modify data that does not belong to you
- Do not perform testing that could degrade the service for other users
- Do not use social engineering techniques

## Bug Bounty Program

We do not currently offer a bug bounty program, but we greatly appreciate responsible disclosure of security vulnerabilities.

## Contact

For any security-related questions or concerns, please contact:

- **Email**: ismaelhv@outlook.com
- **GitHub**: [@IsmaellHV](https://github.com/IsmaellHV)

Thank you for helping keep our project and our users safe!
