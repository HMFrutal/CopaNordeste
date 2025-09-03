# Overview

This project is a full-stack web application for managing the "Copa Nordeste 2025" - a regional football tournament in Northeast Brazil. The application serves as a comprehensive platform for tournament management, featuring team information, competition tracking, match scheduling, news updates, and contact functionality. Built with modern web technologies, it provides both administrative capabilities and a public-facing website for tournament participants and fans.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built as a Single Page Application (SPA) using React with TypeScript. Key architectural decisions include:

- **UI Framework**: React with TypeScript for type safety and component-based development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design system
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation schemas
- **Build Tool**: Vite for fast development and optimized production builds

The frontend follows a page-based structure with reusable components, separating concerns between UI components, business logic, and data fetching.

## Backend Architecture

The backend is built as a RESTful API using Express.js with TypeScript:

- **Framework**: Express.js for HTTP server and routing
- **Type Safety**: TypeScript throughout the entire backend stack
- **Data Validation**: Zod schemas shared between frontend and backend
- **Storage Interface**: Abstract storage interface allowing for multiple implementations (currently in-memory, designed for database integration)
- **Development Setup**: Custom Vite integration for hot reloading in development

The API follows REST conventions with endpoints for teams, competitions, matches, news, and contact management.

## Data Storage Solutions

The application uses a layered data architecture:

- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Abstraction Layer**: Storage interface pattern allowing for easy switching between storage implementations
- **Development Storage**: In-memory storage implementation for development and testing

The database schema includes tables for teams, competitions, matches, news articles, and contact submissions with proper relationships and constraints.

## Authentication and Authorization

Currently, the application does not implement authentication, but the architecture supports future integration through:

- **Middleware Pattern**: Express middleware structure ready for auth integration
- **Protected Routes**: Frontend routing structure supports protected pages
- **API Security**: CORS and security headers configured for production deployment

# External Dependencies

## Database and ORM
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database operations and query building
- **Drizzle Kit**: Database migration management and schema evolution

## Frontend Libraries
- **React Query**: Server state management and data fetching with caching
- **Radix UI**: Accessible, unstyled UI primitives for custom component development
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind
- **Wouter**: Minimalist routing library for single-page applications
- **React Hook Form**: Performant form library with built-in validation

## Backend Dependencies
- **Express.js**: Web application framework for Node.js
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **Zod**: TypeScript-first schema validation library

## Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking for JavaScript
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Custom plugins for Replit development environment

## External Services
The application is designed to integrate with external services for:
- **Image Storage**: External image hosting for team logos and news images
- **Email Services**: Contact form submissions and notifications
- **Social Media**: Integration with social media platforms for content sharing