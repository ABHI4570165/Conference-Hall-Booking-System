<div align="center">

<img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img src="https://img.shields.io/badge/React_Router-6.22.0-CA4245?style=for-the-badge&logo=react-router&logoColor=white" />
<img src="https://img.shields.io/badge/Context_API-Built--in-764ABC?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/LocalStorage-Data_Layer-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />

# 🏢 HallBook — Smart Conference Hall Booking Management System

**A modern, full-featured conference hall booking platform built entirely on the frontend.**  
Browse spaces · Book instantly · Manage with a powerful admin panel · Zero backend required.

[✨ Features](#-features) · [🛠 Tech Stack](#-tech-stack) · [🚀 Quick Start](#-quick-start) · [📁 Project Structure](#-project-structure) · [🔐 Roles & Access](#-roles--access)

</div>

---

## 📌 Project Description

**HallBook** is a Smart Conference Hall Booking Management System — a web-based application that automates and streamlines the process of reserving conference halls, meeting rooms, auditoriums, and other shared spaces within colleges, offices, and organizations.

The system eliminates manual booking registers, scheduling conflicts, and phone-based reservations by providing a real-time digital booking platform. Users can browse available spaces, check live availability, and make instant bookings. Administrators get a powerful dashboard with analytics, approval workflows, and complete hall management tools.

Built as a **BCA / MCA Final Year Project**, the entire application runs on the frontend using **React.js** and **LocalStorage** — no server, no database, no cloud setup required.

---

## ✨ Features

### 🔐 Authentication & Security
- Secure Login and Registration with full form validation
- Role-based access control — **Admin** and **User** portals
- Protected routes with automatic redirection
- Session persistence via LocalStorage
- Password change functionality with current password verification

### 🏛️ Hall Management *(Admin)*
- Add, Edit, and Delete conference spaces
- **7 Hall Types:** Conference Hall · Seminar Hall · Meeting Room · Auditorium · Training Room · Board Room · Event Hall
- **10 Facility Options:** AC · WiFi · Projector · Smart Board · Parking · Sound System · CCTV · Generator Backup · Video Conferencing · Whiteboard
- Manage availability status: `Available` · `Booked` · `Under Maintenance`
- Rich hall cards with images, pricing, and facility badges

### 📅 Booking System
- Date, start-time, and end-time selection with time slot picker
- ⚡ **Real-time conflict detection** — algorithmically prevents double-booking
- Auto-calculated duration and total cost summary
- Purpose-of-booking field for record keeping
- Full booking lifecycle: `Pending → Approved / Rejected / Cancelled`
- Users can cancel their own Pending or Approved bookings

### 🔍 Smart Search & Filtering
- Full-text search by hall name, type, and location
- Filter by: Hall Type · Availability · Min Capacity · Max Price · Facilities
- URL-encoded filters (shareable links)
- Active filter badges with one-click removal
- Grid and List view toggle

### 📊 Dashboards & Analytics
- **User Dashboard:** Booking stats, total spent, upcoming events, recent history
- **Admin Dashboard:** System-wide stats, pending alerts, recent bookings table, hall utilization bar chart, most booked hall, booking status breakdown
- **Manage Bookings:** Status tabs, search, approve/reject with detail modal
- **Manage Users:** User directory with per-user booking counts and spending
- **Analytics:** Hall utilization bars, revenue tracking, booking distribution

### 🎨 UI & Design
- Professional dark SaaS aesthetic with amber accent color
- Fully **responsive** — desktop, tablet, and mobile
- Collapsible sidebar with icon-only mode
- Toast notifications for every user action
- Loading spinners and smooth CSS animations
- Google Fonts — **Sora** (headings) + **DM Sans** (body)

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React.js** | 18.2.0 | Core UI framework, functional components |
| **React Router DOM** | 6.22.0 | Client-side routing, protected routes, nested layouts |
| **Context API** | Built-in | Global state — Auth, Halls, Bookings, Toasts |
| **Tailwind CSS** | 3.4.1 | Utility-first styling, responsive design |
| **PostCSS** | 8.4.35 | CSS processing pipeline for Tailwind |
| **Autoprefixer** | 10.4.17 | Cross-browser CSS compatibility |
| **Lucide React** | 0.383.0 | Icon library — 400+ clean SVG icons |
| **LocalStorage API** | Browser-native | Data persistence layer (no backend needed) |
| **Google Fonts** | CDN | Sora + DM Sans typography |

### React Hooks Used
| Hook | Usage |
|---|---|
| `useState` | Form fields, toggle states, loading indicators |
| `useEffect` | Load data from LocalStorage on mount, availability checks |
| `useContext` | Consume Auth, Hall, Booking, Toast contexts |
| `useMemo` | Memoize filtered hall lists, dashboard statistics |
| `useCallback` | Memoize context functions to prevent re-renders |
| `useNavigate` | Programmatic navigation after login, booking |
| `useParams` | Read hall ID from URL |
| `useLocation` | Access navigation state (booking success data) |
| `useSearchParams` | URL-based filter state |

---

## 🚀 Quick Start

### Prerequisites
Make sure you have these installed:

```bash
node --version   # v16.x or higher
npm --version    # v8.x or higher
```

> Download Node.js from https://nodejs.org

### Installation & Run

```bash
# Step 1 — Enter the project folder
cd conference-booking

# Step 2 — Install all dependencies
npm install

# Step 3 — Start the development server
npm start
```

The app opens automatically at **http://localhost:3000**

### Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 🔑 **Admin** | admin@gmail.com | admin123 |
| 👤 **User** | arjun@gmail.com | user123 |
| 👤 **User** | priya@gmail.com | user123 |

> You can also register a brand-new user account from the Register page.

---

## 📁 Project Structure

```
conference-booking/
│
├── public/
│   └── index.html                  # Google Fonts loaded here
│
├── src/
│   ├── App.js                      # Root component — wraps all providers
│   ├── index.js                    # React entry point
│   ├── index.css                   # Tailwind directives + custom CSS classes
│   │
│   ├── context/                    # Global state via Context API
│   │   ├── AuthContext.js          # Login, register, logout, session
│   │   ├── HallContext.js          # Hall CRUD operations
│   │   ├── BookingContext.js       # Booking logic + conflict detection
│   │   └── ToastContext.js         # Toast notification state
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── Navbar.js               # Top navigation bar with profile dropdown
│   │   ├── Sidebar.js              # Collapsible dashboard sidebar
│   │   ├── HallCard.js             # Hall listing card with image + facilities
│   │   ├── BookingModal.js         # Booking popup with live availability check
│   │   ├── FilterSidebar.js        # Advanced hall search filter panel
│   │   ├── Toast.js                # Toast notification container
│   │   └── LoadingSpinner.js       # Spinner + full-page loader
│   │
│   ├── layouts/
│   │   └── DashboardLayout.js      # Sidebar + <Outlet> layout wrapper
│   │
│   ├── pages/                      # One file per route/page
│   │   ├── HomePage.js             # Landing page with hero, stats, featured halls
│   │   ├── LoginPage.js            # Login with demo credential buttons
│   │   ├── RegisterPage.js         # Registration form
│   │   ├── HallListingPage.js      # All halls with search, filter, grid/list view
│   │   ├── HallDetailsPage.js      # Hall detail page with booking card
│   │   ├── BookingSuccessPage.js   # Booking confirmation with summary
│   │   ├── UserDashboard.js        # User stats and upcoming bookings
│   │   ├── UserBookingsPage.js     # Full booking history with cancel option
│   │   ├── AdminDashboard.js       # System analytics and recent bookings
│   │   ├── ManageHallsPage.js      # Admin CRUD for halls
│   │   ├── ManageBookingsPage.js   # Admin approve/reject bookings
│   │   ├── AdminUsersPage.js       # User directory with booking stats
│   │   ├── ProfilePage.js          # Edit profile and change password
│   │   └── NotFoundPage.js         # 404 error page
│   │
│   ├── routes/
│   │   ├── AppRoutes.js            # All route definitions (public + protected)
│   │   └── ProtectedRoute.js       # Auth guard + admin-only guard
│   │
│   ├── data/
│   │   └── sampleData.js           # Seed data — 7 halls, 3 users, 3 bookings
│   │
│   └── utils/
│       ├── helpers.js              # Formatting, conflict detection, analytics
│       └── localStorage.js         # CRUD wrappers for LocalStorage
│
├── tailwind.config.js              # Tailwind theme — colors, fonts, animations
├── postcss.config.js               # PostCSS pipeline
├── package.json                    # Dependencies and scripts
├── README.md                       # This file
├── PROJECT_REPORT.md               # Full academic project report
├── VIVA_QUESTIONS.md               # 25 viva Q&A for presentation
└── INSTALLATION_GUIDE.md           # Detailed setup + troubleshooting guide
```

---

## 🔐 Roles & Access

| Feature | 👤 User | ⚡ Admin |
|---|:---:|:---:|
| Browse and search halls | ✅ | ✅ |
| View hall details | ✅ | ✅ |
| Book a hall | ✅ | ✅ |
| Cancel own bookings | ✅ | ✅ |
| View own booking history | ✅ | ✅ |
| Edit profile & change password | ✅ | ✅ |
| View all bookings (all users) | ❌ | ✅ |
| Approve / Reject bookings | ❌ | ✅ |
| Add / Edit / Delete halls | ❌ | ✅ |
| Manage hall availability | ❌ | ✅ |
| View all registered users | ❌ | ✅ |
| View analytics & utilization | ❌ | ✅ |

---

## 🧠 How Conflict Detection Works

The booking conflict detection algorithm in `utils/helpers.js` checks all existing bookings for the same hall on the same date and prevents overlapping time slots:

```javascript
// Convert HH:MM to minutes for comparison
const hasConflict = (bookings, hallId, date, startTime, endTime) => {
  const relevant = bookings.filter(b =>
    b.hallId === hallId &&
    b.bookingDate === date &&
    b.status !== 'Cancelled' &&
    b.status !== 'Rejected'
  );
  const newStart = timeToMins(startTime);
  const newEnd   = timeToMins(endTime);

  return relevant.some(b => {
    const bStart = timeToMins(b.startTime);
    const bEnd   = timeToMins(b.endTime);
    return newStart < bEnd && newEnd > bStart; // overlap condition
  });
};
```

This covers all overlap scenarios — complete overlap, partial start, partial end, and fully contained slots. A visual indicator in the booking modal shows green ✅ or red ❌ availability in real time as the user selects times.

---

## 📦 Available Scripts

```bash
npm start        # Start development server at localhost:3000
npm run build    # Create optimized production build in /build
npm test         # Run Jest test runner
```

---

## 🔄 Reset Sample Data

To wipe all data and reload the original seed data:

1. Open **DevTools** (F12) → **Application** tab
2. Go to **Local Storage** → `http://localhost:3000`
3. Click **Clear All**
4. Refresh the page — sample data reloads automatically

---

## 🚀 Deploy to Production

```bash
# Build
npm run build

# Deploy options:
# Netlify  — drag & drop the /build folder at netlify.com
# Vercel   — run: vercel --prod
# GitHub Pages — use the gh-pages npm package
```

---

## 📄 Documentation Included

| File | Contents |
|---|---|
| `README.md` | Project overview, features, setup guide (this file) |
| `PROJECT_REPORT.md` | Full academic report — abstract, modules, architecture, future scope |
| `VIVA_QUESTIONS.md` | 25 detailed Q&A covering React, design, and system architecture |
| `INSTALLATION_GUIDE.md` | Step-by-step setup with troubleshooting for common errors |

---

## 🏷️ GitHub Topics

```
react reactjs tailwindcss context-api react-router-dom localstorage
booking-system conference-hall hall-management admin-dashboard
role-based-auth bca-project mca-project final-year-project
frontend-only spa single-page-application
```

---

## 👨‍💻 Author

Built by **Abhishek Y S**

This project was created  for**practice and self-learning purposes** to strengthen full-stack development skills and gain real-world project experience.

---

<div align="center">

⭐ **Star this repo if you found it useful!** ⭐

</div>
