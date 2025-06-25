# Clinics Backend API Routes Documentation

This document provides a comprehensive overview of all available API routes in the clinics backend system.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication using Bearer tokens:

```
Authorization: Bearer <token>
```

## Route Categories

### 🏥 Health Check

| Method | Endpoint  | Description         | Auth Required |
| ------ | --------- | ------------------- | ------------- |
| GET    | `/health` | Check server status | No            |

### 🔐 Authentication

| Method | Endpoint                   | Description          | Auth Required |
| ------ | -------------------------- | -------------------- | ------------- |
| POST   | `/v1/auth/register`        | Register new user    | No            |
| POST   | `/v1/auth/verify-otp`      | Verify OTP           | No            |
| POST   | `/v1/auth/login`           | User login           | No            |
| POST   | `/v1/auth/refresh-token`   | Refresh access token | No            |
| POST   | `/v1/auth/logout`          | User logout          | Yes           |
| POST   | `/v1/auth/change-password` | Change password      | Yes           |

### 👤 User Management

| Method | Endpoint           | Description         | Auth Required | File Upload  |
| ------ | ------------------ | ------------------- | ------------- | ------------ |
| POST   | `/v1/user`         | Create user         | No            | No           |
| GET    | `/v1/user/profile` | Get user profile    | Yes           | No           |
| PATCH  | `/v1/user`         | Update user profile | Yes           | Yes (avatar) |

### 👨‍⚕️ Doctor Management

| Method | Endpoint                                    | Description                   | Auth Required | Role Required |
| ------ | ------------------------------------------- | ----------------------------- | ------------- | ------------- |
| GET    | `/v1/doctor`                                | Get all doctors               | No            | -             |
| GET    | `/v1/doctor/specialization/:specialization` | Get doctors by specialization | No            | -             |
| POST   | `/v1/doctor`                                | Create doctor profile         | Yes           | Admin         |

### 🩺 Consultation Services

| Method | Endpoint                                                  | Description                    | Auth Required | Role Required | Pagination |
| ------ | --------------------------------------------------------- | ------------------------------ | ------------- | ------------- | ---------- |
| GET    | `/v1/consultation-service`                                | Get all services               | No            | -             | No         |
| GET    | `/v1/consultation-service/many`                           | Get services with pagination   | No            | -             | Yes        |
| GET    | `/v1/consultation-service/:id`                            | Get service by ID              | No            | -             | No         |
| GET    | `/v1/consultation-service/specialization/:specialization` | Get services by specialization | No            | -             | No         |
| POST   | `/v1/consultation-service`                                | Create service                 | Yes           | Admin/Doctor  | No         |
| POST   | `/v1/consultation-service/createMany`                     | Create multiple services       | Yes           | Admin/Doctor  | No         |
| PUT    | `/v1/consultation-service/many`                           | Update multiple services       | Yes           | Admin/Doctor  | No         |

### 📦 Consultation Packages

| Method | Endpoint                               | Description                   | Auth Required | Role Required | Pagination |
| ------ | -------------------------------------- | ----------------------------- | ------------- | ------------- | ---------- |
| GET    | `/v1/consultation-package`             | Get all packages              | No            | -             | No         |
| GET    | `/v1/consultation-package/many`        | Get packages with pagination  | No            | -             | Yes        |
| GET    | `/v1/consultation-package/:id`         | Get package by ID             | No            | -             | No         |
| GET    | `/v1/consultation-package/:id/details` | Get package with full details | No            | -             | No         |
| POST   | `/v1/consultation-package`             | Create package                | Yes           | Admin/Doctor  | No         |
| POST   | `/v1/consultation-package/many`        | Create multiple packages      | Yes           | Admin/Doctor  | No         |
| PATCH  | `/v1/consultation-package/many`        | Update multiple packages      | Yes           | Admin/Doctor  | No         |

### 🏢 Room Management

