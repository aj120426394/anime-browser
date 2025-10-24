<!--
Sync Impact Report:
Version change: 0.0.0 → 1.0.0
Modified principles: N/A (new constitution)
Added sections: Technology Stack, Development Standards, Security & Privacy, Performance Standards
Removed sections: N/A
Templates requiring updates:
  ✅ plan-template.md (updated constitution check references)
  ✅ spec-template.md (aligned with new principles)
  ✅ tasks-template.md (updated with new testing and quality requirements)
Follow-up TODOs: None
-->

# Leonardo Web Challenge Constitution

## Core Principles

### I. Documentation Excellence (NON-NEGOTIABLE)

All code MUST be documented appropriately with clear comments, README files, and inline documentation. Every function, component, and module must have meaningful documentation that explains purpose, parameters, and usage. Documentation must be kept up-to-date with code changes and must be accessible to all team members.

### II. Modern React Architecture (NON-NEGOTIABLE)

MUST use React with Next.js 15 App Router for all frontend development. All components must follow React best practices including proper state management, component composition, and lifecycle management. App Router patterns must be used for routing, layouts, and data fetching.

### III. Design System & Styling (NON-NEGOTIABLE)

MUST use shadcn/ui components and Tailwind CSS for all UI elements and styling. All components must be responsive with mobile-first design approach. Design system consistency must be maintained across all pages and components.

### IV. GraphQL Integration (NON-NEGOTIABLE)

MUST use Apollo Client for all GraphQL API queries and mutations. All data fetching must go through Apollo Client with proper caching, error handling, and loading states. No direct fetch calls to GraphQL endpoints are permitted.

### V. Type Safety & Validation (NON-NEGOTIABLE)

MUST use TypeScript in strict mode for all code. All external inputs (API responses, user inputs, environment variables) MUST be validated with Zod schemas before use. Runtime validation is mandatory for all data crossing system boundaries.

### VI. Accessibility Standards (NON-NEGOTIABLE)

MUST meet WCAG AA accessibility standards. All interactions must be keyboard-first with proper focus management. Color contrast ratios must meet accessibility requirements. Screen reader compatibility is mandatory for all interactive elements.

### VII. Testing Discipline (NON-NEGOTIABLE)

MUST use Vitest for unit testing with React Testing Library for component tests. Playwright MUST be used for end-to-end testing. All CI pipelines must pass linting, type checking, and tests before deployment. Test coverage must be maintained for critical paths.

### VIII. Performance Standards (NON-NEGOTIABLE)

MUST implement paginated data fetching to avoid loading large datasets. Initial Time to Interactive (TTI) must be under 1 second on mid-tier devices. Performance budgets must be enforced for bundle sizes and runtime performance.

### IX. Dependency Management (NON-NEGOTIABLE)

MUST use minimal dependencies - only include packages that are absolutely necessary. Each dependency must be justified and documented. Regular dependency audits must be performed to identify and remove unused packages.

### X. Security & Privacy (NON-NEGOTIABLE)

MUST NOT store sensitive data or secrets in the application. All HTML content from APIs must be sanitized before rendering. Server-side rendering must not leak localStorage-only data. No secrets or API keys must be required for basic functionality.

## Technology Stack

### Frontend Framework

- **React**: Latest stable version with hooks and functional components
- **Next.js**: Version 15 with App Router for routing and SSR/SSG
- **TypeScript**: Strict mode enabled for all code

### UI & Styling

- **shadcn/ui**: Component library for consistent UI elements
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Responsive Design**: Mobile-first approach with breakpoint considerations

### Data Management

- **Apollo Client**: GraphQL client for data fetching and caching
- **Zod**: Runtime schema validation for all external data

### Testing

- **Vitest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing framework

### Development Tools

- **ESLint**: Code linting with strict rules
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## Development Standards

### Code Quality

- All code must pass ESLint and TypeScript strict mode checks
- Code must be formatted with Prettier
- All functions and components must have proper TypeScript types
- No `any` types allowed without explicit justification

### Testing Requirements

- Unit tests must cover all utility functions and business logic
- Component tests must cover user interactions and rendering
- E2E tests must cover critical user journeys
- All tests must be deterministic and not flaky

### Performance Requirements

- Bundle size must be optimized with code splitting
- Images must be optimized and lazy-loaded
- API calls must be paginated and cached appropriately
- No blocking operations on the main thread

## Security & Privacy

### Data Handling

- No sensitive data storage in localStorage or sessionStorage
- All user inputs must be validated and sanitized
- HTML content from APIs must be sanitized before rendering
- No secrets or API keys in client-side code

### Content Security

- All external content must be validated before display
- XSS prevention through proper sanitization
- No inline scripts or styles without CSP approval

## Performance Standards

### Loading Performance

- Initial TTI < 1 second on mid-tier devices
- First Contentful Paint < 1.5 seconds
- Largest Contentful Paint < 2.5 seconds
- Cumulative Layout Shift < 0.1

### Runtime Performance

- No memory leaks in long-running sessions
- Efficient re-rendering with proper React optimization
- Lazy loading for non-critical components
- Proper cleanup of event listeners and subscriptions

## Governance

This constitution supersedes all other development practices and must be followed by all team members. Any violations must be documented and justified. Amendments require:

1. **Documentation**: Clear rationale for the change
2. **Approval**: Team consensus on the amendment
3. **Migration Plan**: How existing code will be updated
4. **Version Update**: Constitution version must be incremented

All pull requests and code reviews must verify compliance with these principles. Complexity must be justified and documented. Use this constitution as the primary reference for all development decisions.

**Version**: 1.0.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27
