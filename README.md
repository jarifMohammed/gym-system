# Gym Class Scheduling and Membership Management System

## Project Overview

A comprehensive gym management system that handles class scheduling, trainer assignments, and member bookings. The system implements role-based access control with three distinct roles: Admin, Trainer, and Trainee, each with specific permissions and responsibilities.

## Technology Stack

- **Programming Language**: TypeScript
- **Web Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Render

## Database Schema

### User Model

```typescript
{
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/
  },
  password: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ["male", "female", "other"] },
  phone: String,
  address: String,
  role: {
    type: String,
    enum: ["trainer", "trainee", "admin"],
    default: "trainee"
  }
}
```

### Schedule Model

```typescript
{
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  maxTrainees: { type: Number, default: 10 },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  trainees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user

### Admin Routes

- `POST /api/v1/admin/schedule` - Create a new schedule
- `PUT /api/v1/admin/schedule/:scheduleId/assign-trainer` - Assign trainer to a schedule

### Trainer Routes

- `GET /api/v1/trainer/my-schedules` - Get trainer's schedules

### Trainee Routes

- `POST /api/v1/trainee/schedule/:scheduleId/book` - Book a schedule
- `GET /api/v1/trainee/profile` - Get trainee profile
- `PUT /api/v1/trainee/profile` - Update trainee profile
- `DELETE /api/v1/trainee/schedule/:scheduleId/cancel` - Cancel a booking


## Live Hosting

The application is deployed on Render:

- Base URL: `https://gym-system-2.onrender.com`

## Admin Credentials

- Email: admin@gmail.com
- Password: admin

## Local Development Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd gym-system
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```
PORT=5000
DB_URL=your_mongodb_uri
token=your_jwt_secret
```

4. Start the development server:

```bash
npm run dev
```

## Testing Instructions

1. Register a new user:

```bash
curl -X POST https://gym-system-2.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Test User", "email": "test@example.com", "password": "password123", "role": "trainee"}'
```

2. Login:

```bash
curl -X POST https://gym-system-2.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

3. Use the received token to access protected endpoints:

```bash
curl -X GET https://gym-system-2.onrender.com/api/v1/trainee/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

## Project Structure

```
src/
├── config/         # Configuration files
├── middleware/     # Custom middleware
├── modules/        # Feature modules
│   ├── admin/     # Admin related functionality
│   ├── auth/      # Authentication
│   ├── trainer/   # Trainer related functionality
│   └── trainee/   # Trainee related functionality
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```


