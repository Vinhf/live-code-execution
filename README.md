# Live Code Execution Service

A backend service that supports **live coding sessions**, **autosave**, and **asynchronous code execution** using a **queue-based architecture**.

This project is implemented as a take-home assignment focusing on **backend architecture, async processing, reliability, and scalability trade-offs**.

---

## 1. Tech Stack

- **Backend Framework**: NestJS (Node.js)
- **Database**: sql.js (in-memory SQLite)
- **Queue**: BullMQ + Redis
- **Worker**: NestJS-based background worker
- **Execution Runtime**: Python
- **API Documentation**: Swagger (OpenAPI)
- **Containerization**: Docker & Docker Compose

---

## 2. Setup Instructions (Local Development)

### 2.1 Prerequisites

- Node.js >= 18
- Docker & Docker Compose
- npm or yarn

---

### 2.2 Clone Repository

```bash
git clone <repository-url>
cd live-code-execution
```

### 2.3 Start Infrastructure (Redis)

```bash
docker-compose up -d
```

This will start:

- Redis (used for job queue)

### 2.4 Install Dependencies

```bash
npm install
```

### 2.5 Run Application

```bash
npm run start:dev
```

The server will be available at:

```
http://localhost:3000
```

### 2.6 API Documentation (Swagger)

Swagger UI is available at:

```
http://localhost:3000/api-docs
```

- Only public-facing APIs are exposed in Swagger.
- Debug/internal endpoints are intentionally excluded.

---

## 3. Architecture Overview

### 3.1 High-Level Architecture

```
Client (Postman / Swagger / UI)
        |
        v
   NestJS API Server
        |
        |  (enqueue execution job)
        v
     Redis Queue (BullMQ)
        |
        v
 Background Worker
 (Python code execution)
        |
        v
   sql.js (in-memory DB)
```

---

## 4. End-to-End Request Flow

### 4.1 Code Session Creation

1. Client sends a request to create a new code session
2. Backend creates a CodeSession record
3. A `session_id` is returned immediately

### 4.2 Autosave Behavior

1. Client periodically sends updated source code
2. Backend updates the existing session record
3. Autosave does not trigger execution

### 4.3 Execution Request

1. Client requests code execution
2. Backend:
   - Creates an Execution record with status `QUEUED`
   - Pushes a job to Redis queue
   - Returns `execution_id` immediately (non-blocking)

### 4.4 Background Execution

1. Worker consumes job from queue
2. Updates execution status to `RUNNING`
3. Executes Python code with a timeout
4. Captures:
   - stdout
   - stderr
   - execution time
5. Updates execution status accordingly

### 4.5 Result Polling

1. Client polls execution result using `execution_id`
2. Backend returns current execution state and output

---

## 5. Queue-Based Execution Design

- BullMQ is used to decouple API and execution
- API remains responsive under load
- Redis provides reliable job buffering
- Workers can be scaled independently

---

## 6. Execution Lifecycle & State Management

### 6.1 Execution States

```
QUEUED → RUNNING → COMPLETED
                   FAILED
                   TIMEOUT
```

### 6.2 State Descriptions

- **QUEUED**: Execution request accepted and queued
- **RUNNING**: Worker is executing the code
- **COMPLETED**: Execution finished successfully
- **FAILED**: Runtime or syntax error
- **TIMEOUT**: Execution exceeded time limit

---

## 7. API Documentation

### 7.1 Create Code Session

**POST** `/code-sessions`

Response:

```json
{
  "session_id": "uuid",
  "status": "ACTIVE"
}
```

### 7.2 Autosave Code

**PATCH** `/code-sessions/{session_id}`

Request:

```json
{
  "language": "python",
  "sourceCode": "print('Hello World')"
}
```

### 7.3 Run Code

**POST** `/sessions/{session_id}/run`

Response:

```json
{
  "execution_id": "uuid",
  "status": "QUEUED"
}
```

### 7.4 Get Execution Result

**GET** `/executions/{execution_id}`

Response:

```json
{
  "execution_id": "uuid",
  "status": "COMPLETED",
  "stdout": "Hello World\n",
  "stderr": "",
  "execution_time_ms": 120
}
```

---

## 8. Reliability & Data Model

### 8.1 Idempotency Handling

- Each execution request generates a unique `execution_id`
- Executions are immutable once created
- Duplicate execution runs are avoided by design

### 8.2 Failure Handling

- Runtime errors captured in `stderr`
- Timeouts handled explicitly
- Failed jobs do not crash API server
- Queue supports retries if needed
- Failed executions are persisted for inspection

---

## 9. Scalability Considerations

### 9.1 Concurrent Sessions

- API servers are stateless
- Sessions stored in database
- Queue buffers traffic spikes

### 9.2 Horizontal Scaling of Workers

- Multiple workers can consume the same queue
- Redis ensures job locking
- Workers can be scaled independently

### 9.3 Potential Bottlenecks & Mitigation

| Bottleneck | Mitigation Strategy |
|------------|---------------------|
| High execution volume | Queue rate limiting |
| Long-running code | Strict execution timeout |
| Redis overload | Increase Redis resources |
| Worker saturation | Horizontal scaling |

---

## 10. Design Decisions & Trade-offs

### 10.1 Technology Choices

- **NestJS**: Structured, modular, testable backend
- **BullMQ**: Reliable async job processing
- **sql.js**:
  - Pros: Zero setup, fast local development
  - Cons: Non-persistent, in-memory only

### 10.2 Optimization Focus

- Simplicity and clarity over full production readiness
- Fast setup for reviewers
- Clear execution lifecycle and flow

### 10.3 Production Readiness Gaps

- No persistent database
- No authentication or authorization
- Limited sandboxing for code execution
- No rate limiting or quotas
- No monitoring or alerting

---

## 11. Improvements With More Time

- Persistent database (PostgreSQL)
- Secure sandboxing (Docker / Firecracker)
- Multi-language support
- Authentication & authorization
- WebSocket-based real-time execution updates
- Metrics and monitoring (Prometheus + Grafana)

---

## 12. Notes

- Debug endpoints are provided for development purposes only
- Debug APIs are excluded from Swagger documentation intentionally
- sql.js is used to simplify setup and evaluation

---

## 13. Summary

This project demonstrates:

- Asynchronous backend design
- Queue-based execution architecture
- Clear separation of concerns
- Practical trade-offs for a take-home assignment
