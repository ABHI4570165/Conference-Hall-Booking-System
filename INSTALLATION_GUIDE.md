# INSTALLATION GUIDE

## Smart Conference Hall Booking Management System

---

## Prerequisites

Before running this project, ensure the following are installed on your machine:

| Tool | Minimum Version | Download |
|------|----------------|---------|
| Node.js | v16.x or higher | https://nodejs.org |
| npm | v8.x or higher | Included with Node.js |
| Git (optional) | Any | https://git-scm.com |
| Browser | Chrome / Firefox / Edge (latest) | — |

### Check your versions
```bash
node --version    # Should print v16.x or higher
npm --version     # Should print 8.x or higher
```

---

## Step-by-Step Installation

### Step 1: Navigate to the Project Folder
```bash
cd conference-booking
```

### Step 2: Install All Dependencies
```bash
npm install
```
This installs React, React Router DOM, Tailwind CSS, PostCSS, Autoprefixer, and Lucide React.

Expected output:
```
added 1500+ packages in 60s
```

### Step 3: Start the Development Server
```bash
npm start
```

The app will automatically open at:
```
http://localhost:3000
```

---

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | admin123 |
| User | arjun@gmail.com | user123 |
| User | priya@gmail.com | user123 |

> You can also register a new user account via the Register page.

---

## First-Time Setup

On the first launch, the app automatically seeds LocalStorage with:
- **7 sample conference halls** with images, facilities, and pricing
- **3 users** (1 admin + 2 regular users)
- **3 sample bookings** in various states

No manual setup is required.

---

## How to Reset All Data

To wipe all data and start fresh:

1. Open browser DevTools (F12)
2. Go to **Application** tab → **Storage** → **Local Storage** → `http://localhost:3000`
3. Click **Clear All** (🚫 icon)
4. Refresh the page — seed data will be reloaded automatically

---

## Production Build

To create an optimized production build:
```bash
npm run build
```
Output will be in the `/build` folder. Deploy to any static host:

- **Netlify:** Drag and drop the `/build` folder
- **Vercel:** `vercel --prod`
- **GitHub Pages:** Use `gh-pages` package

---

## Troubleshooting

### Issue: `npm install` fails
```bash
# Clear npm cache and retry
npm cache clean --force
npm install
```

### Issue: Port 3000 already in use
```bash
# Run on a different port
PORT=3001 npm start        # Linux/Mac
set PORT=3001 && npm start  # Windows
```

### Issue: Tailwind styles not applying
```bash
# Rebuild Tailwind
npm run build
# Or restart dev server
npm start
```

### Issue: Blank page after `npm start`
- Open browser console (F12) and check for errors
- Ensure Node.js version is v16 or higher
- Delete `node_modules` and reinstall:
```bash
rm -rf node_modules
npm install
npm start
```

### Issue: `lucide-react` not found
```bash
npm install lucide-react
```

---

## Project Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start dev server | `npm start` | Runs at localhost:3000 with hot reload |
| Production build | `npm run build` | Optimized build in /build folder |
| Run tests | `npm test` | Runs Jest test runner |
| Eject CRA | `npm run eject` | Exposes Webpack config (irreversible) |

---

## Folder Contents After Install

```
conference-booking/
├── node_modules/        ← installed by npm install
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── index.js
│   ├── index.css
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   └── utils/
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── README.md
├── PROJECT_REPORT.md
├── VIVA_QUESTIONS.md
└── INSTALLATION_GUIDE.md
```

---

## Tech Stack Versions Used

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.22.0",
  "react-scripts": "5.0.1",
  "lucide-react": "^0.383.0",
  "tailwindcss": "^3.4.1",
  "autoprefixer": "^10.4.17",
  "postcss": "^8.4.35"
}
```

---

*HallBook – Smart Conference Hall Booking System*
