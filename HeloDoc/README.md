# 🏥 HeloDoc - Medical & Hospital Care Guide

**HeloDoc** is an accessible, modern full-stack cross-platform (React.js SPA/PWA, Mobile Web, Android PWA, iOS PWA, and Desktop) Medical and Hospitality application specially designed for **elderly patients, caregivers, and doctors** inside hospitals.

---

## 🛠️ Technology Stack

| Layer | Technologies | Role & Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React.js 18+**, **Vite**, **Modern CSS (Custom Design System)** | Fast component architecture, senior high-contrast theming, Web Speech TTS/STT, and SVG indoor navigation canvas. |
| **Backend API** | **ASP.NET Core (.NET 8/9)** or **Node.js (Express / Fastify)** | Enterprise EHR management, appointment booking, SignalR/WebSocket live queue broadcasts, and ABDM/Ayushman integrations. |
| **Database** | **MySQL (8.0+)** | Relational data persistence for patient profiles, doctor directories, hospital floor node coordinates, prescriptions, and invoices. |

---

## 🌟 Key Features & Modules

### 1. 🕊️ Blue Hospital + Bird Identity & Realistic Modern Design
- **Icon Symbolism**: A vibrant royal blue hospital medical cross intertwined with a graceful flying dove bird representing healing, hope, swift care, and hospital guidance.
- **Glassmorphic UI**: Glass cards, fluid typography, high-contrast borders, and Senior Care Mode.

### 2. 🔐 Security & Sign-In (Auth Module)
- **Phone SMS OTP Verification**: 6-digit verification code with instant verification and countdown resend.
- **Google (Gmail) Account Login**: Fast, verified 1-click authentication.
- **👵 1-Tap Senior Guest Access**: Instant entry for elderly patients who find typing numbers difficult.
- **Hospital Location Selector**: Auto-detect hospital branch via GPS or choose from local hospital network.

### 3. 🗺️ Indoor Hospital Room Navigation & Mapping
- **Interactive SVG Blueprint**: Ground Floor, 1st Floor OPD Wing, and 2nd Floor Inpatient/ICU.
- **Turn-by-Turn Spoken Guidance**: Spoken step-by-step audio instructions ("Walk 15 meters to Elevator A, take to 1st Floor, turn right to Room 104").
- **Animated Vector Path**: Glowing dashed trail showing the exact walking route to the doctor's room.

### 4. 🗣️ Multilingual Voice AI Guide
- **6 Supported Languages**: English, हिन्दी (Hindi), தமிழ் (Tamil), తెలుగు (Telugu), മലയാളം (Malayalam), and Español (Spanish).
- **Text-to-Speech (TTS) & Speech Recognition**: Speaks aloud all page instructions, doctor advice, and room paths in the selected language.
- **Hospital AI Assistant**: Answers queries about doctor rooms, symptom triage, medicine schedules, and government health schemes.

### 5. 🏛️ Government Schemes & Low-Cost Subsidies
- **Reduces High Medical Expenses**:
  - **Ayushman Bharat (PM-JAY)**: ₹5,00,000 cashless hospitalization cover.
  - **Senior Citizen Welfare Concession**: 50% discount on OPD consultations and diagnostic scans.
  - **Chief Minister's Comprehensive Health Insurance (CMCHIS)**.
  - **Pradhan Mantri Jan Aushadhi Generic Pharmacy (Room 004)**: Up to 90% savings on generic medications.
- **2-Question Scheme Eligibility Calculator** and 1-click subsidy application during appointment checkout.

### 6. 👨‍⚕️ Doctor Portal & Medicine Schedule Management
- **Doctor Console**: Manage live queue tokens, record chief complaints and diagnoses.
- **Digital Prescription Builder**: Prescribe medications with morning, afternoon, and night timings + before/after food instructions + day durations.
- **Live Sync to Patient App**: Instantly updates the patient's daily pill checklist and audio reminders.

