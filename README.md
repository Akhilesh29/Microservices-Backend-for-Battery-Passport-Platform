# Battery Passport Microservices

This repository contains a simplified microservices-based backend system for a digital battery passport platform. The stack includes Node.js, Express, MongoDB, Kafka, JWT authentication, and MinIO as an S3-compatible object store.

## Services

- `auth-service`: user registration, login, JWT issuance, and internal token verification
- `data-access-service`: CRUD for battery passports with role-based access and Kafka event publishing
- `document-service`: file upload, metadata management, and signed download links via MinIO
- `notification-service`: Kafka consumer that logs notification messages to text files

## Run

1. Copy `.env.example` to `.env`
2. Start everything with:

```bash
docker compose up --build
```

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

