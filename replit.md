# Municipal Grievance Portal

## Overview
A civic grievance tracking platform for Thane Municipal Corporation. Citizens can submit complaints, track their resolution status, and administrators can manage and resolve grievances. Built with React, TypeScript, Vite, and TailwindCSS with shadcn/ui components.

## Project Architecture

### Frontend Structure
- `src/` - Main source directory
  - `components/` - React components
    - `layout/` - Layout components (AdminLayout, CitizenLayout)
    - `ui/` - shadcn/ui components
  - `contexts/` - React contexts (AuthContext, GrievanceContext)
  - `hooks/` - Custom React hooks
  - `lib/` - Utility functions
  - `pages/` - Page components
    - `admin/` - Admin dashboard pages
    - `citizen/` - Citizen portal pages

### Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: TailwindCSS with shadcn/ui components
- **Routing**: React Router DOM v6
- **State Management**: React Context API, TanStack React Query
- **Forms**: React Hook Form with Zod validation

## Running the Application
The application runs on port 5000 using `npm run dev`.

## Recent Changes
- December 25, 2025: Migrated from Lovable to Replit environment
  - Updated Vite config to use port 5000 and allow all hosts
