# Trello Clone API

A robust and scalable RESTful API for a Trello-like task management application, built with Node.js, Express, and MongoDB. This backend service provides comprehensive board, column, and card management features, along with real-time collaboration capabilities using Socket.IO.

[![Node.js](https://img.shields.io/badge/Node.js-18.x+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0.0-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Real-time Events](#-real-time-events)
- [Authentication](#-authentication)
- [File Upload](#-file-upload)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## ✨ Features

### User Management
- ✅ User registration with email verification
- ✅ Secure authentication with JWT (Access & Refresh Tokens)
- ✅ HTTP-only cookie-based token storage
- ✅ Profile management with avatar upload
- ✅ Password encryption using bcryptjs

### Board Management
- ✅ Create public/private boards
- ✅ Multi-user boards with owner and member roles
- ✅ Board listing with pagination and search
- ✅ Drag & drop support for columns and cards
- ✅ Board invitation system

### Column & Card Operations
- ✅ Create, update, and delete columns
- ✅ Create, update, and delete cards
- ✅ Move cards between columns
- ✅ Card cover image upload
- ✅ Card member management

### Real-time Collaboration
- ✅ Socket.IO integration for live updates
- ✅ Real-time board invitation notifications
- ✅ Instant collaboration across multiple users

### Additional Features
- ✅ Email notifications via MailerSend
- ✅ Image storage with Cloudinary
- ✅ CORS configuration for secure cross-origin requests
- ✅ Centralized error handling
- ✅ Input validation with Joi
- ✅ Production-ready deployment configuration

---

## 🛠 Tech Stack

### Backend Framework
- **Node.js** (>=18.x) - JavaScript runtime
- **Express.js** (4.18.2) - Web application framework

### Database
- **MongoDB** (6.0.0) - NoSQL database
- **MongoDB Atlas** - Cloud database hosting

### Authentication & Security
- **jsonwebtoken** (9.0.2) - JWT token generation and verification
- **bcryptjs** (2.4.3) - Password hashing
- **cookie-parser** (1.4.7) - Cookie parsing middleware

### File Upload & Storage
- **Multer** (2.0.2) - Multipart form data handling
- **Cloudinary** (2.7.0) - Cloud-based image storage
- **Streamifier** (0.1.1) - Buffer to stream conversion

### Real-time Communication
- **Socket.IO** (4.8.1) - Bidirectional event-based communication

### Validation & Utilities
- **Joi** (17.13.3) - Schema validation
- **Lodash** (4.17.21) - Utility functions
- **uuid** (9.0.1) - Unique identifier generation

### Email Service
- **MailerSend** (2.6.0) - Transactional email service

### Developer Tools
- **Babel** - ES6+ transpilation
- **ESLint** - Code linting
- **Nodemon** - Development auto-restart
- **dotenv** (16.6.1) - Environment variable management

---

## 📁 Project Structure

```
trello-api/
├── src/
│   ├── config/              # Configuration files
│   │   ├── cors.js          # CORS settings
│   │   ├── environment.js   # Environment variables
│   │   └── mongodb.js       # MongoDB connection
│   │
│   ├── controllers/         # Request handlers
│   │   ├── boardController.js
│   │   ├── cardController.js
│   │   ├── columnController.js
│   │   ├── invitationController.js
│   │   └── userController.js
│   │
│   ├── models/              # Database models
│   │   ├── boardModel.js
│   │   ├── cardModel.js
│   │   ├── columnModel.js
│   │   ├── invitationModel.js
│   │   └── userModel.js
│   │
│   ├── services/            # Business logic layer
│   │   ├── boardService.js
│   │   ├── cardService.js
│   │   ├── columnService.js
│   │   ├── invitationService.js
│   │   └── userService.js
│   │
│   ├── routes/              # API routes
│   │   └── v1/
│   │       ├── boardRoute.js
│   │       ├── cardRoute.js
│   │       ├── columnRoute.js
│   │       ├── invitationRoute.js
│   │       ├── userRoute.js
│   │       └── index.js
│   │
│   ├── middlewares/         # Custom middleware
│   │   ├── authMiddleware.js
│   │   ├── errorHandlingMiddleware.js
│   │   └── multerUploadMiddleware.js
│   │
│   ├── validations/         # Input validation schemas
│   │   ├── boardValidation.js
│   │   ├── cardValidation.js
│   │   ├── columnValidation.js
│   │   ├── invitationValidation.js
│   │   └── userValidation.js
│   │
│   ├── providers/           # External service providers
│   │   ├── CloudinaryProvider.js
│   │   ├── JwtProvider.js
│   │   └── MailerSendProvider.js
│   │
│   ├── sockets/             # Socket.IO event handlers
│   │   └── inviteUserToBoardSocket.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── algorithms.js
│   │   ├── ApiError.js
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   └── validators.js
│   │
│   └── server.js            # Application entry point
│
├── .babelrc                 # Babel configuration
├── .eslintrc.cjs            # ESLint configuration
├── jsconfig.json            # JavaScript configuration
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

---

## 🚀 Installation

### Prerequisites
- Node.js (version 18.x or higher)
- npm or yarn package manager
- MongoDB Atlas account (or local MongoDB installation)
- Cloudinary account (for image storage)
- MailerSend account (for email notifications)

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/hwink09/trello-api.git
   cd trello-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create a .env file in the root directory
   touch .env
   ```

4. **Configure environment variables** (see [Environment Variables](#-environment-variables) section)

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm run production
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application
AUTHOR=YourName
BUILD_MODE=dev
LOCAL_DEV_APP_HOST=localhost
LOCAL_DEV_APP_PORT=8017

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
DATABASE_NAME=trello-api

# Frontend URLs
WEBSITE_DOMAIN_DEV=http://localhost:5173
WEBSITE_DOMAIN_PRODUCTION=https://your-production-domain.com

# JWT Configuration
ACCESS_TOKEN_SECRET_SIGNATURE=your-access-token-secret-key-here
ACCESS_TOKEN_LIFE=1h
REFRESH_TOKEN_SECRET_SIGNATURE=your-refresh-token-secret-key-here
REFRESH_TOKEN_LIFE=14days

# MailerSend
MAILER_SEND_API_KEY=your-mailersend-api-key
ADMIN_FROM_EMAIL=noreply@yourdomain.com
ADMIN_SENDER_NAME=Trello Clone

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Environment Variable Descriptions

|           Variable                |              Description               |
|-----------------------------------|----------------------------------------|
| `MONGODB_URI`                     | MongoDB connection string              |
| `DATABASE_NAME`                   | Name of your MongoDB database          |
| `ACCESS_TOKEN_SECRET_SIGNATURE`   | Secret key for signing access tokens   |
| `REFRESH_TOKEN_SECRET_SIGNATURE`  | Secret key for signing refresh tokens  |
| `MAILER_SEND_API_KEY`             | API key from MailerSend                |
| `CLOUDINARY_CLOUD_NAME`           | Your Cloudinary cloud name             |
| `CLOUDINARY_API_KEY`              | Your Cloudinary API key                |
| `CLOUDINARY_API_SECRET`           | Your Cloudinary API secret             |

---

## 💻 Usage

### Development Mode
```bash
npm run dev
```
Runs the server with Nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm run build
npm run production
```
Transpiles code with Babel and runs the optimized build.

### Linting
```bash
npm run lint
```
Checks code quality and style using ESLint.

### API Health Check
Once the server is running, test the API status:
```bash
GET http://localhost:8017/v1/status
```

Expected response:
```json
{
  "message": "APIs V1 are ready to use."
}
```

---

## 📚 API Documentation

### Base URL
- **Development:** `http://localhost:8017/v1`
- **Production:** `https://your-domain.com/v1`

### Authentication Endpoints

#### Register User
```http
POST /users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "username": "johndoe"
}
```

#### Verify Account
```http
PUT /users/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "verifyToken": "verification-token-from-email"
}
```

#### Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Logout
```http
DELETE /users/logout
Cookie: accessToken=...; refreshToken=...
```

#### Refresh Token
```http
GET /users/refresh_token
Cookie: refreshToken=...
```

#### Update Profile
```http
PUT /users/update
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

{
  "username": "newusername",
  "avatar": <file>
}
```

---

### Board Endpoints

#### Get All Boards
```http
GET /boards?page=1&itemsPerPage=12&q[title]=project
Authorization: Bearer <accessToken>
```

Query Parameters:
- `page` (optional): Page number (default: 1)
- `itemsPerPage` (optional): Items per page (default: 12)
- `q[title]` (optional): Search by board title

#### Create Board
```http
POST /boards
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "My Project Board",
  "description": "Project management board",
  "type": "private"
}
```

#### Get Board Details
```http
GET /boards/:id
Authorization: Bearer <accessToken>
```

#### Update Board
```http
PUT /boards/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Updated Board Title",
  "columnOrderIds": ["col1", "col2", "col3"]
}
```

#### Move Card Between Columns
```http
PUT /boards/supports/moving_card
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "currentCardId": "card-id",
  "prevColumnId": "previous-column-id",
  "nextColumnId": "next-column-id",
  "prevCardOrderIds": ["card1", "card2"],
  "nextCardOrderIds": ["card3", "card4"]
}
```

---

### Column Endpoints

#### Create Column
```http
POST /columns
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "boardId": "board-id",
  "title": "To Do"
}
```

#### Update Column
```http
PUT /columns/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "In Progress",
  "cardOrderIds": ["card1", "card2"]
}
```

#### Delete Column
```http
DELETE /columns/:id
Authorization: Bearer <accessToken>
```

---

### Card Endpoints

#### Create Card
```http
POST /cards
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "boardId": "board-id",
  "columnId": "column-id",
  "title": "New Task"
}
```

#### Update Card
```http
PUT /cards/:id
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

{
  "title": "Updated Task",
  "description": "Task description",
  "cardCover": <file>
}
```

---

### Invitation Endpoints

#### Create Board Invitation
```http
POST /invitations/board
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "inviteeEmail": "invitee@example.com",
  "boardId": "board-id"
}
```

#### Get User Invitations
```http
GET /invitations
Authorization: Bearer <accessToken>
```

#### Update Invitation Status
```http
PUT /invitations/board/:invitationId
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "status": "ACCEPTED"
}
```

Status values: `ACCEPTED` | `REJECTED`

---

## 🔄 Real-time Events

The application uses Socket.IO for real-time collaboration features.

### Client-to-Server Events

#### Invite User to Board
```javascript
socket.emit('FE_USER_INVITED_TO_BOARD', {
  invitation: {
    inviteeEmail: 'user@example.com',
    boardId: 'board-id',
    // ... other invitation data
  }
})
```

### Server-to-Client Events

#### User Invited Notification
```javascript
socket.on('BE_USER_INVITED_TO_BOARD', (invitation) => {
  // Handle real-time invitation notification
  console.log('New invitation received:', invitation)
})
```

---

## 🔒 Authentication

This API uses a dual-token authentication system:

1. **Access Token**: Short-lived token (1 hour) for API authorization
2. **Refresh Token**: Long-lived token (14 days) for obtaining new access tokens

Both tokens are stored as HTTP-only cookies with the following settings:
- `httpOnly: true` - Prevents JavaScript access
- `secure: true` - HTTPS only
- `sameSite: 'none'` - Cross-site request support
- `maxAge: 14 days` - Cookie expiration

### Authorization Header
For protected routes, include the access token in cookies (automatically sent by browser) or use:
```
Cookie: accessToken=your-token-here
```

---

## 📤 File Upload

The API supports file uploads for:
- **User Avatars**: Uploaded via `/users/update`
- **Card Covers**: Uploaded via `/cards/:id`

### Upload Specifications
- **Storage**: Cloudinary cloud storage
- **Middleware**: Multer for multipart/form-data handling
- **Supported Formats**: Images (JPEG, PNG, GIF, etc.)
- **Field Names**: 
  - `avatar` for user profile pictures
  - `cardCover` for card cover images

### Example Upload Request
```bash
curl -X PUT http://localhost:8017/v1/users/update \
  -H "Cookie: accessToken=your-token" \
  -F "username=johndoe" \
  -F "avatar=@/path/to/image.jpg"
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards
- Follow the existing code style
- Use ESLint for code linting
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes before submitting

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Hwink**

- GitHub: [@hwink09](https://github.com/hwink09)

---

## 🙏 Acknowledgments

- Built with love using the MERN stack
- Inspired by Trello's powerful project management features
- Special thanks to all contributors and the open-source community

---

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact via YouTube channel
- Check the documentation above

---

<div align="center">
  <p>Made with ❤️ by Hwink</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
