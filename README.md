# Node.js Express Backend

A basic Express.js backend server with a modular structure.

## Getting Started

### Installation
```bash
npm install
```

### Running the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## Project Structure

```
BackEnd/
├── server.js          # Main server file
├── package.json       # Project dependencies
├── .env              # Environment variables
├── .gitignore        # Git ignore file
├── routes/           # Route definitions
├── controllers/      # Request handlers
├── middleware/       # Custom middleware
└── models/           # Data models
```

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check endpoint

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
```
