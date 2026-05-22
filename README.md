# TradeX

Full-stack trading platform clone with landing site, dashboard, and Node.js API backed by MongoDB Atlas.

## Project structure

| Folder | Description | Default port |
|--------|-------------|--------------|
| `frontend/` | Marketing site, sign up, sign in | 3000 |
| `dashboard/` | Trading dashboard (watchlist, orders, funds) | 3001 |
| `backend/` | REST API (auth, holdings, orders) | 3002 |

## Local setup

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URL=your_mongodb_atlas_connection_string
PORT=3002
```

```bash
npm start
```

### 2. Frontend

```bash
cd frontend
npm install
```

Optional `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:3002
REACT_APP_DASHBOARD_URL=http://localhost:3001
```

```bash
npm start
```

### 3. Dashboard

```bash
cd dashboard
npm install
```

Optional `dashboard/.env`:

```env
PORT=3001
REACT_APP_API_URL=http://localhost:3002
REACT_APP_FRONTEND_URL=http://localhost:3000
```

```bash
npm start
```

## Hosting notes

- Deploy **backend** first and set `MONGO_URL` in the host environment.
- Point **frontend** `REACT_APP_API_URL` and `REACT_APP_DASHBOARD_URL` to your deployed API and dashboard URLs.
- Point **dashboard** `REACT_APP_API_URL` and `REACT_APP_FRONTEND_URL` to your deployed API and frontend URLs.
- In MongoDB Atlas, allow network access for your host (or `0.0.0.0/0` for testing).
- Never commit `.env` files; use `.env.example` as a template.

## Tech stack

- React (Create React App)
- Express + Mongoose
- MongoDB Atlas
- Axios, React Router, bcrypt

## License

MIT