| Method | Endpoint              | Description           | Auth Required | Role Required |
| ------ | --------------------- | --------------------- | ------------- | ------------- |
| GET    | `/v1/room`            | Get all rooms         | No            | -             |
| GET    | `/v1/room/:id`        | Get room by ID        | No            | -             |
| POST   | `/v1/room`            | Create room           | Yes           | Admin         |
| POST   | `/v1/room/createMany` | Create multiple rooms | Yes           | Admin         |
| PUT    | `/v1/room/:id`        | Update room           | Yes           | Admin         |
| DELETE | `/v1/room/:id`        | Delete room           | Yes           | Admin         |

### 📅 Schedule Management

| Method | Endpoint                         | Description                     | Auth Required | Role Required      |
| ------ | -------------------------------- | ------------------------------- | ------------- | ------------------ |
| GET    | `/v1/schedule/many`              | Get all schedules               | Yes           | Admin/Doctor       |
| GET    | `/v1/schedule/user`              | Get user schedules              | Yes           | -                  |
| GET    | `/v1/schedule/current-week`      | Get current week schedules      | Yes           | -                  |
| GET    | `/v1/schedule/by-specialization` | Get schedules by specialization | Yes           | -                  |
| GET    | `/v1/schedule/:id`               | Get schedule by ID              | Yes           | -                  |
| POST   | `/v1/schedule`                   | Create schedule (booking)       | Yes           | -                  |
| PATCH  | `/v1/schedule/:id`               | Update schedule                 | Yes           | Owner/Admin/Doctor |

### ⏰ Period Package Management

| Method | Endpoint                                  | Description              | Auth Required |
| ------ | ----------------------------------------- | ------------------------ | ------------- |
| GET    | `/v1/period-package/:id`                  | Get period package by ID | No            |
| POST   | `/v1/period-package`                      | Create period package    | No            |
| PUT    | `/v1/period-package/:id`                  | Update period package    | No            |
| PATCH  | `/v1/period-package/:id/increment-booked` | Increment booked count   | No            |

### 📋 Day Package Management

| Method | Endpoint                                                  | Description                       | Auth Required |
| ------ | --------------------------------------------------------- | --------------------------------- | ------------- |
| GET    | `/v1/day-package/:id`                                     | Get day package by ID             | No            |
| GET    | `/v1/day-package/day-pkg/:dayPkgId`                       | Get day package by day package ID | No            |
| POST   | `/v1/day-package`                                         | Create day package                | No            |
| PUT    | `/v1/day-package/:id`                                     | Update day package                | No            |
| PATCH  | `/v1/day-package/:id/add-period-package/:periodPackageId` | Add period package to day package | No            |

### 📊 Package Week Management

| Method | Endpoint                                             | Description                        | Auth Required |
| ------ | ---------------------------------------------------- | ---------------------------------- | ------------- |
| GET    | `/v1/package-week/:id`                               | Get package week by ID             | No            |
| GET    | `/v1/package-week/:id/details`                       | Get package week with full details | No            |
| GET    | `/v1/package-week/date-range/:startDate/:endDate`    | Get package weeks by date range    | No            |
| POST   | `/v1/package-week`                                   | Create package week                | No            |
| PUT    | `/v1/package-week/:id`                               | Update package week                | No            |
| PATCH  | `/v1/package-week/:id/add-day-package/:dayPackageId` | Add day package to week            | No            |

### 📝 Blog Management

| Method | Endpoint              | Description           | Auth Required | Pagination |
| ------ | --------------------- | --------------------- | ------------- | ---------- |
| GET    | `/v1/blog`            | Get all blogs         | No            | No         |
| GET    | `/v1/blog/active`     | Get active blogs      | No            | Yes        |
| GET    | `/v1/blog/:id`        | Get blog by ID        | No            | No         |
| POST   | `/v1/blog`            | Create blog           | Yes           | No         |
| POST   | `/v1/blog/createMany` | Create multiple blogs | Yes           | No         |
| PUT    | `/v1/blog/:id`        | Update blog           | Yes           | No         |
| DELETE | `/v1/blog/:id`        | Delete blog           | Yes           | No         |
| PATCH  | `/v1/blog/:id/toggle` | Toggle blog status    | Yes           | No         |

