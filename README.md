# Dreamscape Backend

A Node.js backend for the Dreamscape music streaming service, built with Express, TypeScript, and MongoDB.

## Features

- User authentication (register, login, profile)
- JWT-based authentication
- Premium subscription management
- Secure password hashing
- Rate limiting
- CORS enabled
- Security headers with Helmet

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd dreamscape-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dreamscape
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## Development

To run the development server with hot reload:

```bash
npm run dev
```

## Production

1. Build the project:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Rate limiting to prevent abuse
- Security headers with Helmet
- CORS enabled for specific origins

## License

ISC
