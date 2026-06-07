# Drivefleet — Fleet Management & Booking System

A decoupled, high-performance vehicle reservation application engineered to split user interactions from heavy backend data processing.

---

## System Architecture

The project operates across two completely independent server environments:

- **Frontend (Port 3000):** Built with Next.js App Router. It serves the user interface, vehicle detail galleries, and manages user identities using **Better-Auth** via a custom universal catch-all route proxy (`[...all]`).
- **Backend (Port 5000):** A standalone Express.js REST API. It handles core business logic, fleet asset tracking, database persistence, and protects sensitive booking dispatch actions.

---

## Security & Handshake Pipeline

Drivefleet relies on a **stateless asymmetric authorization** model to communicate securely across servers without sharing a database or static environment strings:

1. **Token Generation:** When a user logs in, the frontend Better-Auth engine issues a cryptographically signed **JSON Web Token (JWT)** using RS256 encryption.
2. **Request Dispatch:** When a vehicle booking is submitted, the frontend extracts this token and mounts it securely into the `Authorization: Bearer` request header sent to the backend.
3. **Automated Discovery (JWKS):** The Express backend intercepts the token and uses `jose-cjs` to reach back to the frontend's public key-set directory (`/api/auth/jwks`).
4. **Instant Verification:** The backend downloads the runtime public signature keys, confirms the token's validity, and approves the booking—eliminating the risk of shared secret leaks.

---

## Core Project Features

- **Decoupled Scalability:** Keeps high-traffic vehicle browsing completely separate from transactional database operations.
- **Zero-Secret Authorization:** Elevates ecosystem security by using live public cryptography validation instead of matching copy-pasted string secrets.
- **Lightweight Backend States:** The Express server handles no cookies, session histories, or user management states, validating incoming operations purely on self-contained tokens.
- **UI Loading Safeguards:** Implements interactive loading indicators and element locks to guarantee synchronization and stop accidental duplicate reservations.
