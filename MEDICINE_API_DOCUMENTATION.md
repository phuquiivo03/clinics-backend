# Medicine API Documentation

## Overview

The Medicine API provides endpoints to manage medicines in the clinic system. Each medicine represents a pharmaceutical product with specific properties like dosage, form, and administration route.

## Base URL

```
/api/v1/medicines
```

## Authentication

All endpoints require authentication. Include the `Authorization` header with a valid JWT token:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Get All Medicines

**GET** `/api/v1/medicines`

Retrieves a paginated list of all medicines with optional filtering and sorting.

#### Query Parameters

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `name` (optional): Filter by medicine name (case-insensitive search)
- `dosage` (optional): Filter by dosage (case-insensitive search)
- `form` (optional): Filter by form (case-insensitive search)
- `route` (optional): Filter by administration route (case-insensitive search)
- `options` (optional): JSON string with advanced filtering options

#### Advanced Options Format

You can also pass a JSON string in the `options` query parameter for more complex filtering:

```json
{
  "filter": {
    "name": { "$regex": "paracetamol", "$options": "i" },
    "form": { "$regex": "tablet", "$options": "i" }
  },
  "pagination": {
    "page": 2,
    "limit": 25
  },
  "sort": { "name": 1 }
}
```

#### Response

```json
{
  "data": [
    {
      "_id": "medicine_id",
      "name": "Paracetamol",
      "dosage": "500mg",
      "form": "Viên nén",
      "route": "Uống",
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

### 2. Get Medicine by ID

**GET** `/api/v1/medicines/:id`

Retrieves a specific medicine by its ID.

#### Path Parameters

- `id`: Medicine ID

#### Response

```json
{
  "_id": "medicine_id",
  "name": "Paracetamol",
  "dosage": "500mg",
  "form": "Viên nén",
  "route": "Uống",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 3. Create Medicine

**POST** `/api/v1/medicines`

Creates a new medicine.

#### Request Body

```json
{
  "name": "Paracetamol",
  "dosage": "500mg",
  "form": "Viên nén",
  "route": "Uống"
}
```

#### Response

Returns the created medicine with status 201.

### 4. Update Medicine

**PUT** `/api/v1/medicines/:id`

Updates an existing medicine.

#### Path Parameters

- `id`: Medicine ID

#### Request Body

```json
{
  "dosage": "1000mg",
  "form": "Viên nén bao phim"
}
```

All fields are optional. Only provided fields will be updated.

#### Response

Returns the updated medicine.

### 5. Delete Medicine

**DELETE** `/api/v1/medicines/:id`

Deletes a medicine.

#### Path Parameters

- `id`: Medicine ID

#### Response

```json
{
  "message": "Medicine deleted successfully"
}
```

## Data Model

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
  "message": "Medicine not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Server Error"
}
```

## Example Usage

### Get all medicines with pagination

```bash
curl -X GET "http://localhost:3000/api/v1/medicines?page=1&limit=20" \
  -H "Authorization: Bearer your-jwt-token"
```

### Search medicines by name

```bash
curl -X GET "http://localhost:3000/api/v1/medicines?name=paracetamol" \
  -H "Authorization: Bearer your-jwt-token"
```

### Create a new medicine

```bash
curl -X POST "http://localhost:3000/api/v1/medicines" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ibuprofen",
    "dosage": "400mg",
    "form": "Viên nén",
    "route": "Uống"
  }'
```

### Update medicine dosage

```bash
curl -X PUT "http://localhost:3000/api/v1/medicines/medicine_id_here" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "dosage": "600mg"
  }'
```

## Notes

1. **Authentication Required**: All endpoints require a valid JWT token in the Authorization header.
2. **Search Functionality**: The API supports case-insensitive text search across name, dosage, form, and route fields.
3. **Pagination**: The API supports pagination with configurable page size and page numbers.
4. **Filtering**: Advanced filtering is available through the options parameter or individual query parameters.
5. **Validation**: All input data is validated using Zod schemas before processing.
6. **Relationship**: Medicines are referenced by medications, so deleting a medicine may affect existing medication records.
