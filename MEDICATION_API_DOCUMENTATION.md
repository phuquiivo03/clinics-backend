# Medication API Documentation

## Overview

The Medication API provides endpoints to manage medications in the clinic system. Each medication is associated with a specific medicine and includes dosage instructions.

## Base URL

```
/api/v1/medications
```

## Authentication

All endpoints require authentication. Include the `Authorization` header with a valid JWT token:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Get All Medications

**GET** `/api/v1/medications`

Retrieves a paginated list of all medications with optional filtering and sorting.

#### Query Parameters

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `medicine` (optional): Filter by medicine ID
- `minQuantity` (optional): Minimum quantity filter
- `maxQuantity` (optional): Maximum quantity filter
- `frequency` (optional): Filter by frequency (case-insensitive search)
- `duration` (optional): Filter by duration (case-insensitive search)
- `options` (optional): JSON string with advanced filtering options

#### Advanced Options Format

You can also pass a JSON string in the `options` query parameter for more complex filtering:

```json
{
  "filter": {
    "quantity": { "$gte": 5, "$lte": 20 },
    "frequency": { "$regex": "daily", "$options": "i" }
  },
  "pagination": {
    "page": 2,
    "limit": 25
  },
  "sort": { "createdAt": -1 }
}
```

#### Response

```json
{
  "data": [
    {
      "_id": "medication_id",
      "medicine": {
        "_id": "medicine_id",
        "name": "Paracetamol",
        "dosage": "500mg",
        "form": "Viên nén",
        "route": "Uống"
      },
      "quantity": 10,
      "frequency": "1 viên x 3 lần/ngày",
      "duration": "5 ngày",
      "instruction": "Sau khi ăn",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### 2. Get Medication by ID

**GET** `/api/v1/medications/:id`

Retrieves a specific medication by its ID.

#### Path Parameters

- `id`: Medication ID

#### Response

```json
{
  "_id": "medication_id",
  "medicine": {
    "_id": "medicine_id",
    "name": "Paracetamol",
    "dosage": "500mg",
    "form": "Viên nén",
    "route": "Uống"
  },
  "quantity": 10,
  "frequency": "1 viên x 3 lần/ngày",
  "duration": "5 ngày",
  "instruction": "Sau khi ăn",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 3. Create Medication

**POST** `/api/v1/medications`

Creates a new medication.

#### Request Body

```json
{
  "medicine": "medicine_id",
  "quantity": 10,
  "frequency": "1 viên x 3 lần/ngày",
  "duration": "5 ngày",
  "instruction": "Sau khi ăn"
}
```

#### Response

Returns the created medication with status 201.

### 4. Update Medication

**PUT** `/api/v1/medications/:id`

Updates an existing medication.

#### Path Parameters

- `id`: Medication ID

#### Request Body

```json
{
  "quantity": 15,
  "frequency": "1 viên x 2 lần/ngày",
  "instruction": "Trước khi ăn"
}
```

All fields are optional. Only provided fields will be updated.

#### Response

Returns the updated medication.

### 5. Delete Medication

**DELETE** `/api/v1/medications/:id`

Deletes a medication.

#### Path Parameters

- `id`: Medication ID

#### Response

```json
{
  "message": "Medication deleted successfully"
}
```

## Data Models

### Medication

```typescript
{
  _id?: ObjectId;
  medicine: ObjectId | Medicine; // Reference to Medicine
  quantity: number;
  frequency: string; // e.g. "1 viên x 3 lần/ngày"
  duration: string; // e.g. "5 ngày"
  instruction?: string; // e.g. "Sau khi ăn"
}
```

### Medicine

```typescript
{
  _id?: ObjectId;
  name: string; // Name of the medicine
  dosage: string; // e.g. "500mg"
  form: string; // e.g. "Viên nén"
  route: string; // e.g. "Uống"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "message": "Validation error details"
}
```

### 401 Unauthorized

```json
{
  "message": "Authentication required"
}
```

### 404 Not Found

```json
{
  "message": "Medication not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Server Error"
}
```

## Example Usage

### Get all medications with pagination

```bash
curl -X GET "http://localhost:3000/api/v1/medications?page=1&limit=20" \
  -H "Authorization: Bearer your-jwt-token"
```

### Get medications with quantity filter

```bash
curl -X GET "http://localhost:3000/api/v1/medications?minQuantity=5&maxQuantity=20" \
  -H "Authorization: Bearer your-jwt-token"
```

### Create a new medication

```bash
curl -X POST "http://localhost:3000/api/v1/medications" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "medicine": "medicine_id_here",
    "quantity": 10,
    "frequency": "1 viên x 3 lần/ngày",
    "duration": "5 ngày",
    "instruction": "Sau khi ăn"
  }'
```

## Notes

1. **Authentication Required**: All endpoints require a valid JWT token in the Authorization header.
2. **Populated Data**: The medicine field is automatically populated with medicine details when retrieving medications.
3. **Pagination**: The API supports pagination with configurable page size and page numbers.
4. **Filtering**: Advanced filtering is available through the options parameter or individual query parameters.
5. **Validation**: All input data is validated using Zod schemas before processing.
