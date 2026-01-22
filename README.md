# Live Code Execution Service

A backend service that supports live code execution for coding sessions.  
The system is designed to execute user-submitted code **asynchronously**, using a **queue-based worker architecture**, ensuring scalability, isolation, and non-blocking APIs.

---

## 1. Setup Instructions (Local Development)

### Prerequisites
- Node.js >= 18
- Redis (local or cloud, e.g. RedisLabs / Render Redis)
- npm

### Clone Repository
```bash
git clone https://github.com/Vinhf/live-code-execution.git
cd live-code-execution
```

### Install Dependencies
```bash
npm install
```

### Environment Configuration
Create a `.env` file (do NOT commit this file):

```env
NODE_ENV=development
PORT=3000

DB_TYPE=sqljs
DB_SYNCHRONIZE=true
DB_LOGGING=false

REDIS_HOST=your-redis-host
REDIS_PORT=your-redis-port
REDIS_PASSWORD=your-redis-password
REDIS_TLS=false

EXECUTION_QUEUE_NAME=execution-queue

SWAGGER_ENABLE=true
```

⚠️ `.env` must be added to `.gitignore` to avoid leaking secrets.

### Run the Application
```bash
npm run start:dev
```

Swagger UI (if enabled):
```
http://localhost:3000/api
```

---

## 2. High-Level Architecture Overview

This system follows an asynchronous, event-driven architecture.

### Core Components

**API Server (NestJS)**  
Handles HTTP requests, validation, and job submission.

**Redis Queue**  
Acts as a message broker for execution jobs.

**Worker Process**  
Consumes jobs from the queue and executes code in the background.

**Database (SQL.js)**  
Stores code sessions, executions, and execution results.

---

## 3. End-to-End Request Flow

### 3.1 Code Session Creation
1. Client sends request to create a code session.
2. API stores session metadata in the database.
3. Session ID is returned to the client.

### 3.2 Autosave Behavior
1. Client periodically sends code updates.
2. API updates the session content.
3. No execution is triggered during autosave.
4. Autosave is lightweight and does not interact with the execution queue.

### 3.3 Execution Request
1. Client requests code execution.
2. API creates an Execution record with state `QUEUED`.
3. Execution job is pushed into Redis queue.
4. API immediately returns `executionId`.

### 3.4 Background Execution
1. Worker picks up the job from the queue.
2. Execution state transitions to `RUNNING`.
3. Code is executed in an isolated process (conceptual isolation).
4. Time and resource limits are enforced.
5. Result or error is stored.
6. Execution state transitions to:
   - `COMPLETED`
   - `FAILED`
   - `TIMEOUT`

### 3.5 Result Polling
1. Client polls execution status via API.
2. API returns execution state and output if available.

---

## 4. Queue-Based Execution Design

- Redis is used as a message broker.
- Each execution is represented as a job.
- API layer never executes code directly.
- Workers can scale independently from API servers.

**Benefits:**
- Non-blocking HTTP requests
- Fault isolation
- Horizontal scalability

---

## 5. Execution Lifecycle & State Management

### Execution States
```
QUEUED → RUNNING → COMPLETED
                 → FAILED
                 → TIMEOUT
```

### State Transition Rules
- **QUEUED**: Job is accepted and waiting in queue
- **RUNNING**: Worker has started execution
- **COMPLETED**: Execution finished successfully
- **FAILED**: Runtime or system error occurred
- **TIMEOUT**: Execution exceeded allowed time limit

---

## 6. Reliability & Data Model

### 6.1 Idempotency Handling
- Each execution request generates a unique `executionId`.
- Duplicate execution requests for the same session can be detected.
- Workers safely reprocess jobs using execution state checks.

### 6.2 Failure Handling
- Transient failures are retried automatically via queue configuration.
- Max retry attempts are limited.
- Failed executions are marked with error details.
- Dead or permanently failed jobs can be inspected manually.

---

## 7. Scalability Considerations

### 7.1 Concurrent Live Coding Sessions
- Stateless API servers allow horizontal scaling.
- Redis queue buffers load during traffic spikes.

### 7.2 Horizontal Worker Scaling
- Multiple workers can consume from the same queue.
- Execution throughput increases linearly with worker count.

### 7.3 Queue Backlog Handling
- Redis acts as a buffer when execution demand exceeds capacity.
- Backpressure prevents API overload.

### 7.4 Potential Bottlenecks & Mitigation

| Bottleneck | Mitigation |
|------------|------------|
| Redis overload | Dedicated Redis instance |
| Long-running jobs | Strict time limits |
| High memory usage | Memory limits per execution |
| Worker crash | Retry & job reprocessing |

---

## 8. API Documentation (Overview)

### Create Execution
**POST** `/executions`

**Request:**
```json
{
  "sessionId": "string",
  "language": "javascript",
  "code": "console.log('Hello');"
}
```

**Response:**
```json
{
  "executionId": "uuid",
  "status": "QUEUED"
}
```

### Get Execution Result
**GET** `/executions/:id`

**Response:**
```json
{
  "executionId": "uuid",
  "status": "COMPLETED",
  "output": "Hello"
}
```

---

## 9. Trade-offs & Design Decisions

### Technology Choices
- **NestJS**: Structured, scalable backend framework
- **Redis Queue**: Reliable async processing
- **SQL.js**: Simple embedded database for demo purposes

### Optimization Focus
- Prioritized simplicity and correctness over maximum performance
- Clear separation of concerns between API and execution
- Async-first design to prevent blocking

### Production Readiness Gaps
- True container-level isolation (Docker / Firecracker)
- Stronger sandboxing and security hardening
- Persistent database (PostgreSQL)
- Metrics, tracing, and monitoring
- Authentication & authorization

---

## 10. Future Improvements

- Support multiple programming languages
- WebSocket-based real-time execution updates
- Execution resource quotas per user
- Advanced sandboxing with containers
