```markdown
# Drivefleet — Full-Stack Authentication & Fleet Booking System

A robust, enterprise-grade fleet management and booking application built with a decoupled architecture. This repository contains the configuration for a Next.js App Router frontend integrated with **Better-Auth** using a custom universal catch-all route, which securely handshakes with a standalone Node.js/Express backend via cryptographic JSON Web Tokens (JWT) and JSON Web Key Sets (JWKS).

---

## Architecture Overview
```

┌────────────────────────────────────────┐ ┌───────────────────────────────┐
│ Next.js Frontend (Port 3000) │ │ Express Backend (Port 5000) │
├────────────────────────────────────────┤ ├───────────────────────────────┤
│ /app/api/auth/[...all]/route.ts │ │ /api/bookings (Protected) │
│ Enforces Better-Auth dynamic endpoints│ │ │
│ │ │ Verification Layer: │
│ Generates RS256 Signed JWTs │ │ Uses `jose-cjs` to remotely │
│ Exposes public JWKS signature keys │────────>│ fetch keys from Next.js JWKS │
│ at: /api/auth/jwks │ (Http) │ endpoint to clear handshakes │
└────────────────────────────────────────┘ └───────────────────────────────┘

````

### Key Workflow Details
1. **Dynamic Route Mapping:** Bypasses rigid folder structure constraints via an optimized `/api/auth/[...all]` wild-card proxy on the frontend.
2. **Decoupled Stateless Authorization:** Frontend users securely authorize actions on the backend server (`localhost:5000`) using cryptographically signed asymmetric header payloads.
3. **Automated Public Key Discovery:** The Express backend relies on JWKS remote signature tracking via `jose-cjs`. This removes the requirement to manually share or synchronize raw string secrets across environments, instantly eliminating protocol mismatches and signature verification errors.

---

## Project Structure & File Layout

```text
📁 drive-fleet-root
│
├── 📁 drive-fleet-client (Next.js Frontend)
│   ├── 📁 src
│   │   ├── 📁 app
│   │   │   └── 📁 api
│   │   │       └── 📁 auth
│   │   │           └── 📁 [...all]
│   │   │               └── 📄 route.ts        # Custom catch-all route handler
│   │   └── 📁 lib
│   │       ├── 📄 auth.js                     # Core Better-Auth Server Config
│   │       └── 📄 auth-client.ts              # Instantiated client with JWT plugins
│   └── 📄 .env.local                          # Frontend environment parameters
│
└── 📁 drive-fleet-backend (Express.js API)
    ├── 📄 middleware/authMiddleware.js        # jose-cjs asymmetric validation layer
    ├── 📄 server.js                           # Express entry point
    └── 📄 .env                                # Backend environment parameters

````

---

## 1. Frontend Server Configuration (`src/lib/auth.js`)

Configures the core server-side library parameters to enforce sub-root resolution over dynamic arrays and registers the core JWT signing plugin.

```javascript
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins/jwt";

