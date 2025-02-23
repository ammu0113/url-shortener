# URL Shortener Application

A full-stack URL shortening service built with React, Node.js, and MongoDB that allows users to create shortened URLs and track comprehensive analytics.

## Core Features

### URL Management

- Create shortened versions of long URLs
- Edit and delete existing shortened URLs
- One-click copy to clipboard functionality
- QR code generation for shortened URLs

### Analytics Dashboard

- Track total clicks and engagement
- Capture detailed analytics including:
  - IP address
  - User agent information
  - Referrer tracking
  - Geographic data (country and city)
  - Timestamp of each visit

### User Interface

- Clean, modern Material-UI design
- Real-time data updates using React Query
- Toast notifications for user feedback
- Confirmation dialogs for important actions
- Loading states and error handling

## Tech Stack

### Frontend

- React.js with React Router
- Material-UI components
- React Query for data fetching
- SCSS for custom styling
- React Icons
- SweetAlert2 for dialogs

### Backend

- Node.js/Express.js server
- MongoDB with Mongoose
- JWT authentication
- Analytics tracking middleware

## Project Structure

### Client

- `src/components/` - Reusable React components
- `src/pages/` - Page components
- `src/utils/` - Utility functions
- `src/App.js` - Main application component
- `src/index.js` - Entry point for the React application

### Server

- `src/routes/` - API routes
- `src/models/` - Mongoose models
- `src/middleware/` - Custom middleware
- `src/utils/` - Utility functions
- `src/index.js` - Entry point for the Node.js server

## Installation

1. Clone the repository

   git clone https://github.com/yourusername/url-shortener.git

2. Install dependencies

   cd url-shortener
   npm install

3. Set up environment variables

   cp .env.example .env

   # Edit .env file with your configuration

4. Start the application

   # Start server

   cd server
   npm run dev

   # Start client

   cd client
   npm start

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login to the application
- `POST /api/auth/logout` - Logout the current user

### URL Management

- `POST /api/urls` - Create a new shortened URL
- `GET /api/urls/:shortId` - Redirect to the original URL
- `DELETE /api/urls/:shortId` - Delete a shortened URL

### Analytics

- `GET /api/analytics/:shortId` - Get analytics for a specific shortened URL

## Contributing

1. Fork the repository
2. Create a new branch

   git checkout -b feature/new-feature

3. Make your changes and commit them

   git add .
   git commit -m 'Add new feature'

4. Push your changes to your fork

   git push origin feature/new-feature

5. Create a Pull Request

   # Create a Pull Request on GitHub

   # Go to the repository page on GitHub

   # Click on the "Pull Requests" tab

   # Click on the "New Pull Request" button

   # Select your branch and create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
