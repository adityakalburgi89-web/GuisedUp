# GuisedUp

A social media platform with AI-powered content ranking, built with **Laravel 13**, **pgvector**, **FastAPI**, and **React Native (Expo)**.

Users share filtered/polished images and discover content through a personalized feed ranked by engagement, recency, and social connections — with optional semantic search powered by sentence embeddings.

---

## Architecture

```
┌─────────────────────┐      ┌──────────────────┐      ┌──────────────────────┐
│   Mobile App        │      │   Laravel API     │      │   Embedding Service  │
│   React Native      │─────▶│   (PHP 8.3+)      │─────▶│   FastAPI (Python)   │
│   Expo SDK 52       │      │   Sanctum Auth    │      │   all-MiniLM-L6-v2   │
└─────────────────────┘      │   pgvector Search │      │   + hash fallback    │
                             └────────┬─────────┘      └──────────────────────┘
                                      │
                             ┌────────▼─────────┐
                             │   PostgreSQL 16   │
                             │   + pgvector ext  │
                             └──────────────────┘
```

**Three services:**

| Service            | Stack                          | Port  |
|--------------------|--------------------------------|-------|
| Backend API        | Laravel 13 + Sanctum + pgvector| 8000  |
| Embedding Service  | FastAPI + sentence-transformers| 8001  |
| Database           | PostgreSQL 16 + pgvector       | 5432  |

---

## Quick Start

### Prerequisites

- Docker & Docker Compose
- PHP 8.3+ with `pdo_pgsql` (for local dev without Docker)
- Python 3.10+ (for local embedding service)
- Node.js 18+ (for mobile app)
- Composer 2.x

### 1. Start Infrastructure (Docker)

```bash
docker compose up -d
```

This starts PostgreSQL (with pgvector) + Laravel app container + embedding service.

### 2. Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### 3. Embedding Service

```bash
cd embedding-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### 4. Mobile App

```bash
cd mobile
npm install
npx expo start
```

---

## Environment Variables

| Variable                | Default                     | Description                              |
|-------------------------|-----------------------------|------------------------------------------|
| `DB_CONNECTION`         | `pgsql`                     | Database driver                          |
| `DB_HOST`               | `db` (Docker) / `127.0.0.1`| PostgreSQL host                          |
| `DB_PORT`               | `5432`                      | PostgreSQL port                          |
| `DB_DATABASE`           | `guised_up`                 | Database name                            |
| `DB_USERNAME`           | `guised_admin`              | Database user                            |
| `DB_PASSWORD`           | `guised_password`           | Database password                        |
| `EMBEDDING_SERVICE_URL` | `http://localhost:8001`     | FastAPI embedding service URL            |
| `APP_KEY`               | (generated)                 | Laravel encryption key                   |
| `EXPO_PUBLIC_API_URL`   | `http://10.0.2.2:8000/api` | API URL for mobile (Android emulator)    |

---

## API Endpoints

### Authentication

| Method | Endpoint          | Auth     | Description              |
|--------|-------------------|----------|--------------------------|
| POST   | `/api/register`   | No       | Create account + token   |
| POST   | `/api/login`      | No       | Login + token            |
| POST   | `/api/logout`     | Required | Revoke current token     |
| GET    | `/api/user`       | Required | Get authenticated user   |

### Posts

| Method | Endpoint          | Auth     | Description              |
|--------|-------------------|----------|--------------------------|
| GET    | `/api/feed`       | Optional | Ranked feed (paginated)  |
| GET    | `/api/search?q=`  | No       | Text/vector search       |
| GET    | `/api/posts/{id}` | No       | Single post              |
| POST   | `/api/posts`      | Required | Create post + embedding  |
| POST   | `/api/interactions`| Required| Record like/view         |

### Embedding Service

| Method | Endpoint    | Description                        |
|--------|-------------|------------------------------------|
| GET    | `/health`   | Health check + uptime              |
| POST   | `/embed`    | Generate 384-dim embedding         |

---

## Database Schema

```
users
├── id (bigint PK)
├── name (varchar)
├── email (varchar UNIQUE)
├── email_verified_at (timestamp?)
├── password (varchar)
├── remember_token (varchar?)
└── timestamps

posts
├── id (bigint PK)
├── user_id (bigint FK → users)
├── image_path (varchar)
├── original_image_path (varchar?)
├── caption (text?)
├── has_filter (boolean)
├── image_polish_level (integer)
├── embedding (vector(384)?)  ← pgvector
├── created_at (INDEX)
└── timestamps

follows
├── id (bigint PK)
├── follower_id (bigint FK → users)
├── following_id (bigint FK → users)
├── UNIQUE(follower_id, following_id)
└── timestamps

interactions
├── id (bigint PK)
├── user_id (bigint FK → users)
├── post_id (bigint FK → posts)
├── type (varchar: 'like'|'view')
├── INDEX(user_id, post_id, type)
└── timestamps

personal_access_tokens (Sanctum)
```

---

## Ranking Algorithm

The feed uses a multi-factor ranking score:

```
Score = (engagement_score + 1) × recency_decay × follow_boost
```

| Factor            | Formula                                            | Weight    |
|-------------------|----------------------------------------------------|-----------|
| Engagement Score  | `likes × 3 + views × 1`                           | Per post  |
| Recency Decay     | `1 / (1 + hours_since_post × 0.1)`                | Time-based|
| Follow Boost      | `1.5` if viewer follows author, else `1.0`         | Social    |

This ensures:
- Recent posts rank higher than old ones
- Popular posts (many likes) surface more
- Posts from followed users get priority
- Fresh posts with zero engagement still appear (the `+1` baseline)

---

## Docker Usage

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Run migrations inside container
docker compose exec app php artisan migrate --seed

# Stop everything
docker compose down

# Reset database
docker compose down -v
docker compose up -d
```

---

## Testing

```bash
cd backend
composer install
php artisan test
```

Tests run against SQLite in-memory (configured in `phpunit.xml`). Migrations gracefully skip pgvector-specific SQL on SQLite.

**Test coverage:**
- `FeedRankingServiceTest` — feed ordering, pagination, edge cases
- `AuthenticationTest` — register, login, logout, validation
- `FeedEndpointTest` — feed API, pagination, structure
- `SearchEndpointTest` — text search, validation, results
- `PostCreationTest` — create, auth, validation, show
- `EmbeddingFallbackTest` — fallback quality, determinism, health

---

## Project Structure

```
GuisedUp/
├── backend/                  # Laravel 13 API
│   ├── app/
│   │   ├── Http/Controllers/ # API controllers
│   │   ├── Models/           # Eloquent models
│   │   ├── Providers/        # Service providers
│   │   └── Services/         # Business logic
│   ├── database/
│   │   ├── factories/        # Test factories
│   │   ├── migrations/       # Schema migrations
│   │   └── seeders/          # Seed data
│   ├── routes/api.php        # API routes
│   └── tests/                # Pest test suite
├── embedding-service/        # FastAPI Python service
│   ├── main.py               # API endpoints
│   ├── model.py              # Embedding logic + fallback
│   └── requirements.txt
├── mobile/                   # React Native (Expo)
│   ├── App.tsx               # App entry
│   └── src/
│       ├── api/              # HTTP client
│       ├── components/       # UI components
│       ├── hooks/            # React hooks
│       ├── screens/          # App screens
│       ├── theme/            # Design tokens
│       └── types/            # TypeScript types
├── sql/queries.sql           # Raw PostgreSQL queries (D1–D4)
├── docs/TSD.md               # Technical System Design
├── docker-compose.yml        # 3-service orchestration
└── README.md                 # This file
```

---

## License

MIT
