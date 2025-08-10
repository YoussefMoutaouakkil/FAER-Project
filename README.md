# FAER Formation Conseil - Project

A comprehensive web application for FAER Formation Conseil, featuring user authentication, dashboard, and formation management.

## Features

- 🎨 Modern, responsive UI design
- 🔐 User authentication (signup/login)
- 📊 User dashboard
- 🗄️ MySQL database integration
- 🔒 JWT-based authentication
- 📱 Mobile-friendly design
- 🎯 Formation management system

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd FAER-Project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Database Setup

#### Create MySQL Database
```sql
CREATE DATABASE faer_formation;
USE faer_formation;
```

#### Configure Database Connection
Copy the example configuration file:
```bash
cp config.env.example .env
```

Edit `.env` file with your database credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=faer_formation
DB_PORT=3306

# JWT Configuration
JWT_SECRET=faer-secret-key-2024-change-this-in-production

# Server Configuration
PORT=3000
NODE_ENV=development

# Session Configuration
SESSION_SECRET=faer-session-secret-change-this-in-production
```

### 4. Start the application
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
FAER-Project/
├── config/
│   └── database.js          # Database configuration and connection
├── services/
│   └── userService.js       # User-related database operations
├── views/
│   ├── assets/              # CSS, JS, and image files
│   ├── login.html           # Login page
│   ├── signup.html          # Signup page
│   ├── dashboard.html       # User dashboard
│   └── ...                  # Other HTML pages
├── index.js                 # Main server file
├── package.json             # Project dependencies
├── config.env.example       # Environment configuration example
└── README.md               # This file
```

## Database Schema

### Users Table
- `id` - Primary key
- `firstName` - User's first name
- `lastName` - User's last name
- `email` - Unique email address
- `phone` - Phone number
- `password` - Hashed password
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### User Sessions Table
- `id` - Primary key
- `userId` - Foreign key to users table
- `token` - JWT token
- `expiresAt` - Token expiration timestamp
- `createdAt` - Session creation timestamp

### Formations Table
- `id` - Primary key
- `title` - Formation title
- `description` - Formation description
- `duration` - Formation duration
- `price` - Formation price
- `category` - Formation category
- `createdAt` - Creation timestamp

### User Formations Table
- `id` - Primary key
- `userId` - Foreign key to users table
- `formationId` - Foreign key to formations table
- `enrolledAt` - Enrollment timestamp
- `status` - Enrollment status (enrolled/completed/cancelled)

## API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### User Management
- `GET /api/user` - Get current user profile
- `PUT /api/user/profile` - Update user profile

### Pages
- `GET /` - Home page
- `GET /login` - Login page
- `GET /signup` - Signup page
- `GET /dashboard` - User dashboard (requires authentication)
- `GET /about` - About page
- `GET /course` - Course page
- `GET /contact` - Contact page

## Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- Session management with database storage
- Input validation and sanitization
- SQL injection prevention using parameterized queries

## Development

### Adding New Features
1. Create necessary database tables in `config/database.js`
2. Add corresponding service methods in `services/`
3. Create API endpoints in `index.js`
4. Update frontend HTML/JavaScript as needed

### Database Migrations
The application automatically creates required tables on startup. For production, consider using a proper migration system.

## Troubleshooting

### Database Connection Issues
- Verify MySQL service is running
- Check database credentials in `.env` file
- Ensure database `faer_formation` exists
- Check MySQL user permissions

### Port Already in Use
Change the port in `.env` file or kill the process using the current port.

### Module Not Found Errors
Run `npm install` to ensure all dependencies are installed.

## Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use strong, unique secrets for JWT and sessions
3. Enable HTTPS
4. Set up proper database backups
5. Use environment variables for sensitive configuration
6. Consider using a process manager like PM2

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please contact the development team or create an issue in the repository. 