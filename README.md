# 🌲 Visitor Portal - E-Ticketing & Public Service Web App (TN Alas Purwo)

[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.60-FF4154.svg)](https://tanstack.com/query)
[![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-Radix_Primitives-000000.svg)](https://ui.shadcn.com/)

This repository contains the **Visitor Web Application (Mobile-First E-Ticketing & Public Service Portal)** for the Final Thesis Project: **E-Ticketing System, Public Complaint Service, and Customer Satisfaction Survey for Alas Purwo National Park (Balai Taman Nasional Alas Purwo - BTNAP)**.

Built using **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Shadcn UI (Radix UI)**, **TanStack React Query**, **Framer Motion**, and **`qrcode.react`** for dynamic digital ticket rendering.

---

## 🔗 System Ecosystem & Related Repositories

This visitor web app is part of a 3-tier multi-repository system:

- 🌐 **[Visitor Portal (`Skripsi-visitors`)](../Skripsi-visitors)** - Mobile-first visitor web app for ticket booking, SKM surveys, complaints & WBS *(Current Repository)*.
- ⚙️ **[Backend RESTful API (`Skripsi-Backend`)](../Skripsi-Backend)** - Core API server, database ORM, payment webhooks & business logic.
- 🛡️ **[Admin Dashboard (`Skripsi-Admin`)](../Skripsi-Admin)** - Management web portal for administrative staff, POS ticketing, analytics & live QR gate scanning.

---

## 📌 Key Features & Modules

### 🏠 1. Landing Page & Park Exploration
- **Hero & Highlights**: Dynamic landing page showcasing destination banners, quick ticketing access, news highlights, and upcoming events.
- **Destinations Showcase**: Detailed views for tourist spots inside Alas Purwo National Park with photo galleries, facility tags, and features.

### 🎟️ 2. Online E-Ticketing & Booking System
- **Interactive Ticket Booking**: Step-by-step selection of entrance gates, visit dates, visitor categories (Domestic, International, Student), and group quantity.
- **Dynamic Pricing Engine**: Automated pricing calculation based on Gate + Visitor Category + Day Type (Weekday / Weekend).
- **Payment Gateway Integration**: Seamless checkout via Midtrans Snap API supporting QRIS, Bank Virtual Accounts, E-Wallets, and Credit Cards.

### 📱 3. Digital Ticket & QR Code E-Pass
- **Booking History**: Track all active and historical ticket purchases.
- **Dynamic QR Code Ticket**: Generates dynamic QR codes (`qrcode.react`) on valid tickets for on-site scanning at entrance gates.
- **Status Indicators**: Real-time updates for payment statuses (*Pending*, *Paid/Settled*, *Used*, *Expired*).

### 📰 4. News & Event Portal
- **News & Announcements**: Read official park updates and press releases with detail views.
- **Events & Schedules**: Browse upcoming conservation events, cultural activities, and seasonal park notices.

### 📊 5. Public Services & Feedback Submission
- **SKM (Survei Kepuasan Masyarakat)**: Digital satisfaction survey evaluating 9 service dimensions aligned with PermenPAN-RB standards.
- **Public Complaint Submission (Pelaporan)**: Submit service or facility complaints with image attachment uploads and track resolution status in user profile (`/profile/reports`).
- **Whistleblowing System (WBS)**: Confidential anonymous incident report form structured around **5W1H** principles with supporting media attachments.

### 👤 6. Visitor Authentication & Profile Management
- **Visitor Registration & Login**: Account creation for returning visitors.
- **Personal Dashboard**: Manage personal profile, active tickets, and submitted complaint reports.
- **Mobile-First UX**: Responsive UI with a sticky bottom navigation bar (`BottomNav`) tailored for smartphone browsers.

---

## 🛠️ Tech Stack & Dependencies

| Layer / Component | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 (TypeScript) |
| **Build Tool & Dev Server** | Vite (v5.4) |
| **Routing** | Wouter (v3.3) |
| **Data Fetching & State** | TanStack React Query (v5.60) |
| **UI Components & Styling** | Tailwind CSS, Shadcn UI (Radix UI Primitives), Lucide Icons, Framer Motion |
| **Form Validation** | React Hook Form, Zod, `@hookform/resolvers` |
| **Digital Ticket QR Engine** | `qrcode.react` |

---

## 📂 Directory Structure

```
Skripsi-visitors/
├── client/
│   ├── src/
│   │   ├── components/       # UI Components & Layouts (Header, Footer, BottomNav, ProtectedRoute)
│   │   ├── hooks/            # Custom Hooks (useAuth, useMobile, ScrollToTop)
│   │   ├── lib/              # API Client & QueryClient Config
│   │   ├── pages/            # Application Views & Pages
│   │   │   ├── Auth/         # Login & Registration Pages
│   │   │   ├── Booking/      # Booking Form, Ticket History & Digital QR Ticket Details
│   │   │   ├── Destination/  # Destination Catalog & Detail Views
│   │   │   ├── Event/        # Event Listings & Details
│   │   │   ├── News/         # News Articles & Detail Views
│   │   │   ├── Profile/      # User Profile & Personal Report History
│   │   │   └── Survey/       # SKM Survey, Public Complaint & WBS Forms
│   │   ├── App.tsx           # Router Configuration & Layout Setup
│   │   ├── index.css         # Global Styles & Custom Animations
│   │   └── main.tsx          # App Entry Point
│   └── index.html            # HTML Shell
├── .env.example              # Environment Variables Template
├── components.json           # Shadcn UI Configuration
├── package.json
├── tailwind.config.ts        # Tailwind CSS Configuration
├── tsconfig.json
└── vite.config.ts            # Vite Configuration
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- **Node.js** (v18 LTS or higher)
- **npm** or **yarn**
- Running instance of **Skripsi-Backend** (REST API)

### 2. Clone & Install Dependencies
```bash
# Navigate to the visitor portal workspace
cd Skripsi-visitors

# Install dependencies
npm install
```

### 3. Environment Variables Setup
Create a `.env` file in the root directory (refer to `.env.example`):

```env
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 🚀 Running the Application

### Development Mode
```bash
# Start dev server on port 3002
npm run dev

# Run accessible on local network (useful for testing on actual mobile devices)
npm run dev:network
```
The application will be accessible at `http://localhost:3002`.

### Production Build
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License & Credits

Developed as part of the **Final Thesis Project (Tugas Akhir Skripsi)** in collaboration with **Balai Taman Nasional Alas Purwo (BTNAP)**.
