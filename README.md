<div align="center">

  <h1>🏨 HOTEL RESERVATION API</h1>
  <p><b>Production-Grade RESTful Micro-Engine Built for High Concurrency & Data Integrity</b></p>

  

</div>

---

### 📐 REQUEST & AUTHENTICATION LIFECYCLE

```mermaid
sequenceDiagram
    autonumber
    actor Client as Postman / Client
    participant Router as Express Router
    participant Val as Zod Middleware
    participant Auth as Auth / bcrypt
    participant DB as PostgreSQL (pg.Pool)
    participant Err as Global Error Handler

    Client->>Router: POST /api/v1/auth/login
    Router->>Val: Validate Payload (Email / Password)
    alt Payload Invalid
        Val-->>Err: Trigger Schema ValidationError
        Err-->>Client: 400 Bad Request (Formatted JSON)
    else Payload Valid
        Val->>Auth: Pass to Auth Controller
        Auth->>DB: Parameterized Query ($1 = email)
        DB-->>Auth: User Record
        Auth->>Auth: Verify bcrypt.compare()
        alt Invalid Credentials
            Auth-->>Err: Throw AuthError
            Err-->>Client: 401 Unauthorized
        else Authenticated
            Auth-->>Client: 200 OK + JWT Stateless Token
        end
    end
```
# 1. Clone the repository
git clone https://github.com/your-username/hotel-reservation-api.git
cd hotel-reservation-api

# 2. Install dependencies
npm install

# 3. Configure environment variables (.env)
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/hotel_db
JWT_SECRET=your_super_secret_production_key

# 4. Start development server
npm run dev
