# fleurish Backend

A Node.js/Express backend API for fleurish, providing endpoints for managing users, gardens, plots, plants, communities, and growth tracking.

## Related Repositories

- [Frontend](https://github.com/fion-lei/fleurish)
- [Hardware/Processing](https://github.com/ryanwoong/fleurish-hardware)

## 🚀 Features

- User authentication and management
- Garden and plot management
- Plant and plant type tracking
- Community features
- Growth monitoring and tracking
- Task management system
- RESTful API architecture

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (v4.4 or higher)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/fion-lei/fleurish-backend.git
   cd fleurish-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Server Configuration
   PORT=5001

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d

   # Environment
   NODE_ENV=development
   ```

   **Important:** Replace `your_jwt_secret_key_here` with a strong, unique secret key.

## 🗂️ Project Structure

```
fleurish-backend/
├── assets/
│   └── taskDescriptions.json    # Task templates and descriptions
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── controllers/
│   │   ├── communityController.js
│   │   ├── gardenController.js
│   │   ├── growthController.js
│   │   ├── plantController.js
│   │   ├── plantTypeController.js
│   │   ├── plotController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── Community.js         # Community schema
│   │   ├── Garden.js            # Garden schema
│   │   ├── Plant.js             # Plant schema
│   │   ├── PlantType.js         # Plant type schema
│   │   ├── Plot.js              # Plot schema
│   │   ├── Task.js              # Task schema
│   │   └── User.js              # User schema
│   ├── routes/
│   │   ├── communityRoutes.js
│   │   ├── gardenRoutes.js
│   │   ├── growthRoutes.js
│   │   ├── plantRoutes.js
│   │   ├── plantTypeRoutes.js
│   │   ├── plotRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   └── growthService.js     # Growth calculation logic
│   └── server.js                # Application entry point
├── .env                         # Environment variables (create this)
├── .gitignore
├── package.json
└── README.md
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

This starts the server with nodemon for automatic restarts on file changes.

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in your `.env` file).

## 🌐 API Endpoints

### Health Check

- `GET /health` - Check server status

### User Management

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Gardens

- `GET /api/gardens` - Get all gardens
- `POST /api/gardens` - Create a new garden
- `GET /api/gardens/:id` - Get garden by ID
- `PUT /api/gardens/:id` - Update garden
- `DELETE /api/gardens/:id` - Delete garden

### Plots

- `GET /api/plots` - Get all plots
- `POST /api/plots` - Create a new plot
- `GET /api/plots/:id` - Get plot by ID
- `PUT /api/plots/:id` - Update plot
- `DELETE /api/plots/:id` - Delete plot

### Plants

- `GET /api/plants` - Get all plants
- `POST /api/plants` - Add a new plant
- `GET /api/plants/:id` - Get plant by ID
- `PUT /api/plants/:id` - Update plant
- `DELETE /api/plants/:id` - Remove plant

### Plant Types

- `GET /api/plant-types` - Get all plant types
- `POST /api/plant-types` - Create plant type
- `GET /api/plant-types/:id` - Get plant type by ID

### Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Community

- `GET /api/community` - Get community posts
- `POST /api/community` - Create community post
- `GET /api/community/:id` - Get post by ID

### Growth Tracking

- `GET /api/growth` - Get growth records
- `POST /api/growth` - Record growth data

## 🗃️ Database

The application uses MongoDB with Mongoose ODM. The database name is `fleurishDB`.

## 📦 Dependencies

### Production

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - Enable CORS
- **dotenv** - Environment variable management
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication

### Development

- **nodemon** - Auto-restart server on changes

## 🔒 Security

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- CORS is enabled for cross-origin requests
- Environment variables protect sensitive data
