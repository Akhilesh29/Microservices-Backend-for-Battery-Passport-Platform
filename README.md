# Battery Passport Microservices

This repository contains a simplified microservices-based backend system for a digital battery passport platform. The stack includes Node.js, Express, MongoDB, Kafka, JWT authentication, and MinIO as an S3-compatible object store.

## Service Descriptions

- `auth-service`: user registration, login, JWT issuance, and internal token verification
- `data-access-service`: CRUD for battery passports with role-based access and Kafka event publishing
- `document-service`: file upload, metadata management, and signed download links via MinIO
- `notification-service`: Kafka consumer that logs notification messages to text files

## Setup Instructions

### Docker + `.env`

1. Copy `.env.example` to `.env`
2. Review or update the values in `.env`
3. Start everything with:

```bash
docker compose up --build
```

4. Stop everything with:

```bash
docker compose down
```

### Required Environment Variables

The included `.env.example` already contains working defaults for local Docker usage.

- `JWT_SECRET`: secret used to sign and verify JWTs
- `AUTH_PORT`, `PASSPORT_PORT`, `DOCUMENT_PORT`, `NOTIFICATION_PORT`: service ports
- `MONGO_ROOT_USERNAME`, `MONGO_ROOT_PASSWORD`, `MONGO_HOST`, `MONGO_PORT`: MongoDB connection settings
- `AUTH_DB`, `PASSPORT_DB`, `DOCUMENT_DB`: per-service MongoDB database names
- `KAFKA_BROKER`, `KAFKA_CLIENT_ID`, `KAFKA_GROUP_ID`, `KAFKA_TOPIC_PASSPORT_EVENTS`: Kafka settings
- `MINIO_ENDPOINT`, `MINIO_PORT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET`, `MINIO_USE_SSL`: S3-compatible storage settings
- `AUTH_SERVICE_URL`: internal auth verification URL used by other services
- `NOTIFICATION_OUTPUT_DIR`: directory used by the notification service for log files

## Default Ports

- Auth Service: `3001`
- Data Access Service: `3002`
- Document Service: `3003`
- Notification Service: `3004`
- MongoDB: `27017`
- Kafka: `9092`
- MinIO API: `9000`
- MinIO Console: `9001`

## Internal Verification Flow

The data-access and document services validate bearer tokens by calling `POST /api/auth/verify` on the auth service over HTTP using the internal Docker service name.

## API Usage

### Auth Service

Base path: `/api/auth`

#### Register

`POST /api/auth/register`

```json
{
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

#### Login

`POST /api/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

The login response returns a JWT token. Use it as:

```http
Authorization: Bearer <token>
```

### Battery Passport Service

Base path: `/api/passports`

#### Create Passport

`POST /api/passports`

Admin only.

```json
{
  "data": {
    "generalInformation": {
      "batteryIdentifier": "BP-2024-011",
      "batteryModel": {
        "id": "LM3-BAT-2024",
        "modelName": "GMC WZX1"
      },
      "batteryMass": 450,
      "batteryCategory": "EV",
      "batteryStatus": "Original",
      "manufacturingDate": "2024-01-15",
      "manufacturingPlace": "Gigafactory Nevada",
      "warrantyPeriod": "8",
      "manufacturerInformation": {
        "manufacturerName": "Tesla Inc",
        "manufacturerIdentifier": "TESLA-001"
      }
    },
    "materialComposition": {
      "batteryChemistry": "LiFePO4",
      "criticalRawMaterials": [
        "Lithium",
        "Iron"
      ],
      "hazardousSubstances": [
        {
          "substanceName": "Lithium Hexafluorophosphate",
          "chemicalFormula": "LiPF6",
          "casNumber": "21324-40-3"
        }
      ]
    },
    "carbonFootprint": {
      "totalCarbonFootprint": 850,
      "measurementUnit": "kg CO2e",
      "methodology": "Life Cycle Assessment (LCA)"
    }
  }
}
```

#### Get Passport

`GET /api/passports/:id`

Admin and user roles are allowed.

#### Update Passport

`PUT /api/passports/:id`

Admin only. Uses the same request structure as create.

#### Delete Passport

`DELETE /api/passports/:id`

Admin only.

### Document Service

Base path: `/api/documents`

#### Upload File

`POST /api/documents/upload`

Use `multipart/form-data` with a `file` field.

Example response:

```json
{
  "docId": "string",
  "fileName": "battery-report.pdf",
  "createdAt": "2026-04-17T10:00:00.000Z"
}
```

#### Update File Metadata

`PUT /api/documents/:docId`

```json
{
  "metadata": {
    "documentType": "compliance-report",
    "passportId": "661f1b1f7b2f0e0012abcd34"
  }
}
```

#### Delete File

`DELETE /api/documents/:docId`

#### Get Download Link

`GET /api/documents/:docId`

Returns a signed MinIO download URL.

## Kafka Topics And Payload Structure

### Topic

- `passport-events`

### Produced Events

- `passport.created`
- `passport.updated`
- `passport.deleted`

### Event Payload

The data-access service publishes JSON messages in this shape:

```json
{
  "eventType": "passport.created",
  "passportId": "661f1b1f7b2f0e0012abcd34",
  "batteryIdentifier": "BP-2024-011",
  "actor": {
    "id": "661f19d27b2f0e0012abcd12",
    "email": "admin@example.com",
    "role": "admin"
  },
  "occurredAt": "2026-04-17T10:00:00.000Z"
}
```

### Consumer Behavior

The notification service subscribes to `passport-events`, filters `passport.*` events, and writes notification output to text files in the configured logs directory.

## Render Deployment

This repository now includes a [`render.yaml`](./render.yaml) Blueprint for a Render-based deployment path.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Akhilesh29/Microservices-Backend-for-Battery-Passport-Platform)

Important notes:

- Render is a better fit than Vercel for this project because it supports long-running containerized services.
- The Blueprint provisions custom MongoDB, Kafka, and MinIO services plus the four Node services.
- Persistent disks on Render require paid service plans.
- Render Blueprint files do not support variable interpolation, so the application also supports split host and port environment variables for internal service discovery.
