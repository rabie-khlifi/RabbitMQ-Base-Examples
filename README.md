# RabbitMQ Examples

A comprehensive collection of RabbitMQ messaging patterns examples in both JavaScript and TypeScript.

## Installation

```bash
npm install
```

Make sure you have RabbitMQ running on `localhost:5672`.

## Run RabbitMQ with Docker Compose

This project includes a `docker-compose.yml` to start RabbitMQ locally.

```bash
docker compose up -d
```

RabbitMQ will be available at:
- AMQP: `localhost:5672`
- Management UI: `http://localhost:15672`
- Username: `guest`
- Password: `guest`

Stop and remove the containers:

```bash
docker compose down
```

To also remove RabbitMQ persisted data volume:

```bash
docker compose down -v
```

## Running Examples

Each example has both JavaScript and TypeScript versions. Use the npm scripts defined in `package.json`:

### Basic Producer/Consumer
```bash
npm run basic:producer    # JS version
npm run basic:consumer    # JS version
npm run basic:producer:ts # TS version
npm run basic:consumer:ts # TS version
```

### JSON Messaging
```bash
npm run json:producer
npm run json:consumer
npm run json:producer:ts
npm run json:consumer:ts
```

### Round-Robin Distribution
```bash
npm run roundrobin:producer
npm run roundrobin:consumer
npm run roundrobin:producer:ts
npm run roundrobin:consumer:ts
```

### Manual Acknowledgments
```bash
npm run manual:producer
npm run manual:consumer
npm run manual:producer:ts
npm run manual:consumer:ts
```

### Direct Exchange
```bash
npm run direct:producer
npm run direct:consumer
npm run direct:producer:ts
npm run direct:consumer:ts
```

### Fanout Exchange
```bash
npm run fanout:producer
npm run fanout:consumer
npm run fanout:producer:ts
npm run fanout:consumer:ts
```

### Topic Exchange
```bash
npm run topic:producer
npm run topic:consumer
npm run topic:producer:ts
npm run topic:consumer:ts
```

### Dead-Letter Queues
```bash
npm run deadletter:producer
npm run deadletter:consumer
npm run deadletter:deadconsumer
npm run deadletter:producer:ts
npm run deadletter:consumer:ts
npm run deadletter:deadconsumer:ts
```

### RPC Pattern
```bash
npm run rpc:server
npm run rpc:client
npm run rpc:server:ts
npm run rpc:client:ts
```

## Patterns Covered

- **Basic Producer/Consumer** - Simple message queue with acknowledgments
- **JSON Messaging** - Sending structured JSON data
- **Round-Robin Distribution** - Load balancing work across multiple consumers
- **Manual Acknowledgments** - Explicit message acknowledgment with crash simulation
- **Durable Queues** - Persistent queues and messages
- **Direct Exchange** - Point-to-point routing with routing keys
- **Fanout Exchange** - Broadcasting messages to all bound queues
- **Topic Exchange** - Pattern-based message routing
- **Dead-Letter Queues** - Handling failed messages
- **RPC Pattern** - Request/reply communication

## Project Structure

- `examples-js/` - JavaScript implementations of all patterns
- `examples-ts/` - TypeScript implementations of all patterns
- `package.json` - Dependencies and npm scripts
- `tsconfig.json` - TypeScript configuration

## Requirements

- Node.js (v14 or higher)
- npm
- RabbitMQ server running and accessible on localhost:5672 (or Docker + Docker Compose)

## TypeScript Support

All examples are available in TypeScript. The project includes:
- `tsconfig.json` - Configured for Node.js target with proper module resolution
- TypeScript dependencies in `package.json`
- Full type definitions for amqplib

Run TypeScript examples directly with `ts-node` via npm scripts.
