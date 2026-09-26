# Event Management System

A full-stack **Event Management System** built with **React**, **Spring Boot**, and **MongoDB Atlas**. This platform allows users to browse, book, and manage event tickets, while organizers can publish and track their events, and admins can oversee the entire platform.

---

## Overview

The **Event Management System** is a modern, scalable web application designed to simplify the process of managing and booking events. It provides three distinct portals:

1. **User Portal** – Browse events, book tickets, manage bookings, and edit profiles.
2. **Organizer Portal** – Create, update, and monitor events with real-time analytics.
3. **Admin Portal** – Oversee all events, organizers, and platform analytics.

The system uses **MongoDB Atlas** (cloud database), making it easy for multiple developers to collaborate on the same dataset.

This project was built as a **team effort by 6 members**, each contributing across frontend, backend, database design, DevOps, and testing.

---

## Features

### User Features
- User registration and login with BCrypt password hashing
- Forgot password with email verification (6-digit code)
- Browse events by category (Concerts, Art & Drama, Sport & Adventure, Family & Others)
- Book tickets with multiple ticket tiers (Gold, Platinum, etc.)
- Apply early bird discounts
- View booking history and manage profile
- Dark/Light theme toggle

### Organizer Features
- Organizer registration with admin approval workflow
- Create and publish events with banner images
- Add multiple ticket tiers with pricing and capacity
- Real-time analytics dashboard:
  - Tickets sold vs. capacity
  - Total revenue
  - Sales velocity (bar chart)
  - Ticket tier breakdown (pie chart)
- Export attendee list as CSV
- Edit existing events

### Admin Features
- Admin dashboard with full event management
- View analytics for all events
- Edit/delete any event
- Approve organizer registrations

### Security
- BCrypt password hashing
- Spring Security configuration
- Session-based authentication
- Protected API endpoints
- Environment variable management for sensitive data

---

## Tech Stack

### Frontend
| Technology | Purpose |
| :--- | :--- |
| **React 19** | UI framework |
| **React Router DOM** | Client-side routing |
| **Recharts** | Data visualization (charts) |
| **Leaflet / React Leaflet** | Interactive maps for venue selection |
| **Axios / Fetch API** | HTTP requests |
| **CSS3** | Styling with dark/light themes |

### Backend
| Technology | Purpose |
| :--- | :--- |
| **Spring Boot 3.5.x** | Backend framework |
| **Spring Data MongoDB** | Database integration |
| **Spring Security** | Authentication & BCrypt |
| **Spring Mail** | Email verification codes |
| **Lombok** | Reduce boilerplate code |
| **Maven** | Build tool |

### Database
| Technology | Purpose |
| :--- | :--- |
| **MongoDB Atlas** | Cloud NoSQL database |

### DevOps
| Technology | Purpose |
| :--- | :--- |
| **Jenkins** | CI/CD automation |
| **Docker** | Containerization |
| **Docker Hub** | Image registry |
| **GitHub** | Version control |

---

## Architecture

```
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│                     │         │                     │         │                     │
│   React Frontend    │◄───────►│  Spring Boot API    │◄───────►│   MongoDB Atlas     │
│   (Port 3000)       │  REST   │  (Port 8081)        │  Driver │   (Cloud)           │
│                     │         │                     │         │                     │
└─────────────────────┘         └─────────────────────┘         └─────────────────────┘
        │                               │
        │                               │
        └─────────── Docker ────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Nginx (Port 80) │
            └─────────────────┘
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** or higher ([Download](https://adoptium.net/))
- **Node.js 16** or higher ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **IntelliJ IDEA** (Community Edition) or VS Code
- **MongoDB Atlas Account** ([Sign up free](https://www.mongodb.com/cloud/atlas))
- **Docker** (optional, for containerized deployment)
- **Jenkins** (optional, for CI/CD)

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/logout` | User logout |
| `GET` | `/api/auth/status` | Check login status |
| `POST` | `/api/auth/forgot-password` | Send verification code |
| `POST` | `/api/auth/verify-code` | Verify code |
| `POST` | `/api/auth/reset-password` | Reset password |

### Users

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/users/register` | User registration |
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/users/{id}` | Get user by ID |
| `PUT` | `/api/users/profile/{id}` | Update profile |
| `DELETE` | `/api/users/{id}` | Delete user |

### Events

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/events` | Get all events (filter by `?category=`) |
| `GET` | `/api/events/{id}` | Get event by ID |
| `GET` | `/api/events/organizer/{organizerId}` | Get events by organizer |
| `POST` | `/api/events` | Create event |
| `PUT` | `/api/events/{id}` | Update event |
| `DELETE` | `/api/events/{id}` | Delete event |

### Organizers

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/organizers/register` | Organizer registration |
| `POST` | `/api/organizers/login` | Organizer login |

