# Jeshfique Mahmud & Faheema Shaheed Tamanna — Royal Wedding Invitation

A luxury full-stack React & Node.js web application for the wedding celebration of **Jeshfique Mahmud & Faheema Shaheed Tamanna**.

Designed with deep midnight royal navy and baroque gold foil aesthetics, complete with an **integrated SQLite database** for guest RSVPs and guestbook wishes, high-performance mobile responsiveness, 3D Coverflow photo gallery, live Dhaka countdown, ambient Web Audio raga synthesizer, and a complete RSVP Organizer Dashboard with 1-click CSV export.

---

## 📱 Mobile-First & Responsive Enhancements

The entire application is optimized for mobile phones (iOS Safari, Android Chrome, and modern mobile browsers):

1. **Mobile Bottom Navigation & Quick Action Bar**:
   - Fixed thumb-friendly bottom bar with instant jump buttons for **RSVP**, **Dates**, and **Venue**.
   - Floating header with expandable mobile drawer menu displaying all sections.
2. **iOS Safari Form Zoom Fix**:
   - Form inputs and textareas use a base 16px font size on mobile to prevent unwanted automatic browser viewport zooming when focusing inputs.
   - 300ms mobile tap delay eliminated via `touch-action: manipulation`.
3. **Touch-Sensitive 3D Cameo & Organic Avatars**:
   - Interactive 3D tilt responsive to touch drag on phone screens in addition to mouse hover.
   - Mobile-adaptive SVG scaling (`max-w-[340px] sm:max-w-[430px]`) prevents overflow on narrow 360px displays.
4. **Adaptive 3D Coverflow Photo Gallery**:
   - Dynamically calculates card offsets (`80px` on mobile vs `120px` on desktop) preventing horizontal clipping.
   - Smooth horizontal swipe gesture detection while preserving vertical scroll.
   - Animated visual swipe indicator ("Swipe left or right").
5. **Mobile-Ready Maps & Ride Integration**:
   - **Google Maps** (opens Google Maps app).
   - **Apple Maps** (direct deep link for iPhone users).
   - **Uber Ride Launcher** (opens Uber app with venue destination pre-filled).
6. **WhatsApp Pass Sharing**:
   - Confirmed guests can 1-tap **Share their Digital VIP Pass on WhatsApp** or print/save directly from their smartphone.
7. **Mobile Organizer Dashboard**:
   - Switches automatically from a wide desktop table to **responsive mobile guest cards** with 1-tap call (`tel:`) and mail (`mailto:`) shortcuts.

---

## 🌟 Core Features

- **Persistent SQLite Database (`server/wedding.db`)**:
  - Relational database powered by `sql.js` with disk synchronization.
  - Tables: `rsvps` and `guestbook_messages`.
- **Live RSVP & Party Counter**:
  - Attendance choices: Both Events, Holud Only, Reception Only, Unable to attend.
  - Stepper buttons for party size (+1s, family count).
  - Golden celebratory confetti explosion (`canvas-confetti`).
- **December 2026 Dhaka Calendar & Countdown**:
  - Highlights 25th Dec (Holud) and 27th Dec (Reception).
  - 1-click `.ics` calendar downloads & direct Google Calendar link.
  - Live Dhaka countdown ticker (BST, UTC+6).
- **Celebration Itinerary & Live Guestbook**:
  - Vertical gold timeline of all 4 events across both evenings.
  - Live prayers board where guests can leave duas and send heart reactions.
- **Ambient Classical Synthesizer**:
  - Web Audio pentatonic chime synthesizer.

---

## 🚀 How to Run

### Quick Start (Production Build)
Double click `start.bat` or run in terminal:
```bash
node server/index.js
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser or phone!

### Development Mode (Vite HMR + Express)
Double click `dev.bat` or run:
```bash
node node_modules\vite\bin\vite.js
```

---

## 🗄️ Database Schema & API Endpoints

- `GET /api/health` - Server and SQLite database health check
- `GET /api/rsvps` - Retrieve all RSVPs
- `POST /api/rsvp` - Submit guest attendance confirmation
- `DELETE /api/rsvp/:id` - Remove an RSVP
- `GET /api/stats` - RSVP breakdown and attendee analytics
- `GET /api/export-rsvps` - Download CSV of all RSVPs
- `GET /api/guestbook` - Fetch all prayers and wishes
- `POST /api/guestbook` - Post a new wish
- `POST /api/guestbook/:id/like` - Upvote a wish's heart counter
