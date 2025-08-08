# Dating App

## Overview

This is a modern dating application built with React and Express, featuring a Tinder-like interface for discovering and matching with other users. The app supports swiping mechanics, real-time messaging, and user profile management. It's designed as a mobile-first application with a responsive design that works well on both mobile devices and desktop browsers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built using React with TypeScript and follows a component-based architecture:

- **Routing**: Uses Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Animations**: Framer Motion for smooth swipe animations and transitions
- **Build Tool**: Vite for fast development and optimized production builds

The app structure includes four main pages: Discovery (swiping), Matches, Profile, and Chat, with a bottom navigation bar for mobile-style navigation.

### Backend Architecture
The server follows a RESTful API pattern using Express.js:

- **Framework**: Express.js with TypeScript for type safety
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Schema Validation**: Zod schemas for runtime type checking and validation
- **Storage Layer**: Abstracted storage interface with in-memory implementation (easily replaceable with database)
- **Development**: Hot reload setup with Vite integration for full-stack development

### Data Storage Solutions
The application uses a PostgreSQL database configured through Drizzle:

- **Database**: PostgreSQL with Neon serverless database connection
- **Migrations**: Drizzle Kit for database schema migrations
- **Schema**: Four main tables - users, swipes, matches, and messages
- **Current Implementation**: In-memory storage for development with sample data
- **Production Ready**: Database configuration is set up but implementation uses memory storage pattern

### Authentication and Authorization
Currently implements a simplified authentication system:

- **User Identification**: Mock user ID system for development
- **Session Management**: Basic session handling structure in place
- **Security**: Prepared for implementing proper authentication middleware

### External Dependencies
The application integrates several key external services and libraries:

- **Neon Database**: Serverless PostgreSQL database for production data storage
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Query**: Server state management and caching
- **Framer Motion**: Animation library for smooth user interactions
- **Drizzle ORM**: Type-safe database operations and migrations
- **Zod**: Runtime type validation and schema definition

The architecture supports easy scaling and deployment, with clear separation between client and server concerns, and a flexible storage layer that can be adapted for different database backends.