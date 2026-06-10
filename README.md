# AI-Generator Project

A full-stack web application for AI-powered image generation and manipulation, combining a Laravel backend with a modern Next.js frontend.

##  Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure Details](#project-structure-details)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

##  Project Overview

AI-Generator is a comprehensive solution for generating and managing AI-powered images. The application integrates with Pixabay API to provide image search and generation capabilities, with a modern user interface built using React and Next.js.

### Key Features

- AI image generation and manipulation
- Pixabay API integration for image search
- Real-time image preview and management
- RESTful API backend
- Modern, responsive UI with Chakra UI and Tailwind CSS
- Fast development experience with Next.js

##  Tech Stack

### Backend
- **Framework**: Laravel 12.0
- **Language**: PHP 8.2+
- **Database**: MySQL/PostgreSQL (configurable)
- **Key Packages**:
  - Laravel Sanctum (API authentication)
  - Laravel Tinker (REPL)
  - Laravel Pail (log viewer)
  - DBAL (database abstraction)
  - Pixabay API wrapper

### Frontend
- **Framework**: Next.js 15.5.9
- **Library**: React 18.3.0
- **Styling**: 
  - Tailwind CSS 4
  - Chakra UI 2.10.9
  - Emotion (CSS-in-JS)
- **HTTP Client**: Axios
- **UI Components**:
  - React Icons
  - FontAwesome Icons
  - Chakra UI Icons
- **Animations**: Framer Motion
- **Utilities**:
  - React Colorful
  - React Player
  - React Window

### Development Tools
- **Backend**: PHPUnit, Laravel Pint, Mockery
- **Frontend**: ESLint, Prettier

##  Project Structure

```
AI-Generator/
├── backend/                          # Laravel backend
│   ├── laravel/                     # Main Laravel application
│   │   ├── app/                     # Application code
│   │   │   ├── Http/               # Controllers, middleware, requests
│   │   │   ├── Models/             # Eloquent models
│   │   │   ├── Providers/          # Service providers
│   │   │   └── Utility/            # Utility classes (ImageDecoder, etc.)
│   │   ├── routes/                 # Route definitions
│   │   │   ├── api.php            # API routes
│   │   │   ├── web.php            # Web routes
│   │   │   └── console.php        # Console commands
│   │   ├── config/                 # Configuration files
│   │   ├── database/               # Migrations, factories, seeders
│   │   ├── resources/              # Views, CSS, JavaScript
│   │   ├── storage/                # File storage (logs, uploads)
│   │   ├── tests/                  # PHPUnit tests
│   │   └── public/                 # Public assets
│   └── composer.json
├── frontend/                        # Next.js frontend
│   └── ai-front/
│       ├── src/
│       │   ├── app/               # Next.js app directory
│       │   ├── components/        # React components
│       │   ├── contexts/          # React contexts
│       │   ├── hooks/             # Custom React hooks
│       │   └── utils/             # Utility functions
│       ├── public/                # Static assets
│       ├── package.json           # Frontend dependencies
│       └── next.config.mjs        # Next.js configuration
├── vendor/                         # Root-level Composer dependencies
└── composer.json                   # Root composer configuration

```

##  Prerequisites

Before you begin, ensure you have the following installed:

### Backend Requirements
- **PHP 8.2** or higher
- **Composer** (latest version)
- **MySQL 8.0** or **PostgreSQL 12+** (or SQLite for development)
- **Git**

### Frontend Requirements
- **Node.js 18.17** or higher
- **npm** or **yarn** (npm comes with Node.js)
- **Git**

### Optional
- Docker (for containerized development)
- Laravel Sail (comes with Laravel)

##  Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AI-Generator
```

### 2. Backend Setup

```bash
cd backend/laravel

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create database and run migrations
php artisan migrate

# (Optional) Seed the database
php artisan db:seed
```

**Configure Database** in `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ai_generator
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Frontend Setup