export const auth = betterAuth({
  database: mongodbAdapter(client, {
    databaseName: "drivefleet",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: "http://localhost:3000",

  advanced: {
    // Crucial mapping flag for custom catch-all directories like [...all]
    useSubRootPath: true,
  },

  plugins: [
    jwt(), // Automatically handles JWKS compilation and RS256 token issuance
  ],
});
```

---

## 2. Frontend Catch-All Route (`src/app/api/auth/[...all]/route.ts`)

Proxies all incoming social login, callback, and token discovery requests directly into the Better-Auth runtime framework core.

```typescript
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  return auth.handler(request);
};

export const POST = async (request: NextRequest) => {
  return auth.handler(request);
};
```

---

## 3. Frontend Client-Side Instance (`src/lib/auth-client.ts`)

Initializes standard React hooks and registers the Client-side JWT processing plug-in layer to manage token state.

```javascript
import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    jwtClient(), // Enables client memory mapping of token headers
  ],
});
```

---

## 4. Frontend Booking Component Function (`BookingActionButton.jsx`)

Extracts the raw, cryptographically signed JWT string from Better-Auth's session response headers and forwards it securely via the `Authorization` header to your Express API.

```javascript
const onSubmit = async (e) => {
  e.preventDefault();

  if (!session) {
    toast.error("Please login to access your booking deck");
    router.push("/login");
    return;
  }

  if (submitButtonRef.current) {
    submitButtonRef.current.disabled = true;
    submitButtonRef.current.innerText = "Processing Dispatch Reservation...";
  }

  const formData = new FormData(e.currentTarget);
  const formPayload = Object.fromEntries(formData.entries());

  const bookingPayload = {
    driverNeeded: formPayload.driverNeeded,
    specialNote: formPayload.specialNote,
    carId: carId,
    carName: carName,
    carType: carType,
    dailyPrice: dailyPrice,
    userEmail: session.user?.email,
    userName: session.user?.name,
    Date: new Date().toISOString(),
  };

  try {
    let jwtToken = "";

    // Fetch session while trapping the set-auth-jwt response header containing the encrypted JWT string
    await authClient.getSession({
      fetchOptions: {
        onSuccess: (ctx) => {
          jwtToken = ctx.response.headers.get("set-auth-jwt");
        },
      },
    });

    // Alternate fallback mechanism: checking local client-side memory states
    if (!jwtToken) {
      const sessionContext = await authClient.getSession();
      jwtToken =
        sessionContext?.data?.token || sessionContext?.data?.session?.token;
    }

    console.log("Token sent to Backend:", jwtToken);

    const response = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken || ""}`,
      },
      body: JSON.stringify(bookingPayload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      toast.error(result.error || "Failed to submit booking");
      if (submitButtonRef.current) {
        submitButtonRef.current.disabled = false;
        submitButtonRef.current.innerText = "Confirm Fleet Booking";
      }
      return;
    }

    toast.success("Drivefleet booking created successfully!");
    e.target.reset();
    closeModal();
    router.push("/myBookings");
  } catch (err) {
    console.error("Backend dispatch error:", err);
    toast.error("Booking verification failed.");
    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = false;
      submitButtonRef.current.innerText = "Confirm Fleet Booking";
    }
  }
};
```

---

## 5. Express Backend Verification Middleware (`middleware/authMiddleware.js`)

Leverages CommonJS `jose-cjs` primitives to safely fetch the active cryptographic public verification vectors directly from your local HTTP Next.js server (`http://localhost:3000`).

```javascript
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");

// Point explicitly to HTTP port 3000 where Better-Auth hosts its public verification keys
const JWKS = createRemoteJWKSet(new URL("http://localhost:3000/api/auth/jwks"));

const verifyToken = async (req, res, next) => {
  const authHeader = req?.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Unauthorized: No token provided in the Authorization header.",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: Token missing from the Authorization header.",
    });
  }

  try {
    // Decrypt and process using discovered signature bounds from the Next.js app
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: "http://localhost:3000",
    });

    // Append successfully decrypted user identity context to request pipeline
    req.user = payload;
    next();
  } catch (error) {
    console.error("JWT Validation Failed on Backend:", error.message);

    return res.status(401).json({
      message: "Unauthorized: Invalid token.",
      error: error.message,
    });
  }
};

module.exports = verifyToken;
```

---

## Environment Variable Architecture

### Frontend Configuration (`.env.local`)

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your_secure_random_hash_string"
MONGODB_URI="mongodb+srv://..."

```

### Backend Configuration (`.env`)

```env
PORT=5000

```

---

## Troubleshooting Cache & Rebuild Matrix

When modifying catch-all structural layout keys (`[...all]`) or updating global authentication plug-in configurations, Next.js caches compiler outputs aggressively. Wiping compiled states is required to flush dead route pointers:

```bash
# 1. Kill operational dev instances in your terminal (Ctrl + C)

# 2. Hard purge internal Next compiler cache directories
rmdir /s /q .next

# 3. Boot dev environments fresh
npm run dev

```

```

```
