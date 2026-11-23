# 🎓 CampusConnect – Smart Campus Management & Student Support Platform

> A modern, centralized web-based platform bridging the communication gap between college students and university administration. Empowering students with real-time complaint tracking, community lost-and-found, interactive facility maps, and circular notifications, while equipping administrators with responsive oversight tools and actionable analytics.

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-blue?logo=react)](https://react.dev)
[![Node](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?logo=node.js)](https://nodejs.org)
[![Firebase](https://img.shields.io/badge/Database-Firebase%20Firestore-orange?logo=firebase)](https://firebase.google.com)
[![Status](https://img.shields.io/badge/Hackathon-Ready%20%E2%9C%94-success)](#)

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Problem Statement & Solution](#-problem-statement--proposed-solution)
3. [Key Features](#-key-features)
4. [Technology Stack](#-technology-stack)
5. [System Architecture](#-system-architecture)
6. [Folder & File Structure](#-folder--file-structure)
7. [Getting Started & Installation](#-getting-started--installation)
8. [Configuration & Environment Variables](#-configuration--environment-variables)
9. [Firebase Setup Instructions](#-firebase-setup-instructions)
10. [Google Maps API Setup](#-google-maps-api-setup)
11. [Hackathon Demo & Evaluation Guide](#-hackathon-demo--evaluation-guide)
12. [REST API Documentation](#-rest-api-documentation)
13. [Security & Role-Based Access Control](#-security--role-based-access-control)
14. [Future Scope](#-future-scope)

---

## 🌟 Project Overview

**CampusConnect** is a centralized, full-stack digital campus ecosystem designed to modernize college operations and streamline student communication. 

In most university campuses today, issue reporting (electrical failures, Wi-Fi connectivity dropouts, broken lab equipment, plumbing breakdowns) remains fragmented across informal WhatsApp groups, physical registers, or overlooked emails. **CampusConnect** replaces this with an audited, ticketed workflow complete with auto-generated IDs, photo evidence uploads, multi-stage timeline tracking, campus-wide circular broadcasts, and interactive facility mapping.

---

## 💡 Problem Statement & Proposed Solution

### The Challenge:
- **Lack of Accountability**: Students report campus issues verbally or on paper without tracking IDs or timestamps.
- **Opacity**: Students rarely know whether maintenance requests have been acknowledged, scheduled, or assigned to technicians.
- **Fragmented Announcements**: Exam schedules, hackathons, and emergency maintenance notices get lost across disparate bulletin boards.
- **Misplaced Belongings**: Lost items in libraries and classrooms depend on unorganized social media threads.
- **Administrative Blind Spots**: College management lacks centralized metrics on repair turnaround times, recurring departmental issues, and campus facility health.

### The Solution:
- **Unique Tracked Tickets (`CMP-2026-XXXX`)**: Every student complaint receives an immutable ticket with visual milestone tracking (Submitted → Under Review → In Progress → Resolved → Rejected).
- **Role-Based Access Control**: Strict segregation between Student self-service portals and verified Administrator command consoles.
- **Interactive Campus Navigation**: Vector campus layout overlaying live active complaints per building with Google Maps integration.
- **Community Lost & Found**: Verified reporting, photo attachments, and status claims.
- **Visual Analytics Dashboard**: Interactive Recharts graphs illustrating issue trends, category breakdowns, and average SLA resolution velocities.

---

## 🚀 Key Features

### 👨‍🎓 Student Workspace
- **Personalized Dashboard**: Real-time counter of submitted, pending, and resolved issues, upcoming hackathon events, and latest notices.
- **Interactive Issue Reporting Form**:
  - Categories: *Classroom Maintenance, Electricity Problems, Water Supply, Cleanliness, Washroom Issues, Internet / Wi-Fi, Laboratory Issues, Furniture Damage, Other*.
  - Priority levels (*Low, Medium, High, Urgent*).
  - Building selection, room number input, and photo evidence upload with instant preview.
  - Automatic ticket generation (e.g., `CMP-2026-1001`).
- **Real-Time Complaint Tracking**: Visual progress timeline showing chronological timestamps, department assignment, and administration remarks.
- **Lost & Found Hub**: Post lost or found possessions, search by category, and mark items as claimed.
- **Campus Circulars & Announcements**: Filter notices by category (*Academic, Facility, Events, General*), with urgent notices pinned prominently.
- **College Events & Hackathons**: Browse upcoming university events, view dates and venue, and register RSVP with instant attendance counters.
- **Campus Map**: Locate departments, study pods, food courts, and labs, with building-specific ticket overlays.
- **In-App Notification Center**: Instant unread badge alerts for ticket updates, circulars, and event reminders.
- **Dark / Light Mode**: Seamless theme switching with persistent CSS variable tokens.

### 🛡️ Administrator Command Center
- **Executive Metrics & KPIs**: Total registered students, total complaints, pending issues, in-progress repairs, resolved tickets, and average resolution time in hours.
- **Complaints Management Queue**:
  - Filter by status, priority, and category.
  - Search by complaint ID, student roll number, or keywords.
  - Change ticket status and enter official administrative remarks.
  - Delete or archive inappropriate submissions.
  - **1-Click CSV Export**: Download comprehensive CSV spreadsheets for audit reviews.
- **Student Directory Management**: Browse registered student accounts, departments, and roll numbers.
- **Publish & Manage Announcements**: Create, edit, and delete circulars with priority flags and pinned alerts.
- **Event Management**: Create campus events with date pickers, venues, descriptions, and registration links.
- **Lost & Found Moderation**: Review student listings and manage resolved items.
- **Visual Analytics (Recharts)**:
  - Monthly inflow vs. resolution velocity area charts.
  - Status distribution donut charts.
  - Issue breakdown by category.
  - Departmental complaint volume comparison.
- **Immutable Audit Trail**: Real-time stream of administrative actions and status transitions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM v6, Lucide React, Recharts |
| **Styling** | Modular pure CSS3 (separate `.css` files per feature, CSS variables for theming, responsive layout) |
| **Backend** | Node.js, Express.js (ES Modules), CORS, Morgan |
| **Database** | Firebase Firestore (with high-fidelity persistent local JSON database fallback for zero-setup demoing) |
| **Authentication** | Firebase Authentication (with role-based access control and demo switcher) |
| **Mapping & APIs** | Google Maps API & Interactive SVG Campus Vector Canvas |

---

## 🏗️ System Architecture

```
                                  [ College Students ]
                                           │
                                  [ React.js Frontend ]
                                  (Vite / Port: 5173)
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
             [ Auth & Theme Context ]                [ REST API Services ]
             - Firebase Client SDK                   - Bearer Token Interceptor
             - Notification Center                   - Image Uploader & Parser
                        │                                     │
                        └──────────────────┬──────────────────┘
                                           │ HTTP / JSON
                                           ▼
                                  [ Express.js Backend ]
                                  (Node.js / Port: 5001)
                                           │
                  ┌────────────────────────┼────────────────────────┐
                  ▼                        ▼                        ▼
        [ Auth Middleware ]      [ Business Controllers ]     [ Security Rules ]
        - Bearer verification    - Complaints CRUD           - Role Verification
        - Role Guard (Admin)     - Announcements & Events    - Token Validation
        - Student isolation      - Analytics Engine          - Input Sanitization
                  │                        │                        │
                  └────────────────────────┼────────────────────────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
          [ Live Firebase Firestore ]            [ Resilient Fallback Engine ]
          - users, complaints, events            - Instant Out-Of-The-Box Demo
          - notifications, activityLogs          - Pre-seeded Realistic Data
```

---

## 📁 Folder & File Structure

CampusConnect strictly adheres to professional separation of concerns. Every language and responsibility is partitioned into separate files:

```
CampusConnect/
├── backend/
│   ├── config/
│   │   └── firebase.js                 # Firebase Admin SDK & DB initialization
│   ├── controllers/
│   │   ├── authController.js           # Student/Admin login, register, profile
│   │   ├── complaintController.js      # Complaints CRUD, status updates, CSV
│   │   ├── announcementController.js   # Official announcements CRUD
│   │   ├── eventController.js          # Campus events & RSVP registration
│   │   ├── lostFoundController.js      # Lost & found reporting and claiming
│   │   ├── analyticsController.js      # Recharts KPI aggregation engine
│   │   ├── userController.js           # Student management & profiles
│   │   └── notificationController.js   # In-app notifications
│   ├── middleware/
│   │   └── authMiddleware.js           # Bearer token verification & admin guards
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── announcementRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── lostFoundRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── userRoutes.js
│   │   └── notificationRoutes.js
│   ├── services/
│   │   └── dbService.js                # Database abstraction layer & seed store
│   ├── data/
│   │   └── db.json                     # Persistent local storage
│   ├── server.js                       # Express application gateway
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   ├── assets/
│   │   │   └── favicon.svg             # CampusConnect graduation cap branding
│   │   └── index.html
│   ├── src/
│   │   ├── components/                 # Reusable modular UI components
│   │   │   ├── Navbar.jsx              # Top bar, notifications, dark mode
│   │   │   ├── Sidebar.jsx             # Role-based navigation drawer
│   │   │   ├── StatCard.jsx            # Metric highlight cards
│   │   │   ├── StatusBadge.jsx         # Color-coded ticket status pills
│   │   │   ├── PriorityBadge.jsx       # Low/Medium/High/Urgent badges
│   │   │   ├── Timeline.jsx            # Interactive resolution tracking timeline
│   │   │   ├── Modal.jsx               # Accessible dialog modal
│   │   │   ├── ConfirmationModal.jsx   # Deletion / destructive confirmation
│   │   │   ├── EmptyState.jsx          # Visual empty placeholder
│   │   │   ├── LoadingSkeleton.jsx     # Shimmer skeleton loader
│   │   │   └── ComplaintDetailModal.jsx# Full ticket viewer & admin status changer
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # User state, login, register, demoLogin
│   │   │   ├── NotificationContext.jsx # Live notifications & toast manager
│   │   │   └── ThemeContext.jsx        # Dark/Light theme provider
│   │   ├── layouts/
│   │   │   ├── StudentLayout.jsx       # Student shell with sidebar & navbar
│   │   │   ├── AdminLayout.jsx         # Admin shell with security guards
│   │   │   └── AuthLayout.jsx          # Centered card layout for login/register
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx         # Modern marketing & hero presentation
│   │   │   ├── CampusMap.jsx           # Interactive campus map & complaint overlay
│   │   │   ├── auth/
│   │   │   │   ├── StudentLogin.jsx    # Student login + 1-click judge demo
│   │   │   │   ├── StudentRegister.jsx # Multi-field registration
│   │   │   │   ├── AdminLogin.jsx      # Admin login + 1-click admin demo
│   │   │   │   └── ForgotPassword.jsx  # College email password reset
│   │   │   ├── student/
│   │   │   │   ├── StudentDashboard.jsx# Metrics, quick actions, recent tickets
│   │   │   │   ├── ReportIssue.jsx     # Issue reporting form with photo upload
│   │   │   │   ├── MyComplaints.jsx    # Student complaint history & tracking
│   │   │   │   ├── StudentLostFound.jsx# Community lost & found items
│   │   │   │   ├── StudentAnnouncements.jsx # Campus circulars
│   │   │   │   ├── StudentEvents.jsx   # Upcoming hackathons & RSVP
│   │   │   │   └── StudentProfile.jsx  # Account details & academic roll
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx  # Administrative KPIs & audit feed
│   │   │       ├── ManageComplaints.jsx# Filter, search, status change, remarks
│   │   │       ├── ManageStudents.jsx  # Student directory management
│   │   │       ├── ManageAnnouncements.jsx # Circular publisher
│   │   │       ├── ManageEvents.jsx    # Campus event creator
│   │   │       ├── ManageLostFound.jsx # Lost & found post moderation
│   │   │       └── AdminAnalytics.jsx  # Recharts visualizations & graphs
│   │   ├── services/
│   │   │   ├── api.js                  # Centralized REST client
│   │   │   └── firebase.js             # Firebase client SDK initialization
│   │   ├── styles/                     # Pure CSS styling (no inline JSX css)
│   │   │   ├── index.css               # CSS variables, typography, reset
│   │   │   ├── components.css          # Buttons, badges, modals, toasts
│   │   │   ├── sidebar.css             # Navigation & layout styles
│   │   │   ├── dashboard.css           # Stat cards, quick actions, activity lists
│   │   │   ├── complaints.css          # Forms, dropzones, tables, timelines
│   │   │   ├── auth.css                # Login/register cards, demo boxes
│   │   │   ├── landing.css             # Hero section, feature grid, footer
│   │   │   ├── map.css                 # Vector canvas, facility pins, cards
│   │   │   └── modules.css             # Events cards, lost & found, circulars
│   │   ├── App.jsx                     # Route architecture & providers
│   │   └── main.jsx                    # Application entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   └── .env.example
│
├── firebase/
│   ├── firestore.rules                 # Production Firestore security rules
│   └── firestore.indexes.json          # Compound indexing declarations
│
├── package.json                        # Root package with concurrent run scripts
├── .gitignore
└── README.md
```

---

## ⚡ Getting Started & Installation

### Prerequisites
- **Node.js** v18+ (tested on Node v20/v24)
- **npm** v9+

### 1. Clone & Install Dependencies
Run the universal installer from the project root:
```bash
cd CampusConnect

# Install all dependencies (root, backend, and frontend) in one command:
npm run install:all
```

Or install individually:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Start Frontend & Backend Concurrently
Run both servers with a single command from the root directory:
```bash
npm start
```
- **Frontend** will start on: `http://localhost:5173`
- **Backend API Gateway** will start on: `http://localhost:5001`
- **Health Check**: `http://localhost:5001/api/health`

Alternatively, you can run them in separate terminal windows:
```bash
# Terminal 1 - Backend:
cd backend
npm run dev

# Terminal 2 - Frontend:
cd frontend
npm run dev
```

---

## 🔐 Configuration & Environment Variables

### Backend Configuration (`backend/.env`):
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Optional: Path to Firebase Service Account JSON (if using live Firestore)
FIREBASE_SERVICE_ACCOUNT_KEY=./config/serviceAccountKey.json

# Optional: Or provide credentials directly via environment variables
FIREBASE_PROJECT_ID=campusconnect-demo
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Master Admin Email
ADMIN_EMAIL=admin@campusconnect.edu
```

### Frontend Configuration (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5001/api

# Optional: Google Maps JavaScript API key (fallback vector map operates if left empty)
VITE_GOOGLE_MAPS_API_KEY=

# Optional: Firebase Client Config (for direct client SDK queries)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=campusconnect-demo
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## ☁️ Firebase Setup Instructions

CampusConnect is engineered with a **dual-engine database architecture**:
1. **Out-of-the-Box Mode (Default)**: Automatically runs with the persistent local engine pre-populated with realistic student accounts, ongoing complaints, announcements, events, and audit logs. Judges can evaluate the full system without configuring keys!
2. **Production Firebase Mode**: Seamlessly switches to Google Firebase Firestore & Firebase Authentication as soon as credentials are added.

### Steps to connect your live Firebase project:
1. Navigate to the [Firebase Console](https://console.firebase.google.com/) and create a project named `CampusConnect`.
2. Enable **Firebase Authentication** and enable the **Email/Password** sign-in provider.
3. Enable **Cloud Firestore Database** in production mode.
4. Go to **Project Settings** → **Service Accounts** → click **Generate new private key**.
5. Save the downloaded JSON file as:
   ```
   CampusConnect/backend/config/serviceAccountKey.json
   ```
6. Deploy the Firestore security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
7. Copy your Web App configuration keys into `frontend/.env`.

---

## 🗺️ Google Maps API Setup

1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Maps JavaScript API** and **Maps Embed API**.
3. Create an API Key under **Credentials**.
4. Paste the key into `frontend/.env`:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=AIzaSy...YourKey...
   ```
> **Graceful Fallback Included**: If no Google Maps API key is configured, CampusConnect automatically displays the high-fidelity interactive SVG Vector Map showing all campus blocks, departments, facilities, and active complaint pins. No broken UI!

---

## 🏆 Hackathon Demo & Evaluation Guide

To make evaluation frictionless for judges, CampusConnect includes built-in **1-Click Demo Buttons** on both student and admin login pages:

### Pre-configured Demo Accounts:
| Role | Name | Email | Password | Access Level |
|---|---|---|---|---|
| **Administrator** | Dr. Arvind Sharma | `admin@campusconnect.edu` | `demoPassword123` | Full Admin Console, Analytics, Status Overrides, Student Directory |
| **Student** | Aarav Patel | `aarav.patel@campusconnect.edu` | `demoPassword123` | Student Workspace, Report Issues, View Complaints, Lost & Found |
| **Student (Alt)** | Priya Sundaram | `priya.sundaram@campusconnect.edu` | `demoPassword123` | Student Workspace |

### Suggested Judge Evaluation Walkthrough (3-Minute Tour):
1. **Landing Page (`/`)**: Inspect the modern SaaS presentation, feature cards, and workflow timeline.
2. **Student Login (`/login`)**: Click the **"1-Click Student Demo"** button to log in instantly as *Aarav Patel*.
3. **Report an Issue (`/student/report`)**:
   - Click one of the **Quick Demo Presets** (e.g., *"Lab 202 AC not cooling"*) to autofill the form.
   - Attach a sample photo or use the preset evidence.
   - Click **Submit Complaint** → Watch the instant ticket ID (`CMP-2026-XXXX`) generated.
4. **Track Complaint Timeline (`/student/complaints`)**:
   - Click **View Details** on any ticket. Observe the visual step progression timeline with timestamps.
5. **Switch to Admin Portal (`/admin/login`)**:
   - Log out, navigate to `/admin/login`, and click **"1-Click Administrator Access"**.
6. **Triage & Update Status (`/admin/complaints`)**:
   - Open the newly submitted complaint.
   - Change status to **"In Progress"** and add administrative remarks: *"Technician dispatched with replacement capacitor."*
   - Save update → Notice the student receives an in-app notification and audit trail updates immediately!
7. **Analytics & CSV (`/admin/analytics`)**:
   - Inspect the Recharts area chart, status donut chart, and department-wise issue breakdown.
   - Click **Export CSV** to download the official maintenance spreadsheet.
8. **Interactive Campus Map (`/student/map`)**:
   - Click on different building pins (*Academic Block A, Library, Engineering Labs*) to view departments, amenities, and live active complaints by location.

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new student account | Public |
| `POST` | `/api/auth/login` | Authenticate student or admin | Public |
| `GET` | `/api/auth/me` | Fetch active user profile from token | Authenticated |
| `POST` | `/api/auth/forgot-password` | Dispatch password reset link | Public |

### Complaints (`/api/complaints`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/complaints` | Fetch complaints (filtered by student for students, all for admin) | Authenticated |
| `GET` | `/api/complaints/:id` | Fetch detailed complaint and timeline | Authenticated |
| `POST` | `/api/complaints` | Submit a new issue ticket | Student / Admin |
| `PATCH` | `/api/complaints/:id/status`| Update status & record admin remarks | Admin Only |
| `DELETE` | `/api/complaints/:id` | Delete or archive ticket | Admin Only |
| `GET` | `/api/complaints/export/csv` | Download CSV audit spreadsheet | Admin Only |

### Announcements (`/api/announcements`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/announcements` | Retrieve all active circulars | Public / Authenticated |
| `POST` | `/api/announcements` | Publish new campus announcement | Admin Only |
| `PUT` | `/api/announcements/:id` | Edit announcement details | Admin Only |
| `DELETE` | `/api/announcements/:id` | Remove announcement | Admin Only |

### Events (`/api/events`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/events` | List events (`filter=upcoming/past/all`) | Public / Authenticated |
| `POST` | `/api/events` | Create new campus event | Admin Only |
| `PUT` | `/api/events/:id` | Update event information | Admin Only |
| `DELETE` | `/api/events/:id` | Remove event | Admin Only |
| `POST` | `/api/events/:id/register`| Student RSVP registration | Authenticated |

### Lost & Found (`/api/lost-found`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/lost-found` | Browse lost & found items | Public / Authenticated |
| `POST` | `/api/lost-found` | Report lost or found item | Authenticated |
| `PATCH` | `/api/lost-found/:id/status`| Mark item as claimed or returned | Item Owner / Admin |
| `DELETE` | `/api/lost-found/:id` | Remove listing | Item Owner / Admin |

### Analytics & Notifications
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/analytics` | Get aggregate KPIs, charts, and audit logs | Admin Only |
| `GET` | `/api/notifications` | Fetch unread and read notifications | Authenticated |
| `PATCH` | `/api/notifications/:id/read` | Mark single notification as read | Authenticated |
| `PATCH` | `/api/notifications/read-all`| Mark all notifications as read | Authenticated |

---

## 🔒 Security & Role-Based Access Control

- **Server-Side Token Verification**: Authentication headers are validated on every request (`Authorization: Bearer <token>`).
- **No Client-Side Admin Elevation**: Students cannot select an "admin" role during registration; administrative privileges are strictly granted via backend verification or database role claims.
- **Student Data Isolation**: Students can only view their own complaint history and edit their own lost-and-found listings.
- **Immutable Audit Logging**: Every ticket creation, status change, and announcement publication is logged into `activityLogs` with timestamp and user attribution.
- **Production Firestore Rules**: Complete `firestore.rules` implemented with granular read/write rules for each collection.

---

## 🔮 Future Scope

- **AI-Powered Complaint Prioritization**: Automated priority scoring and routing using Gemini 1.5 Pro to detect urgent safety hazards from photo uploads.
- **Mobile Push Notifications**: Firebase Cloud Messaging (FCM) integration for mobile alerts when technicians arrive on site.
- **QR Code Scanning**: QR codes posted on classroom doors and equipment pods to auto-populate room numbers and building details.
- **Technician Mobile Companion**: Dedicated maintenance staff portal with barcode scanner and before/after verification photos.

---

## 👨‍💻 Author & Acknowledgments
Built with ❤️ for College Hackathon Presentation.

*CampusConnect – Making campus management smarter, faster, and transparent.*

