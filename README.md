# MaríaE MVP

A minimal guide to run the MaríaE web app (server + front-end) locally.

## Prerequisites
- Node.js 16+ (or compatible)
- npm (or yarn)
- MariaDB / MySQL running and accessible
- (optional) nodemon installed globally for convenience

## Setup
1. Clone the repo and install dependencies:
```bash
git clone <repo-url>
cd MariaE_MVP
npm install
```

2. Add a `.env` in the project root (example):
```env
SERVER_PORT=10000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=mariae_fashiongirls
DB_PORT=3306
```

## Scripts & How to run
- Production / simple:
  - `npm start`  
    (runs `node MariaE_API/routes/server.js`)

- Development (auto-restart on changes):
  - `npm run dev`  
    (runs `nodemon MariaE_API/routes/server.js`)

- Test:
  - `npm test`  
    Currently a placeholder: prints `No tests` and exits with code 0.

- Directly (when in `MariaE_API/routes`):
  - `node server.js`
  - `npx nodemon server.js`

## Notes
- `server.js` uses `dotenv` to load environment variables.
- Use `npm run dev` for faster local development (nodemon restarts on file changes).
- If you need Windows-friendly env scripting, add `cross-env` and update the `dev` script accordingly.

## Expected output
When the server starts successfully you'll see something similar to:
```
Servidor ejecutándose en http://localhost:10000
```

---