```bash
cd frontend/ai-front

# Install Node dependencies
npm install

# Create .env.local if needed for API configuration
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
```

##  Running the Application

### Option 1: Using npm Scripts (from root directory)

```bash
# Terminal 1: Start backend
composer run start_back --timeout=0

# Terminal 2: Start frontend
composer run start_front --timeout=0
```

### Option 2: Manual Start

**Backend** (Terminal 1):
```bash
cd backend/laravel
php artisan serve
```
The backend will be available at `http://localhost:8000`

**Frontend** (Terminal 2):
```bash
cd frontend/ai-front
npm run dev
```
The frontend will be available at `http://localhost:3000`

### Production Build

**Backend:**
```bash
cd backend/laravel
php artisan config:cache
php artisan route:cache
```

**Frontend:**
```bash
cd frontend/ai-front
npm run build
npm start
```

##  Project Structure Details

### Backend (`/backend/laravel`)

#### App Directory
- **Http/Controllers**: Handle incoming requests and return responses
- **Models**: Eloquent models for database interaction
- **Providers**: Service providers for application bootstrapping
- **Utility**: Helper classes (e.g., `ImageDecoder.php` for image processing)

#### Configuration
- **config/app.php**: Application configuration
- **config/auth.php**: Authentication configuration
- **config/cors.php**: CORS settings
- **config/database.php**: Database connection settings
- **config/mail.php**: Email configuration
- **config/sanctum.php**: API authentication

#### Database
- **Migrations**: Schema definitions for database tables
- **Factories**: Model factories for testing
- **Seeders**: Database seeders for sample data

### Frontend (`/frontend/ai-front`)

#### Source Structure
- **app/**: Next.js app directory with page routes
- **components/**: Reusable React components
- **contexts/**: React context providers for state management
- **hooks/**: Custom React hooks
- **utils/**: Utility functions and helpers

#### Configuration Files
- **next.config.mjs**: Next.js configuration
- **tailwind.config.js**: Tailwind CSS customization
- **jsconfig.json**: JavaScript path aliases
- **eslint.config.mjs**: ESLint rules

## 🔌 API Endpoints

### Base URL
`http://localhost:8000/api`

### Common Endpoints

#### Images
- `GET /images` - List all images
- `GET /images/{id}` - Get image details
- `POST /images` - Create new image
- `PUT /images/{id}` - Update image
- `DELETE /images/{id}` - Delete image

#### Search (Pixabay Integration)
- `GET /search` - Search images from Pixabay
- `POST /generate` - Generate AI image

*Refer to [backend/laravel/routes/api.php](backend/laravel/routes/api.php) for complete API documentation*

##  Development

### Backend Development

#### Running Tests
```bash
cd backend/laravel
php artisan test
```

#### Code Formatting
```bash
cd backend/laravel
php artisan pint
```

#### Database Migrations
```bash
# Create new migration
php artisan make:migration create_table_name

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback
```

#### Tinker Console
```bash
cd backend/laravel
php artisan tinker
```

### Frontend Development

#### Code Formatting
```bash
cd frontend/ai-front
npm run format
```

#### Linting
```bash
cd frontend/ai-front
npx eslint src/
```

#### Building Components
```bash
# Components should be created in src/components/
# Use consistent naming: ComponentName.jsx
# Import Chakra UI and Tailwind CSS as needed
```

##  Environment Variables

### Backend (`.env`)
```
APP_NAME="AI-Generator"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ai_generator
DB_USERNAME=root
DB_PASSWORD=

CACHE_DRIVER=file
QUEUE_CONNECTION=sync

PIXABAY_API_KEY=your_pixabay_api_key
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

##  Additional Resources



##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Follow PSR-12 for PHP code
- Use ESLint and Prettier for JavaScript/React code
- Update documentation as needed



##  Support

For issues and questions:
1. Check existing issues on the repository
2. Create a detailed issue with reproduction steps
3. Include your environment information (OS, PHP version, Node version)

---