### Bookings

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/bookings/history/{userId}` | Get booking history |
| `GET` | `/api/bookings/event/{eventId}/stats` | Get event stats |
| `GET` | `/api/bookings/event/{eventId}/attendees` | Get attendees |

---

## Project Structure

```
Event-Management-System/
├── Backend/
│   └── event-management-system/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/eventmanagement/
│       │   │   │   ├── config/
│       │   │   │   │   └── SecurityConfig.java
│       │   │   │   ├── controller/
│       │   │   │   │   ├── AuthController.java
│       │   │   │   │   ├── UserController.java
│       │   │   │   │   ├── EventController.java
│       │   │   │   │   └── OrganizerController.java
│       │   │   │   ├── dto/
│       │   │   │   │   ├── LoginRequest.java
│       │   │   │   │   ├── RegisterRequest.java
│       │   │   │   │   └── ForgotPasswordRequest.java
│       │   │   │   ├── entity/
│       │   │   │   │   ├── User.java
│       │   │   │   │   ├── Event.java
│       │   │   │   │   └── TicketTier.java
│       │   │   │   ├── repository/
│       │   │   │   │   ├── UserRepository.java
│       │   │   │   │   └── EventRepository.java
│       │   │   │   ├── service/
│       │   │   │   │   ├── UserService.java
│       │   │   │   │   ├── EventService.java
│       │   │   │   │   ├── AuthService.java
│       │   │   │   │   └── PasswordResetService.java
│       │   │   │   └── EventManagementSystemApplication.java
│       │   │   └── resources/
│       │   │       └── application.properties
│       ├── pom.xml
│       └── Dockerfile
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal/
│   │   │   ├── ForgotPasswordModal/
│   │   │   ├── OrganizerAuthModal/
│   │   │   ├── EventCard/
│   │   │   ├── Header/
│   │   │   └── Footer/
│   │   ├── pages/
│   │   │   ├── LandingPage/
│   │   │   ├── UserDashboard/
│   │   │   ├── OrganizerDashboard/
│   │   │   ├── OrganizerEventStatsPage/
│   │   │   ├── AdminPortal/
│   │   │   └── AddEventPage/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── Jenkinsfile
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## CI/CD Pipeline

This project uses **Jenkins** for Continuous Integration and Continuous Deployment.

### Pipeline Stages

1. **Checkout** – Pull the latest code from GitHub.
2. **Build Backend** – Compile Spring Boot with Maven.
3. **Build Frontend** – Build React with npm.
4. **Build Docker Images** – Create Docker images for backend and frontend.
5. **Push to Docker Hub** – Push images to Docker Hub.
6. **Deploy to App Server** – SSH into the App Server and run containers.

### Setting Up Jenkins

1. Install **Jenkins** on an Ubuntu VM.
2. Install the **Docker Pipeline** plugin.
3. Add Docker Hub credentials (`docker-hub-credentials`).
4. Add MongoDB URI as a secret (`mongodb-uri`).
5. Create a new Pipeline job pointing to your GitHub repository.

See `Jenkinsfile` in the repository for the full pipeline definition.

---

## Docker Deployment

### Build Docker Images

```bash
# Backend
docker build -t your-dockerhub-username/event-backend:latest -f Backend/event-management-system/Dockerfile Backend/event-management-system/

# Frontend
docker build -t your-dockerhub-username/event-frontend:latest -f frontend/Dockerfile frontend/
```

### Run Containers

```bash
# Create a network
docker network create app-network

# Run Backend
docker run -d -p 8081:8081 \
  --name backend-container \
  --network app-network \
  -e MONGODB_URI="your-mongodb-uri" \
  your-dockerhub-username/event-backend:latest

# Run Frontend
docker run -d -p 80:80 \
  --name frontend-container \
  --network app-network \
  your-dockerhub-username/event-frontend:latest
```

### Docker Compose

Use the provided `docker-compose.yml` for easy multi-container deployment:

```bash
docker-compose up -d
```

---

## Screenshots

### Landing Page
*(Add screenshot of your landing page here)*

### User Dashboard
*(Add screenshot of your user dashboard here)*

### Organizer Dashboard
*(Add screenshot of your organizer dashboard here)*

### Event Analytics
*(Add screenshot of your analytics page here)*

### Admin Portal
*(Add screenshot of your admin portal here)*

---

## Contact

**Vikum Prabhath**

- GitHub: [@VikumPrabhath](https://github.com/VikumPrabhath)
- Email: vikumprabhath4@gmail.com

**Project Link:** [https://github.com/VikumPrabhath/Event-Management-System](https://github.com/VikumPrabhath/Event-Management-System)

---

## Acknowledgements

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Docker Documentation](https://docs.docker.com/)

---
