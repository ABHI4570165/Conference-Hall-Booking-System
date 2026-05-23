# 🏢 HallBook – Smart Conference Hall Booking Management System

A modern, fully functional conference hall booking system built with **React.js**, **Tailwind CSS**, and **LocalStorage**. Designed with a professional SaaS-grade UI.

---

## 📸 Preview

- **Home Page** — Hero section with search, hall type filters, featured spaces
- **Hall Listing** — Grid/list view with real-time filters, search, and availability
- **Hall Details** — Full detail page with booking modal and conflict detection
- **User Dashboard** — Booking stats, upcoming events, history
- **Admin Dashboard** — Analytics, hall utilization charts, approval workflow
- **Manage Halls** — Full CRUD: add, edit, delete, update availability
- **Manage Bookings** — Approve / Reject bookings with detail view
- **Profile Page** — Edit profile info and change password

---

## ✨ Features

### Authentication
- Login / Register with form validation
- Role-based access control (Admin / User)
- Protected and public-only routes
- Session persistence via LocalStorage

### Hall Management (Admin)
- Add, edit, delete conference halls
- 7 hall types: Conference Hall, Seminar Hall, Meeting Room, Auditorium, Training Room, Board Room, Event Hall
- 10 facility options: AC, WiFi, Projector, Smart Board, Parking, Sound System, CCTV, Generator Backup, Video Conferencing, Whiteboard
- Availability status management: Available / Booked / Under Maintenance

### Booking System
- Date, start-time, end-time selection
- **Real-time conflict detection** — prevents double-booking
- Auto-calculated duration and total cost
- Purpose-of-booking field
- Booking status workflow: Pending → Approved / Rejected / Cancelled
- Users can cancel their own pending/approved bookings

### Search & Filtering
- Full-text search by hall name, type, location
- Filter by: hall type, availability, min capacity, max price, facilities
- URL-based filter persistence (shareable links)
- Active filter badges with one-click removal

### Dashboards
- **User Dashboard:** Total, upcoming, approved, cancelled booking counts; spending summary
- **Admin Dashboard:** System-wide stats, pending booking alerts, recent bookings table, hall utilization bars, most booked hall

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router DOM v6 | Client-side routing |
| Context API | Global state management |
| LocalStorage | Data persistence |
| Tailwind CSS v3 | Utility-first styling |
| Lucide React | Icon library |
| Google Fonts (Sora + DM Sans) | Typography |

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.x
- npm >= 8.x

### Installation

```bash
# 1. Clone or extract the project
cd conference-booking

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at **http://localhost:3000**

### Default Credentials

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@gmail.com | admin123 |
| User  | arjun@gmail.com | user123 |
| User  | priya@gmail.com | user123 |

---

## 📁 Project Structure

```
src/
├── assets/              # Static assets
├── components/          # Reusable UI components
│   ├── Navbar.js        # Top navigation bar
│   ├── Sidebar.js       # Dashboard sidebar with collapse
│   ├── HallCard.js      # Hall listing card
│   ├── BookingModal.js  # Booking popup with conflict check
│   ├── FilterSidebar.js # Hall search filter panel
│   ├── Toast.js         # Toast notification system
│   └── LoadingSpinner.js
├── context/             # React Context providers
│   ├── AuthContext.js   # Authentication state
│   ├── HallContext.js   # Hall CRUD state
│   ├── BookingContext.js# Booking state + conflict detection
│   └── ToastContext.js  # Notification state
├── data/
│   └── sampleData.js    # Seed data (halls, users, bookings)
├── layouts/
│   └── DashboardLayout.js # Sidebar + outlet layout
├── pages/
│   ├── HomePage.js
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   ├── HallListingPage.js
│   ├── HallDetailsPage.js
│   ├── BookingSuccessPage.js
│   ├── UserDashboard.js
│   ├── UserBookingsPage.js
│   ├── AdminDashboard.js
│   ├── ManageHallsPage.js
│   ├── ManageBookingsPage.js
│   ├── AdminUsersPage.js
│   ├── ProfilePage.js
│   └── NotFoundPage.js
├── routes/
│   ├── AppRoutes.js     # Centralized route definitions
│   └── ProtectedRoute.js# Auth + role guards
├── utils/
│   ├── helpers.js       # Formatting, conflict detection, etc.
│   └── localStorage.js  # CRUD wrappers for LocalStorage
├── App.js
├── index.js
└── index.css            # Tailwind directives + custom CSS
```

---

## 🔐 Role-Based Access

| Feature | User | Admin |
|---------|------|-------|
| Browse halls | ✅ | ✅ |
| Book a hall | ✅ | ✅ |
| View own bookings | ✅ | ✅ |
| Cancel own bookings | ✅ | ✅ |
| View all bookings | ❌ | ✅ |
| Approve/reject bookings | ❌ | ✅ |
| Add/edit/delete halls | ❌ | ✅ |
| View all users | ❌ | ✅ |
| View analytics | ❌ | ✅ |

---

## 📦 Build for Production

```bash
npm run build
```

Output will be in the `/build` folder, ready for deployment.

---

## 📝 License

MIT — Free for academic and personal use.
