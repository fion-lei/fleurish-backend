# Fleurish Backend

A MongoDB Express backend boilerplate with organized folder structure.

## Project Structure

```
fleurish-backend/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection configuration
│   ├── controllers/
│   │   ├── userController.js # User business logic
│   │   └── productController.js # Product business logic
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── Product.js        # Product schema
│   ├── routes/
│   │   ├── userRoutes.js     # User API routes
│   │   └── productRoutes.js  # Product API routes
│   └── server.js             # Express app entry point
├── .env.example              # Environment variables template
├── .gitignore
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your MongoDB connection string:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fleurish
NODE_ENV=development
```

### Running the Application

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Users
- `GET /api/users/:userId/points` - Get user points (gems and coins)

### Health Check
- `GET /health` - Check server status

## Example Usage

### Get User Points
```bash
GET /api/users/user123/points

Response:
{
  "success": true,
  "data": {
    "userId": "user123",
    "gems": 100,
    "coins": 250
  }
}
```

## License

ISC
