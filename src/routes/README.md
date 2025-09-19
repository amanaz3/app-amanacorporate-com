# Routes Structure

This directory contains the organized routing structure for the application.

## Overview

The routing is organized into logical groups for better maintainability:

- **PublicRoutes.tsx** - Routes that don't require authentication
- **AdminRoutes.tsx** - Admin-only routes with nested structure  
- **UserRoutes.tsx** - Routes for regular users
- **ManagerRoutes.tsx** - Manager-specific routes
- **PartnerRoutes.tsx** - Partner-specific routes
- **ApplicationRoutes.tsx** - Application management routes

## Route Structure

### Admin Routes (`/admin/*`)
- Dashboard: `/admin` (index)
- Statistics: `/admin/statistics`
- User Management: `/admin/users`, `/admin/users/create`
- Manager Management: `/admin/managers`, `/admin/managers/create`  
- Partner Management: `/admin/partners`, `/admin/partners/create`, `/admin/partners/requests`
- Application Management: `/admin/applications/*`
- Role Management: `/admin/roles`
- Settings: `/admin/settings/general`

### User Routes (`/user/*`)
- Dashboard: `/user` (index)
- Customer Management: `/user/customers`, `/user/customers/:id`
- Application Status: `/user/completed`, `/user/rejected`

### Manager Routes (`/managers/*`)
- Dashboard: `/managers` (index)
- Status Management: `/managers/need-more-info`, `/managers/return`, etc.
- Management: `/managers/management`

### Partner Routes (`/partners/*`)
- Dashboard: `/partners` (index)
- Status Management: `/partners/need-more-info`, `/partners/return`, etc.
- Management: `/partners/management`, `/partners/company-management`

### Application Routes
- List: `/applications`
- Detail: `/applications/:applicationId`
- Create: `/customers/:customerId/applications/create`

### Legacy Redirects
- `/manager-dashboard` → `/managers`
- `/partner-dashboard` → `/partners`
- `/user-dashboard` → `/user`

## Usage

Import the main routing component in your App.tsx:

```tsx
import AppRoutes from '@/routes';

// In your App component
<AppRoutes />
```

The routing system automatically handles:
- Authentication guards
- Error boundaries
- Loading states
- Layout wrapping