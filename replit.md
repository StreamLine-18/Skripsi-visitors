# Alas Purwo Digital Ticketing System

## Overview

This is a full-stack web application for Taman Nasional Alas Purwo (Alas Purwo National Park) digital ticketing system. The application provides an intuitive interface for visitors to browse attractions, purchase tickets, and manage their bookings. It features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data storage and implementing a clean, responsive design optimized for both mobile and desktop users.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite for fast development and optimized builds
- **Mobile-First Design**: Responsive layout with separate mobile/desktop navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with JSON responses
- **Error Handling**: Centralized error middleware with structured responses
- **Request Logging**: Custom middleware for API request/response logging

### Data Storage Solutions
- **Database**: PostgreSQL (configured for production)
- **ORM**: Drizzle ORM with type-safe queries
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Migrations**: Drizzle Kit for schema management
- **Development Storage**: In-memory storage class for rapid prototyping

## Key Components

### Database Schema
The application uses a well-structured PostgreSQL schema with the following main tables:
- **Users**: User authentication and profile information
- **Attractions**: Park attractions with detailed metadata (pricing, descriptions, features)
- **Tickets**: Digital tickets with QR codes and visit scheduling
- **News**: Park announcements and events

### API Endpoints
- `GET /api/attractions` - List all park attractions
- `GET /api/attractions/:slug` - Get specific attraction details
- `GET /api/tickets` - Get user's tickets (uses demo user)
- `POST /api/tickets` - Create new ticket booking
- `PUT /api/tickets/:id/status` - Update ticket status
- `GET /api/news` - Get park news and events

### Frontend Pages
- **Home**: Attraction browsing with search and categories
- **Tickets**: Active tickets with QR codes for entry
- **History**: Past and expired tickets
- **Profile**: User account management
- **Attraction Detail**: Detailed attraction info with booking capability

### Authentication System
Currently uses a simplified demo authentication system with a seeded user account for development purposes. The architecture supports full authentication implementation.

## Data Flow

1. **User Interaction**: Users browse attractions on the home page or navigate via mobile bottom navigation/desktop sidebar
2. **API Requests**: TanStack Query handles all server communication with automatic caching and error handling
3. **Data Processing**: Express.js routes process requests, interact with storage layer, and return structured JSON responses
4. **UI Updates**: React components automatically re-render based on query state changes
5. **Real-time Features**: Toast notifications provide feedback for user actions

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm & drizzle-kit**: Type-safe database operations and migrations
- **wouter**: Lightweight client-side routing
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Replit integration for development

### UI Enhancement
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Conditional CSS class handling
- **date-fns**: Date formatting and manipulation
- **lucide-react**: Modern icon library

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild compiles TypeScript server to `dist/index.js`
- **Database**: Drizzle migrations ensure schema consistency

### Environment Configuration
- **Development**: Uses `tsx` for hot-reloading TypeScript execution
- **Production**: Compiled JavaScript with `NODE_ENV=production`
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection

### Deployment Architecture
The application is designed for modern hosting platforms with:
- Static asset serving through Express.js
- Database migrations via `drizzle-kit push`
- Environment-specific configuration management
- Progressive Web App capabilities with service worker and manifest

### Performance Optimizations
- Lazy loading and code splitting through Vite
- TanStack Query caching reduces unnecessary API calls
- Optimized image handling for attraction photos
- Mobile-first responsive design for faster mobile loading