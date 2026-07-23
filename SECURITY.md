# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x     | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in web-check, please **do not open a public issue**. Instead, disclose it responsibly using one of the following methods:

1. **GitHub Private Vulnerability Reporting** — Use the "Report a vulnerability" link under the Security tab of this repository (preferred).
2. **Email** — Send details to the maintainer at the email address listed on the [GitHub profile](https://github.com/lissy93).

You should receive an acknowledgment within 72 hours. We ask that you allow time for a fix to be developed and released before public disclosure.

### What to include

- A clear description of the vulnerability.
- Steps to reproduce (PoC or minimal setup).
- Affected versions and components.
- Any proposed fix (if available).

## Disclosure Policy

- We will acknowledge receipt within 3 business days.
- We will aim to release a fix within 14 days of confirmation (depending on severity).
- We will credit the reporter in the advisory (unless anonymity is requested).

## Previous Advisories

- [CVE-2025-32778](https://github.com/lissy93/web-check/security/advisories/GHSA-5qg5-g7c2-pfx8) — Command Injection in Screenshot API (Critical, fixed in 2.0.1)

## Security-Related Configuration

- All API endpoints validate input via `parse-target.js` and the built-in `URL` constructor before processing.
- The screenshot API uses `execFile()` (not `exec()`) to avoid shell injection.
- Rate limiting is applied at the reverse proxy layer in production deployments.

## Dependencies

We use Dependabot and Snyk for automated dependency scanning. If you discover a vulnerable dependency, please report it via the methods above.
