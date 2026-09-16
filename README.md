# Flash Sale Reservation Engine

## Problem Statement

Build a backend system that can handle a large number of concurrent reservation requests for limited inventory during a flash sale, without overselling.

For example, if there are 100 items and 5,000 users try to reserve them at the same time, at most 100 reservations should succeed. The system should also handle duplicate requests and temporary reservations.

## Tech Stack

* Node.js
* Express.js
* Redis
* PostgreSQL
* Docker
* k6

## Architecture

```text
Client / k6
    ↓
Express API
    ↓
Redis
    ↓
Redis Stream
    ↓
Background Worker
    ↓
PostgreSQL
```

Redis handles the fast reservation path, while PostgreSQL is used for durable storage.
