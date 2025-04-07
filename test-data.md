# Package Week System API Testing Guide

This guide will help you test the package week system APIs. The system consists of three main components: PeriodPackage, DayPackage, and PackageWeek.

## Test Data

The test data is available in `test-data.json`. Make sure to use the JSON values according to the endpoint you're testing.

## Testing Steps

Below are the steps to test each API endpoint. Use tools like Postman, curl, or any API testing tool you prefer.

### 1. Consultation Package (Pre-requisite)

First, create a consultation package (required for period packages):

```
POST /api/v1/consultation-package
Content-Type: application/json

{
  "name": "Premium Health Check",
  "description": "Comprehensive health check with specialist consultations",
  "price": 500000,
  "duration": 120
}
```

Save the returned ID as `consultationPackageId` for the next steps.

### 2. Period Package

#### Create a Period Package:

```
POST /api/v1/period-package
Content-Type: application/json

{
  "startTime": "2023-12-01T08:00:00.000Z",
  "endTime": "2023-12-01T10:00:00.000Z",
  "booked": 0,
  "pkg": "consultationPackageId"
}
```

Save the returned ID as `periodPackageId`.

#### Get Period Package:

```
GET /api/v1/period-package/periodPackageId
```

#### Update Period Package:

```
PUT /api/v1/period-package/periodPackageId
Content-Type: application/json

{
  "startTime": "2023-12-01T09:00:00.000Z",
  "endTime": "2023-12-01T11:00:00.000Z"
}
```

#### Increment Booked Count:

```
PATCH /api/v1/period-package/periodPackageId/increment-booked
```

### 3. Day Package

#### Create a Day Package:

```
POST /api/v1/day-package
Content-Type: application/json

{
  "day_pkg_id": "DAY20231201",
  "period_pkgs": []
}
```

Save the returned ID as `dayPackageId`.

#### Get Day Package:

```
GET /api/v1/day-package/dayPackageId
```

#### Get Day Package by day_pkg_id:

```
GET /api/v1/day-package/day-pkg/DAY20231201
```

#### Update Day Package:

```
PUT /api/v1/day-package/dayPackageId
Content-Type: application/json

{
  "day_pkg_id": "DAY20231201-UPDATED"
}
```

#### Add Period Package to Day Package:

```
PATCH /api/v1/day-package/dayPackageId/add-period-package/periodPackageId
```

### 4. Package Week

#### Create a Package Week:

```
POST /api/v1/package-week
Content-Type: application/json

{
  "startDate": "2023-12-01",
  "endDate": "2023-12-07",
  "packageDays": []
}
```

Save the returned ID as `packageWeekId`.

#### Get Package Week:

```
GET /api/v1/package-week/packageWeekId
```

#### Get Package Week with Full Details:

```
GET /api/v1/package-week/packageWeekId/details
```

#### Find Package Weeks by Date Range:

```
GET /api/v1/package-week/date-range?startDate=2023-12-01&endDate=2023-12-31
```

#### Update Package Week:

```
PUT /api/v1/package-week/packageWeekId
Content-Type: application/json

{
  "startDate": "2023-12-02",
  "endDate": "2023-12-08"
}
```

#### Add Day Package to Package Week:

```
PATCH /api/v1/package-week/packageWeekId/add-day-package/dayPackageId
```

## Testing Flow

For a complete test flow, follow these steps in order:

1. Create a consultation package
2. Create a period package with the consultation package ID
3. Create a day package
4. Add the period package to the day package
5. Create a package week
6. Add the day package to the package week
7. Test the various GET endpoints to verify relationships
8. Test the update endpoints
9. Test the increment-booked endpoint for period packages

This will ensure that all relationships between the entities are properly established and maintained. 