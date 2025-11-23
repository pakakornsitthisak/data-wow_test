# Concert Ticket Reservation System

A full-stack application for managing concert ticket reservations, built with Next.js (frontend) and NestJS (backend).

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Architecture Overview](#architecture-overview)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)
- [Libraries and Packages](#libraries-and-packages)
- [Bonus: Performance Optimization](#bonus-performance-optimization)
- [Bonus: Concurrent Reservation Handling](#bonus-concurrent-reservation-handling)

## 🎯 Features

### User Features
- View all concerts in a vertical card layout
- Reserve one seat per concert (1 user = 1 seat per concert)
- Cancel reservations (changes status to 'cancel')
- View reservation statistics (Total seats, Reserve count, Cancel count)
- Switch between user and admin mode

### Admin Features
- Create new concerts with name, description, and total seats
- Delete concerts with confirmation dialog
- View all user reservations in history page
- View reservation statistics (Total seats, Reserve count, Cancel count)
- Overview tab: View all concerts with delete functionality
- Create tab: Form to create new concerts

### Technical Features
- Responsive design (mobile, tablet, desktop)
- Server-side validation using class-validator
- Client-side error handling and display
- Reservation status tracking ('reserve' or 'cancel')
- Comprehensive unit tests for backend services
- RESTful API architecture
- Sidebar navigation with mode switching
- History page with reservation table
- Delete confirmation dialogs
- Statistics dashboard for admin and user views

## 🛠 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React 19** - UI library

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type safety
- **class-validator** - Validation decorators
- **Jest** - Testing framework

## 📁 Project Structure

```
data-wow_test/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js app directory
│   │   ├── page.tsx        # Root page (redirects to /admin or /user)
│   │   ├── admin/          # Admin dashboard
│   │   │   └── page.tsx    # Admin home page with statistics and concert management
│   │   ├── user/           # User dashboard
│   │   │   └── page.tsx    # User home page with concert listings
│   │   ├── history/        # History page
│   │   │   └── page.tsx    # Reservation history table (admin view)
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── components/          # React components
│   │   ├── ConcertCard.tsx # Concert card component (used in admin/user views)
│   │   ├── CreateCard.tsx  # Create concert form component
│   │   ├── DeleteConfirmationDialog.tsx # Delete confirmation modal
│   │   ├── ErrorDisplay.tsx # Error message display component
│   │   └── Sidebar.tsx     # Navigation sidebar component
│   ├── lib/                # Utilities and API client
│   │   └── api.ts          # API client with TypeScript types
│   ├── public/             # Static assets
│   │   └── svg/            # SVG icons
│   │       ├── home.svg
│   │       ├── history.svg
│   │       ├── switch_to_user.svg
│   │       ├── log_out.svg
│   │       ├── user.svg
│   │       ├── total_of_seats.svg
│   │       ├── reserve.svg
│   │       ├── cancel.svg
│   │       ├── trash.svg
│   │       └── delete.svg
│   └── package.json
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── concert/        # Concert module
│   │   │   ├── concert.controller.ts
│   │   │   ├── concert.service.ts
│   │   │   ├── concert.service.spec.ts
│   │   │   ├── concert.entity.ts
│   │   │   ├── concert.module.ts
│   │   │   └── dto/
│   │   │       ├── create-concert.dto.ts
│   │   │       └── concert-with-stats.dto.ts
│   │   ├── reservation/    # Reservation module
│   │   │   ├── reservation.controller.ts
│   │   │   ├── reservation.service.ts
│   │   │   ├── reservation.service.spec.ts
│   │   │   ├── reservation.entity.ts
│   │   │   ├── reservation.module.ts
│   │   │   └── dto/
│   │   │       ├── create-reservation.dto.ts
│   │   │       └── cancel-reservation.dto.ts
│   │   ├── common/         # Shared utilities
│   │   │   └── filters/
│   │   │       └── http-exception.filter.ts
│   │   ├── app.module.ts   # Root module
│   │   └── main.ts         # Application entry point
│   ├── test/               # Unit tests
│   └── package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

   The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3001`

### Running Both Applications

You'll need to run both the backend and frontend simultaneously:

1. Open two terminal windows
2. In terminal 1: `cd backend && npm run start:dev`
3. In terminal 2: `cd frontend && npm run dev`
4. Open `http://localhost:3001` in your browser

## 🏗 Architecture Overview

### Backend Architecture

The backend follows NestJS's modular architecture:

- **Modules**: Feature-based modules (ConcertModule, ReservationModule)
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **DTOs**: Data Transfer Objects for validation
- **Entities**: Domain models
- **Filters**: Global exception handling

#### Data Storage
Currently using in-memory storage (arrays) for simplicity. In production, this would be replaced with a database (PostgreSQL, MongoDB, etc.).

#### Reservation Status System
Reservations include a `status` field with two possible values:
- `'reserve'` - Active reservation
- `'cancel'` - Cancelled reservation (soft delete)

When a user cancels a reservation, the status changes to 'cancel' instead of deleting the record. This allows:
- History tracking of all reservations
- Analytics on cancellation rates
- Audit trails
- Statistics calculation (reserve count vs cancel count)

#### Key Design Decisions
- Separation of concerns (controllers, services, entities)
- DTO validation using class-validator
- Global exception filter for consistent error responses
- CORS enabled for frontend communication
- Reservation status tracking ('reserve' or 'cancel') instead of hard deletion
- In-memory storage with soft-delete pattern for reservations

### Frontend Architecture

The frontend follows Next.js 13+ App Router patterns:

- **Server Components**: Default (can be used for SSR)
- **Client Components**: Marked with 'use client' for interactivity
- **API Client**: Centralized API communication (`lib/api.ts`)
- **Components**: Reusable UI components
- **Error Handling**: Error boundary pattern with ErrorDisplay component

#### Key Design Decisions
- Type-safe API client with TypeScript
- Component-based architecture with reusable components
- Responsive design with Tailwind CSS
- Client-side state management with React hooks
- Sidebar navigation with dynamic mode switching (admin/user)
- Statistics dashboard for both admin and user views
- Confirmation dialogs for destructive actions
- Status-based filtering for reservations (reserve/cancel)

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Concert Endpoints

#### GET /concerts
Get all concerts.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Concert Name",
    "description": "Concert Description",
    "seat": 100,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /concerts/:id
Get a specific concert by ID.

#### POST /concerts
Create a new concert (Admin only).

**Request Body:**
```json
{
  "name": "Concert Name",
  "description": "Concert Description",
  "seat": 100
}
```

**Validation:**
- `name`: Required, string
- `description`: Required, string
- `seat`: Required, integer, minimum 1

#### DELETE /concerts/:id
Delete a concert (Admin only).

### Reservation Endpoints

#### GET /reservations
Get all reservations. Optionally filter by userId with query parameter: `?userId=user1`

**Response:**
```json
[
  {
    "id": 1,
    "userId": "user1",
    "concertId": 1,
    "status": "reserve",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Status Values:**
- `"reserve"` - Active reservation
- `"cancel"` - Cancelled reservation (soft delete)

#### POST /reservations
Create a new reservation.

**Request Body:**
```json
{
  "userId": "user1",
  "concertId": 1
}
```

**Validation:**
- `userId`: Required, string
- `concertId`: Required, integer

**Business Rules:**
- User can only reserve 1 seat per concert (with status 'reserve')
- Cannot reserve if concert is sold out (all seats are reserved with status 'reserve')
- Cannot reserve if user already has an active reservation (status 'reserve') for that concert
- When a reservation is cancelled, its status changes to 'cancel' (soft delete)

#### DELETE /reservations/cancel
Cancel a reservation. This changes the reservation status to 'cancel' instead of deleting it.

**Request Body:**
```json
{
  "userId": "user1",
  "reservationId": 1
}
```

**Response:**
```json
{
  "message": "Reservation cancelled successfully"
}
```

**Behavior:**
- Changes reservation status from 'reserve' to 'cancel'
- Updates the `updatedAt` timestamp
- Reservation record is preserved for history tracking

### Error Responses

All errors follow this format:
```json
{
  "statusCode": 400,
  "message": "Error message",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/endpoint"
}
```

Common status codes:
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate reservation)
- `500` - Internal Server Error

## 🧪 Running Tests

### Backend Tests

Navigate to the backend directory and run:

```bash
cd backend
npm test
```

To run tests in watch mode:
```bash
npm run test:watch
```

To run tests with coverage:
```bash
npm run test:cov
```

### Test Coverage

The backend includes comprehensive unit tests for:
- `ConcertService`: Create, read, delete operations
- `ReservationService`: 
  - Create reservations with status 'reserve'
  - Cancel reservations (changes status to 'cancel')
  - Business rule validation (one reservation per user per concert, seat availability)
  - Status-based filtering for seat counts

Test files:
- `backend/src/concert/concert.service.spec.ts`
- `backend/src/reservation/reservation.service.spec.ts`

All tests pass and cover:
- Basic CRUD operations
- Business logic validation
- Error handling (404, 400, 409 status codes)
- Reservation status management

## 📦 Libraries and Packages

### Backend Dependencies

- **@nestjs/common** - Core NestJS decorators and utilities
- **@nestjs/core** - NestJS framework core
- **@nestjs/platform-express** - Express platform adapter
- **class-validator** - Validation decorators for DTOs
- **class-transformer** - Object transformation utilities
- **reflect-metadata** - Metadata reflection for decorators
- **rxjs** - Reactive programming library

### Backend Dev Dependencies

- **@nestjs/cli** - NestJS CLI tools
- **@nestjs/testing** - Testing utilities
- **jest** - JavaScript testing framework
- **ts-jest** - TypeScript preprocessor for Jest
- **typescript** - TypeScript compiler

### Frontend Dependencies

- **next** - Next.js framework
- **react** - React library
- **react-dom** - React DOM renderer

### Frontend Dev Dependencies

- **@tailwindcss/postcss** - Tailwind CSS PostCSS plugin
- **tailwindcss** - Utility-first CSS framework
- **typescript** - TypeScript compiler

## 🚀 Bonus: Performance Optimization

### Current Architecture Considerations

The current implementation uses in-memory storage, which is suitable for development but not for production. Here are optimization strategies for handling intensive data and high traffic:

### 1. Database Optimization

**Recommendation**: Replace in-memory storage with a proper database (PostgreSQL, MySQL, or MongoDB).

**Implementation**:
- Use connection pooling
- Implement database indexing on frequently queried fields (concertId, userId)
- Use database-level constraints (unique constraints for user-concert pairs)
- Consider read replicas for read-heavy operations

### 2. Caching Strategy

**Redis/Memcached**:
- Cache concert listings (with TTL)
- Cache reservation counts per concert
- Cache user reservations
- Invalidate cache on create/update/delete operations

### 3. API Optimization

**Pagination**:
- Implement pagination for concert listings and reservations
- Use cursor-based pagination for better performance

**Data Aggregation**:
- Pre-calculate reservation counts at the database level
- Use database views or materialized views for complex queries

### 4. Frontend Optimization

**Next.js Features**:
- Use Server-Side Rendering (SSR) or Static Site Generation (SSG) for concert listings
- Implement Incremental Static Regeneration (ISR) for frequently accessed pages
- Use React Server Components where appropriate

**Code Splitting**:
- Lazy load admin dashboard (not needed for regular users)
- Implement route-based code splitting

**Caching**:
- Use SWR or React Query for client-side data caching
- Implement optimistic updates for better UX

### 5. Infrastructure

**Load Balancing**:
- Use multiple backend instances behind a load balancer
- Implement session affinity if using session-based auth

**CDN**:
- Serve static assets through a CDN
- Cache API responses at CDN level where appropriate

**Database Sharding**:
- For extremely large datasets, consider sharding by concert ID or user ID

## 🎫 Bonus: Concurrent Reservation Handling

To ensure that no one needs to stand up during the show (no overbooking), we need to handle concurrent reservation requests properly. Here's the strategy:

### Problem Statement
When multiple users try to reserve the last available seat simultaneously, we need to ensure:
1. Only one reservation succeeds
2. No overbooking occurs
3. Fair allocation (first-come-first-served or queue-based)

### Solutions

### 1. Database-Level Locking (Recommended)

**Pessimistic Locking**:
```typescript
// Using database transactions with row-level locks
@Transaction()
async createReservation(dto: CreateReservationDto) {
  // Lock the concert row for update
  const concert = await this.concertRepository.findOne({
    where: { id: dto.concertId },
    lock: { mode: 'pessimistic_write' }
  });
  
  // Check availability and create reservation
  // The lock ensures only one transaction can proceed at a time
}
```

**Optimistic Locking**:
```typescript
// Add version field to Concert entity
// Use version field to detect concurrent modifications
```

### 2. Application-Level Locking

**Distributed Lock (Redis)**:
```typescript
async createReservation(dto: CreateReservationDto) {
  const lockKey = `concert:${dto.concertId}:reserve`;
  const lock = await this.redisService.acquireLock(lockKey, 5000); // 5 second timeout
  
  try {
    // Check availability and create reservation
  } finally {
    await this.redisService.releaseLock(lock);
  }
}
```

### 3. Database Constraints

**Unique Constraint**:
```sql
-- Ensure one reservation per user per concert
ALTER TABLE reservations 
ADD CONSTRAINT unique_user_concert 
UNIQUE (userId, concertId);
```

**Check Constraint**:
```sql
-- Ensure reservation count doesn't exceed seats
-- Implemented at application level with transactions
```

### 4. Queue-Based System

**Message Queue (RabbitMQ/Redis Queue)**:
- Place reservation requests in a queue
- Process sequentially to avoid race conditions
- Notify users when reservation is confirmed
- Handle timeout for stale requests

### 5. Recommended Implementation

For this application, I recommend:

1. **Database Transactions** with **Row-Level Locks**:
   - Use database transactions with `SELECT FOR UPDATE`
   - Atomic reservation creation
   - Rollback on errors

2. **Distributed Lock** (for distributed systems):
   - Use Redis for distributed locks
   - Prevent concurrent reservations for the same concert
   - Set reasonable timeout to prevent deadlocks

3. **Retry Logic** (Client-side):
   - If reservation fails due to concurrent conflict, retry with exponential backoff
   - Show appropriate error message to user

4. **Real-time Updates**:
   - Use WebSockets or Server-Sent Events to update seat availability in real-time
   - Prevent users from attempting to reserve already-taken seats

### Example Implementation (with TypeORM)

```typescript
@Injectable()
export class ReservationService {
  async createReservation(dto: CreateReservationDto) {
    return await this.dataSource.transaction(async (manager) => {
      // Lock the concert row
      const concert = await manager.findOne(Concert, {
        where: { id: dto.concertId },
        lock: { mode: 'pessimistic_write' }
      });

      if (!concert) {
        throw new NotFoundException('Concert not found');
      }

      // Count existing reservations (within transaction)
      const count = await manager.count(Reservation, {
        where: { concertId: dto.concertId }
      });

      if (count >= concert.seat) {
        throw new BadRequestException('No seats available');
      }

      // Check for existing user reservation
      const existing = await manager.findOne(Reservation, {
        where: { userId: dto.userId, concertId: dto.concertId }
      });

      if (existing) {
        throw new ConflictException('User already has a reservation');
      }

      // Create reservation
      const reservation = manager.create(Reservation, dto);
      return await manager.save(reservation);
    });
  }
}
```

### Monitoring and Alerts

- Monitor failed reservation attempts due to concurrency
- Alert if reservation failure rate is high
- Track reservation processing time
- Monitor database lock wait times

## 📝 Notes

- **Storage**: The application currently uses in-memory storage for simplicity. In production, replace with a persistent database (PostgreSQL, MongoDB, etc.).
- **Authentication**: User authentication is simplified (hardcoded userId: 'test user' for user mode, localStorage for mode switching). In production, implement proper authentication (JWT, OAuth, etc.).
- **Reservation Status**: Reservations use a status field ('reserve' or 'cancel') instead of hard deletion. This allows for history tracking and analytics.
- **Ports**: 
  - Frontend port (3001) can be changed in `frontend/package.json`
  - Backend port (3000) can be changed via `PORT` environment variable or in `main.ts`
- **Mode Switching**: Users can switch between admin and user mode via the sidebar. Mode preference is stored in localStorage.
- **History Page**: The history page (`/history`) is accessible to admin users and displays all reservations with status information in a table format.

## 👤 Author

Created as part of a full-stack developer assessment.

## 📄 License

This project is for assessment purposes.
