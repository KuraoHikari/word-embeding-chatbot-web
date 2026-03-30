# Realtime Messaging Architecture

## Tech Stack

- Hono
- Socket.io
- Redis (Upstash)
- Drizzle ORM
- Zustand
- React Query

## Room Strategy

conversation:{conversationId}

## Socket Events

Client → Server:

- message:send
- message:typing
- conversation:join
- conversation:leave

Server → Client:

- message:new
- message:typing
- presence:update
- conversation:autoReplyUpdated

Client ──WS──► Socket.io ──► handlers/ ──► services/ ──► DB (drizzle)
Client ──HTTP──► Hono routes ──────────────────────────► DB (drizzle)
│  
 └── PATCH /conversations/:id ──► getIO().emit()

server in localhost http://localhost:9999/