### 7. 💳 Online Payments & Data Sharing
- **Online Payment Gateway**: UPI (Google Pay, PhonePe, Paytm, BHIM), Debit/Credit Cards, and Hospital Cash Counter.
- **Digital Hospital Invoice**: Downloadable and printable official hospital receipt with transaction ID and subsidy breakdown.
- **Digital Health QR Card & Data Sharing**: 1-click sharing to WhatsApp, SMS, or PDF for caregivers and doctors.
- **Emergency SOS Alert**: One-tap emergency alert with GPS coordinates, hospital ambulance dispatch, and family SMS.

---

## 📱 How to Run the App

### Running with React + Vite (Recommended Development Server)
```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev

# 3. Open in browser: http://localhost:3000
```

### Standalone Instant Preview
- Open `index.vanilla.html` in any modern web browser for instant, zero-dependency offline preview.

---

## 🏗️ Project Structure

```text
HeloDoc/
├── src/
│   ├── assets/                 # Vector Blue Hospital Logo & Art Assets
│   ├── data/
│   │   ├── hospitalData.js     # Floors, doctor directory, rooms, schemes, default state
│   │   └── translations.js     # 6-language i18n dictionaries (EN, HI, TA, TE, ML, ES)
│   ├── services/
│   │   └── speechService.js    # Web Speech API TTS & Speech Recognition service
│   ├── context/
│   │   └── AppContext.jsx      # Global state (Patient, Active Appt, Meds, Lang, SeniorMode)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopHeader.jsx        # Preview switcher, Lang picker, Senior mode switch
│   │   │   ├── MobileFrame.jsx      # Simulator shell (iPhone 15 / Android / Fullscreen)
│   │   │   ├── InAppHeader.jsx      # Greeting, avatar, SOS trigger, AI guide button
│   │   │   └── BottomNav.jsx        # Mobile bottom tab navigation
│   │   ├── tabs/
│   │   │   ├── AuthTab.jsx          # Phone OTP, Google Login, 1-Tap Senior Access
│   │   │   ├── HomeTab.jsx          # Today's token card, Senior Action Grid, Meds preview
│   │   │   ├── MapTab.jsx           # SVG Hospital Blueprint, floor switcher, animated route
│   │   │   ├── AppointmentsTab.jsx  # Problem picker, doctor selection, time slots, subsidies
│   │   │   ├── MedicinesTab.jsx     # Morning/Noon/Night pill checklist, doctor notes
│   │   │   ├── SchemesTab.jsx       # 2-Question Eligibility Calculator, Ayushman cards
│   │   │   ├── DoctorTab.jsx        # Live queue tokens, prescription builder, sync engine
│   │   │   └── ProfileTab.jsx       # Health QR card, security status, invoice history
│   │   └── modals/
│   │       ├── AIGuideModal.jsx     # Voice chatbot dialog with suggestion chips
│   │       ├── PaymentModal.jsx     # UPI / Card / Cash billing checkout with discounts
│   │       ├── ReceiptModal.jsx     # Printable digital hospital invoice
│   │       ├── SOSModal.jsx         # Emergency Trauma Room 001 & Ambulance dispatch
│   │       ├── ShareModal.jsx       # WhatsApp, SMS, and PDF record sharing
│   │       └── GoogleAuthModal.jsx  # Google 1-tap sign-in verification
│   ├── styles/
│   │   ├── index.css           # Global typography, resets, theme variables
│   │   └── App.css             # Glassmorphism, animations, Senior High-Contrast rules
│   ├── App.jsx                 # Root orchestrator connecting layout, tabs & modals
│   └── main.jsx                # React DOM entrypoint
├── public/
│   ├── favicon.svg
│   └── manifest.json           # Progressive Web App configuration
├── index.html                  # Vite root HTML template
├── index.vanilla.html          # Standalone vanilla backup
├── package.json                # React + Vite dependencies & scripts
├── vite.config.js              # Vite configuration
└── README.md                   # Full-stack documentation
```
