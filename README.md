# FocusForge Study Tracker

A production-ready Progressive Web App for deep study tracking using React + Vite, TailwindCSS, IndexedDB persistence, Chart.js analytics, service worker offline support, and browser notifications.

## Features

- **Study Timer System**
  - Pomodoro mode (25/5 defaults, editable)
  - Custom timer mode
  - Start / Pause / Resume / Stop
  - Auto-save session into IndexedDB
  - Inactivity detection (60s mouse/keyboard/touch/scroll) pauses timer
- **Subjects & Goals**
  - Create subjects
  - Set daily target hours
  - See completion percentage per subject for current day
- **Smart Reminders**
  - Break reminders for Pomodoro cycles
  - Daily reminder at 9:00 AM (while app is open)
  - Overstudy warning after 4 continuous study hours
- **Progress Tracking**
  - Daily/weekly/monthly charts
  - Study streak
  - Total hours per subject
  - Productivity score
- **Focus Mode**
  - Fullscreen minimal focus overlay
  - Navigation disabled while timer runs
- **History**
  - View session logs
  - Edit/delete session records
- **PWA**
  - Installable manifest
  - Service worker offline caching
  - Mobile friendly responsive UI

## Tech Stack

- React 18 + Vite
- TailwindCSS
- IndexedDB (native API)
- Chart.js + react-chartjs-2
- Service Worker + Web App Manifest
- Browser Notification API

## Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Run in development

```bash
npm run dev
```

### 3) Build production bundle

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Project Structure

```text
.
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── public/
│   ├── manifest.webmanifest
│   ├── sw.js
│   └── icons/
│       ├── icon-192.svg
│       └── icon-512.svg
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── components/
    │   ├── AnalyticsPanel.jsx
    │   ├── FocusOverlay.jsx
    │   ├── HistoryPanel.jsx
    │   ├── ReminderPanel.jsx
    │   ├── SubjectManager.jsx
    │   └── TimerPanel.jsx
    ├── data/
    │   └── db.js
    ├── hooks/
    │   ├── useInactivity.js
    │   ├── useNotifications.js
    │   ├── useSessions.js
    │   ├── useSubjects.js
    │   └── useTimer.js
    ├── pwa/
    │   └── registerSW.js
    └── utils/
        └── metrics.js
```

## Notes

- Data is persisted locally in IndexedDB.
- Notifications need user permission.
- Daily reminders require the app to be open in the browser context.
- Service worker cache version can be bumped in `public/sw.js` for invalidation.
