# Dating App - HeartSync

## Overview

This is a comprehensive dating application built with React and Express, featuring a sophisticated Tinder-like interface for discovering and matching with other users. The app includes core dating functionality plus advanced premium features like location-based matching, profile boosting, detailed filtering, and user preferences. It's designed as a mobile-first application with a responsive design optimized for both mobile devices and desktop browsers.

## Recent Changes (January 2025)

### Advanced Features Added
- **Premium Subscription System**: Crown badges, premium modals, and upgrade prompts
- **Advanced Filtering**: Age range, distance, interests, education, and relationship type filters
- **Profile Boosting**: Super likes and profile boost features with time tracking
- **User Preferences**: Deal breakers, lifestyle preferences, and notification settings
- **Enhanced Profile Data**: Location coordinates, education, height, verification status
- **Sophisticated UI Components**: FilterModal, PremiumModal, PreferencesModal, and BoostCard

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
- **Enhanced Schema**: Six main tables - users, swipes, matches, messages, user_preferences, and boosts
- **Current Implementation**: Advanced in-memory storage with comprehensive sample data
- **Production Ready**: Database configuration is set up with full schema for premium features

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

### Premium Features & Monetization
The application includes a comprehensive premium tier system:

- **Premium Subscriptions**: Monthly subscription model with crown badges and exclusive features
- **Advanced Filters**: Age range, distance, interests, education, and relationship type filtering
- **Profile Boosting**: Time-limited profile boosts and super-like functionality
- **Enhanced Discovery**: Location-based matching with coordinate tracking
- **User Preferences**: Detailed deal-breaker and lifestyle preference management
- **Notification Controls**: Granular notification settings for matches, messages, and likes

The architecture supports easy scaling and deployment, with clear separation between client and server concerns, flexible storage layer, and a monetization-ready premium feature system that can be adapted for different database backends and payment processors.