### 🎯 Promotion Management

| Method | Endpoint                   | Description                | Auth Required |
| ------ | -------------------------- | -------------------------- | ------------- |
| GET    | `/v1/promotion`            | Get all promotions         | No            |
| GET    | `/v1/promotion/active`     | Get active promotions      | No            |
| GET    | `/v1/promotion/:id`        | Get promotion by ID        | No            |
| POST   | `/v1/promotion`            | Create promotion           | Yes           |
| POST   | `/v1/promotion/createMany` | Create multiple promotions | Yes           |
| PUT    | `/v1/promotion/:id`        | Update promotion           | Yes           |
| DELETE | `/v1/promotion/:id`        | Delete promotion           | Yes           |

### 🏷️ Specialty Management

| Method | Endpoint               | Description                 | Auth Required | Role Required |
| ------ | ---------------------- | --------------------------- | ------------- | ------------- |
| GET    | `/v1/specialties`      | Get all specialties         | No            | -             |
| GET    | `/v1/specialties/:id`  | Get specialty by ID         | No            | -             |
| POST   | `/v1/specialties`      | Create specialty            | Yes           | Admin         |
| POST   | `/v1/specialties/many` | Create multiple specialties | Yes           | Admin         |
| PUT    | `/v1/specialties/:id`  | Update specialty            | Yes           | Admin         |
| DELETE | `/v1/specialties/:id`  | Delete specialty            | Yes           | Admin         |

### 🖼️ Image Management

| Method | Endpoint    | Description  | Auth Required | File Upload |
| ------ | ----------- | ------------ | ------------- | ----------- |
| POST   | `/v1/image` | Upload image | Yes           | Yes         |

### 🩺 Appointments (Currently Disabled)

**Note: All appointment routes are currently commented out and not active**

| Method | Endpoint                      | Description               | Status   |
| ------ | ----------------------------- | ------------------------- | -------- |
| GET    | `/v1/appointment/user`        | Get user appointments     | Disabled |
| GET    | `/v1/appointment/doctor`      | Get doctor appointments   | Disabled |
| POST   | `/v1/appointment`             | Create appointment        | Disabled |
| PUT    | `/v1/appointment/:id/status`  | Update appointment status | Disabled |
| PUT    | `/v1/appointment/:id/medical` | Update medical info       | Disabled |
| DELETE | `/v1/appointment/:id`         | Delete appointment        | Disabled |

## Query Parameters

### Pagination

For endpoints that support pagination, use:

```
?page=1&limit=10
```

### Common Filters

- `?search=term` - Search functionality (where available)
- `?status=active` - Filter by status
- `?specialization=cardiology` - Filter by specialization

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {...},
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "code": 400
}
```

## Authentication Flow

1. **Register**: `POST /v1/auth/register`
2. **Verify OTP**: `POST /v1/auth/verify-otp`
3. **Login**: `POST /v1/auth/login`
4. **Use Token**: Include in Authorization header
5. **Refresh**: `POST /v1/auth/refresh-token` when token expires
6. **Logout**: `POST /v1/auth/logout`

## Booking System

The main booking endpoint is:

```
POST /v1/schedule
```

This allows booking:

- Individual consultation services
- Complete consultation packages
- Time slot management with morning/afternoon options

## Notes

- 🔒 Protected routes require authentication
- 👮 Role-based routes require specific user roles (Admin, Doctor)
- 📄 Some endpoints support pagination with `page` and `limit` parameters
- 📁 File upload endpoints accept multipart/form-data
- ⚠️ Appointment system is prepared but currently disabled

## Environment Variables

Ensure these are configured:

- `JWT_SECRET` - JWT signing secret
- `PAGINATION_DEFAULT_PAGE` - Default page number (default: 1)
- `PAGINATION_DEFAULT_LIMIT` - Default items per page (default: 10)
