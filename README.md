# Lunith :stars:

## Overview
- Shard system to connect docker instances to the frontend via websockets
- Frontend with authentication to manage servers, user, shards, etc...
- Backend with accessable API


## Current stack
- Runtime: Bun
- Backend: Hono
- Frontend: Vite w Tanstack Router (Built and served through the backend)
- ORM: Drizzle
- Database: PostgreSQL
- Cache: Redis

## To clone this project:
- Clone the repo
- bun i inside of the root folder
- bun i inside of the frontend folder
- bun run dev in root for backend
- bun run dev in /frontend for frontend dev server
- bun build in /frontend to access the build project via backend.