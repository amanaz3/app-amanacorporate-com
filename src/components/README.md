# Components Structure

This directory contains all React components organized by functionality.

## Directory Structure

```
src/components/
├── Admin/              # Admin-specific components
├── Analytics/          # Analytics and reporting components
├── Auth/              # Authentication related components
├── Customer/          # Customer management components
├── Dashboard/         # Dashboard components
├── Layout/            # Layout components (Sidebar, Navbar, etc.)
├── Notifications/     # Notification components
├── Performance/       # Performance monitoring components
├── Security/          # Security related components
├── Settings/          # Settings components
├── managers/          # Manager-specific components
├── partners/          # Partner-specific components
├── ui/               # Reusable UI components (shadcn/ui)
├── ComponentErrorBoundary.tsx
├── ErrorBoundary.tsx
├── LazyComponents.tsx  # Lazy loading configuration
└── PageErrorBoundary.tsx
```

## Key Components

### Layout Components
- **MainLayout.tsx** - Main application layout with sidebar and navbar
- **Sidebar.tsx** - Application sidebar with navigation
- **Navbar.tsx** - Top navigation bar

### Authentication
- **ProtectedRoute.tsx** - Route protection based on authentication
- **PermissionGuard.tsx** - Component-level permission checking
- **SignInForm.tsx** - User sign-in form

### Error Handling
- **ErrorBoundary.tsx** - Application-level error boundary
- **PageErrorBoundary.tsx** - Page-level error boundary
- **ComponentErrorBoundary.tsx** - Component-level error boundary

### UI Components (`ui/`)
Contains shadcn/ui components and custom UI elements:
- button.tsx, card.tsx, table.tsx, etc.
- All components follow the shadcn/ui patterns

### Lazy Loading
- **LazyComponents.tsx** - Centralized lazy loading configuration for all pages

## Usage Guidelines

1. **Import from appropriate directories**: Import components from their specific directories
2. **Use error boundaries**: Wrap components in appropriate error boundaries
3. **Lazy load heavy components**: Use the lazy loading system for large components
4. **Follow naming conventions**: Use PascalCase for component files
5. **Keep components focused**: Each component should have a single responsibility