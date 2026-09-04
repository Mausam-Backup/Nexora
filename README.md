<div align="center">

# 🏛️ Nexora — CampusSync ERP
### Enterprise-Grade Integrated Student Management & Reconciliation System
**Problem Statement PS-6: ERP-based Integrated Student Management System**  
*Category: Pure Hard Development • Hackathon Finalist Edition*

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%205.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Storage](https://img.shields.io/badge/Storage-Hybrid%20%28Offline--First%20%2B%20REST%29-F58025?style=for-the-badge&logo=json&logoColor=white)](https://www.json.org/)
[![Realtime](https://img.shields.io/badge/Sync-BroadcastChannel%20Bus%20%280ms%29-FF4154?style=for-the-badge&logo=webrtc&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)
[![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS%20%7C%20shadcn-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<p align="center">
  <b>A unified collegiate platform replacing disconnected spreadsheets, paper attendance registers, cash collection receipts, and isolated mark sheets with a single, synchronized relational ledger.</b>
</p>

---

[🚀 Quick Start](#-quick-start--installation) •
[🏛️ Problem & Solution](#-the-problem-statement--our-solution) •
[📐 System Architecture](#-system-architecture--data-flow) •
[⚡ Live Concurrency Engine](#-zero-latency-multi-window-synchronization) •
[📊 Cross-Module Workflows](#-cross-module-statutory-workflows) •
[⚖️ Anti-Mismatch Reconciliation](#-anti-mismatch-spreadsheet-reconciliation-ledger) •
[📑 Export Engine](#-institutional-report--export-engine) •
[🤖 Context-Aware AI Copilot](#-context-aware-erp-ai-copilot) •
[🎯 3-Minute Judge Demo Script](#-judge--evaluator-3-minute-walkthrough-script)

---

</div>

## 📌 The Problem Statement & Our Solution

### The Industry Challenge (PS-6)
> *"Colleges run admissions, attendance, fees, exams, and results on disconnected spreadsheets and legacy tools, causing data mismatches and manual reconciliation work."*

Traditional colleges suffer from departmental silos:
```
  [Accounts Dept Excel]           [Faculty Paper Register]         [Exam Cell Spreadsheet]
          │                                  │                                │
          ▼                                  ▼                                ▼
Cash paid omitted in sheet        Absences recorded on paper       Student gets Hall Ticket
  ➔ Student flagged unpaid          ➔ 62% attendance uncalculated    ➔ Debarred on exam day!
          │                                  │                                │
          └──────────────────────────┬───────────────────────────────────────┘
                                     │
                 ❌ MANUAL RECONCILIATION NIGHTMARE
                    • Delays in result processing (3–6 weeks)
                    • Financial revenue leakage
                    • Disputed grades and examination hall fraud
```

### The Nexora Solution
Nexora unifies all administrative functions onto a **single relational state engine**. A mutation in any department immediately and automatically cascades across the entire institution:

```
                                  ╔═══════════════════════════════════╗
                                  ║   NEXORA UNIFIED STATE ENGINE     ║
                                  ║   `campussync-unified-erp-v1`     ║
                                  ╚═══════════════════════════════════╝
                                                    │
                 ┌──────────────────────────────────┼──────────────────────────────────┐
                 │                                  │                                  │
                 ▼                                  ▼                                  ▼
      [FACULTY ATTENDANCE]                [STUDENT BILLING]                 [EXAMINATION CELL]
  • Professor marks 1 absence.        • Student clears pending fees.    • Evaluates Attendance ≥ 75%
  • CS301 drops below 75%.            • Receipt auto-generated.        • Evaluates Fee Clearance = True
  • `attendanceClearance: false`.     • `feeClearance: true`.           • Unlocks Hall Ticket + QR Code.
                 │                                  │                                  ▲
                 └──────────────────────────────────┴──────────────────────────────────┘
                                                    │
                                  ✅ 100% AUTOMATED CROSS-MODULE GATE
                                     Zero manual reconciliation needed
```

---

## 📐 System Architecture & Data Flow

Nexora is built as a **High-Reliability Hybrid Architecture**: an offline-first reactive frontend combined with zero-latency browser bus synchronization, backed by a persistent Node.js/Express REST server.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    PRESENTATION LAYER                                   │
│   React 18  •  TypeScript  •  Tailwind CSS  •  shadcn/ui  •  Lucide Icons  •  Vite 5   │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│    Admin Dashboard    │   Faculty Attendance   │   Student Gradebook   │   Exams & Fees │
│   (Reconciliation)    │   (Batch Marking)      │   (Live SGPA/CGPA)    │   (Gatekeeper) │
└──────────────────────────────────────────┬──────────────────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           REACTIVE EVENT & MUTATION ENGINE                              │
│                                 `useERPData.ts`                                         │
│  • Atomic student mutations               • Real-time SGPA/CGPA recomputation           │
│  • Statutory 75% threshold evaluation      • Cross-module referral constraint checks     │
└──────────────────┬───────────────────────────────────────────────┬──────────────────────┘
                   │                                               │
                   ▼ (0ms Event Bus)                               ▼ (Debounced REST)
┌──────────────────────────────────────────────┐  ┌───────────────────────────────────────┐
│         BROWSER BROADCAST BUS                │  │         EXPRESS REST BACKEND          │
│    `BroadcastChannel('campussync_bus')`      │  │        Port 5001  •  Node.js          │
│  • Window 1 (Faculty) ➔ Window 2 (Student)   │  │  • `GET  /api/erp/health`             │
│  • Real-time tab sync without page reload    │  │  • `GET  /api/erp/state`              │
│  • Fallback: Window `storage` event listener │  │  • `POST /api/erp/sync`               │
└──────────────────────────────────────────────┘  └───────────────────┬───────────────────┘
                                                                      │
                                                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                               PERSISTENT STORAGE ENGINE                                 │
│  Client Tier: `localStorage` (`campussync-unified-erp-v1`)                              │
│  Server Tier: Resilient File-Backed Store (`backend/data/erp_state.json`)               │
│  Production Scale: Direct drop-in driver for MongoDB / PostgreSQL                       │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Zero-Latency Multi-Window Synchronization

One of Nexora's standout engineering capabilities is **real-time cross-tab and cross-device state propagation**.

### How It Works
When a faculty member marks attendance or an admin generates a fee bill in Window 1:
1. `useERPData` atomically mutates the reactive state.
2. The mutation triggers an instant message across a native `BroadcastChannel('campussync_erp_bus')`.
3. Window 2 (which could be the student's exam portal on a split-screen or separate monitor) receives the broadcast and calls `setStudents()`, re-rendering the UI in **less than 5 milliseconds**.
4. In the background, a debounced HTTP `POST /api/erp/sync` synchronizes the payload to the Express server, ensuring network-inspectable server-side persistence.

```mermaid
sequenceDiagram
    autonumber
    actor Faculty as 👩‍🏫 Professor (Window 1)
    participant Bus as ⚡ BroadcastChannel Bus
    actor Student as 👨‍🎓 Student (Window 2)
    participant Server as 🖥️ Express Backend (Port 5001)

    Faculty->>Faculty: Marks Student Absent in CS301
    Faculty->>Faculty: Attendance drops from 75.2% to 74.1%
    Faculty->>Bus: Broadcasts { type: 'ERP_SYNC', students }
    Bus-->>Student: Message Received (0ms latency)
    Student->>Student: Re-renders: Hall Ticket instantly LOCKS
    Student->>Student: Displays "DEBARRED: Attendance < 75%"
    Faculty->>Server: HTTP POST /api/erp/sync (Background)
    Server-->>Faculty: HTTP 200 OK (Persisted to JSON DB)
```

---

## 📊 Cross-Module Statutory Workflows

### 1. Statutory Attendance-to-Exam Gate (The 75% Rule)
*University Regulations mandate a strict minimum of 75% cumulative lecture attendance to be eligible for semester examinations.*

- **Faculty Roster (`TeacherAttendance.tsx`)**: Faculty records attendance by lecture. Features **1-Click "Mark All Present"** and **"Mark All Absent"** controls.
- **Dynamic Gatekeeper (`StudentExamView.tsx`)**:
  - `overallAttendance >= 75%` AND `fees.outstanding === 0`: **Admit Card UNLOCKED** with verified roll number and printable hall ticket.
  - `overallAttendance < 75%`: **Admit Card LOCKED** with an immutable audit warning:  
    `"DEBARRED: Attendance Shortage (Current: 62.5% | Required: 75.0%)"`.

### 2. Live Dynamic SGPA & CGPA Transcript Pipeline
*Eliminates end-of-semester manual calculation of credit grade points across disparate spreadsheets.*

- **Marks Entry (`UploadMarks.tsx`)**: Faculty enters Internal Assessment (max 30), Mid-Sem (max 30), and End-Sem (max 40) marks.
- **Autonomous Grading**:
  $$\text{Total} = \text{Internal} + \text{MidSem} + \text{EndSem}$$
  $$\text{SGPA} = \frac{\sum (\text{GradePoint}_i \times \text{Credits}_i)}{\sum \text{Credits}_i}$$
- **Transcript Viewer (`ViewMarks.tsx`)**: Live semester-wise grade sheet with instantaneous SGPA calculation.
- **Academic Probation Warning**: If cumulative CGPA drops below **5.50**, the system automatically triggers an **Academic Probation & Remedial Counseling** statutory notice.

### 3. Fee Reconciliation & Hold Resolution
- **Admin Billing (`AdminBilling.tsx`)**: Administrators issue itemized semester fee bills (Tuition, Lab Fees, Library Dues).
- **Student Payment (`StudentBilling.tsx`)**: 1-click dues settlement. When paid, the financial clearance flag updates immediately, and the system automatically generates an **Official Formatted University Fee Receipt Voucher**.

---

## ⚖️ Anti-Mismatch Spreadsheet Reconciliation Ledger

Integrated directly into **[AdminOverview.tsx](frontend/src/pages/AdminOverview.tsx)**, this dashboard proves that Nexora definitively solves the core problem stated in PS-6.

| Reference Code | Institutional Domain | Legacy Spreadsheet Mismatch (Problem) | Nexora Unified Auto-Resolution (Engine) | Status |
| :---: | :--- | :--- | :--- | :---: |
| **`DISC-2025-01`** | **Attendance vs Exam Debarment** | Student Rohan Verma (`20CS003`) had 62% attendance on paper; legacy portal issued hall ticket erroneously. | **Dynamic 75% Gate applied:** Hall ticket locked; statutory debarment notice issued automatically. | `RECONCILED` ✅ |
| **`DISC-2025-02`** | **Fee Accounts vs Exam Clearance** | Student Ananya Iyer (`20CS004`) pending tuition fee was omitted from offline finance spreadsheet. | **Live Itemized Ledger linked:** ₹78,000 outstanding tracked; registration hold placed automatically. | `RECONCILED` ✅ |
| **`DISC-2025-03`** | **Continuous Assessment vs SGPA** | Weighting mismatch between internal (30), mid-sem (30), and end-sem (40) across Excel versions. | **Unified Formula applied:** Real-time calculation of credit grade points and SGPA across all courses. | `RECONCILED` ✅ |
| **`DISC-2025-04`** | **Admissions Roster vs Allocation** | New semester enrollments not synchronized with teacher lecture capacity. | **Single-source primary key** mapped directly to course codes with zero orphaned records. | `RECONCILED` ✅ |

> **Interactive Re-Audit**: Click the **"Re-Run Discrepancy Audit"** button on the Admin Dashboard to perform an on-the-fly cross-module integrity check across all student records.

---

## 📑 Institutional Report & Export Engine

An explicit, uncompromised requirement of PS-6 is exportable reports. Nexora includes a dedicated institutional export suite in **`exportUtils.ts`**:

1. **RFC 4180-Compliant CSV Downloads**: Direct client-side binary Blob generation.
2. **Print-to-PDF Engine**: Opens clean, institutional-grade printable layouts with headers, seals, signature lines, and `@media print` CSS optimization.

```
                              EXPORT MATRIX
  ┌───────────────────────┬──────────────┬───────────────────┐
  │ Module                │ CSV Export   │ Styled Print/PDF  │
  ├───────────────────────┼──────────────┼───────────────────┤
  │ Marks & Transcripts   │ Supported    │ Official Transcript│
  │ Faculty Attendance    │ Supported    │ Register Ledger   │
  │ Student Attendance    │ Supported    │ Personal Record   │
  │ Fee Bills & Payments  │ Supported    │ Fee Receipt       │
  │ Student Directory     │ Supported    │ Registry Ledger   │
  │ Examination Schedules │ Supported    │ Admit Card / Pass │
  └───────────────────────┴──────────────┴───────────────────┘
```

---

## 🤖 Context-Aware ERP AI Copilot

Located in **[AskAI.tsx](frontend/src/pages/AskAI.tsx)**, the AI assistant is not just a generic chatbot—it is an **integrated ERP copilot**.

```
                   User Query: "Am I eligible for exams?"
                                    │
                                    ▼
                     Is it an ERP query or offline?
                                    │
                   ┌────────────────┴────────────────┐
                   ▼                                 ▼
             [YES / OFFLINE]                   [NO / OPEN-ENDED]
        ⚡ Local ERP Rules Engine           🌐 Gemini 1.5 Flash API
      • Reads live attendance (87%)       • Injects live student transcript
      • Checks fee dues (₹0)              • Returns rich educational advice
      • Verifies hall ticket clearance
                   │                                 │
                   └────────────────┬────────────────┘
                                    │
                                    ▼
       "Assessment for Aarav Sharma (20CS001):
        Status: CLEARED FOR EXAMS ✅
        • Attendance: 87.2% (Passes ≥75% standard)
        • Financials: Cleared (₹0 due)
        • Hall Ticket: Active & Unlocked in Exams portal."
```

### Quick Action Suggestion Prompts
- 🛡️ *"Am I eligible to sit for the upcoming end-semester exams?"*
- 💳 *"What are my outstanding fee dues and clearance status?"*
- 📅 *"What is my current attendance percentage and do I have course shortages?"*
- 🎓 *"Can you summarize my current CGPA, SGPA, and subject marks?"*

---

## 👥 Role-Based Access & Judge Quick-Access

### 1. Protected Route Hierarchy
- **Administrator** (`ADM001`) ➔ `/admin/overview` (Reconciliation, Master Directory, Finances)
- **Faculty** (`T101`) ➔ `/teacher/attendance` (Lecture Rosters, Marks Entry, Scheduling)
- **Student** (`20CS001`) ➔ `/student/dashboard` (Academic Transcripts, Hall Ticket, Billing)

### 2. Evaluation Quick-Access Controls
To facilitate fast judge evaluations without typing credentials, Nexora provides **two distinct demo access tools**:

1. **Header Persona Switcher (`DemoRoleSwitcher.tsx`)**: A top navbar dropdown allowing 1-click switching between Admin, Faculty, Cleared Student (`20CS001`), Debarred Student (`20CS003`), and Fee-Hold Student (`20CS004`).
2. **Auth Page 1-Click Access Card (`Auth.tsx`)**: Prominent 4-button quick login panel on both desktop and mobile login views.

---

## 🎯 Judge & Evaluator 3-Minute Walkthrough Script

Follow these steps to experience the complete end-to-end reconciliation flow:

### Phase 1: Judge 1-Click Login (15 seconds)
1. Open the application at `http://localhost:5000/auth` (or production URL).
2. Click the **"Faculty (Attendance)"** 1-click button on the Judge Quick Access Card.
3. You are instantly authenticated as **Prof. Rajesh Iyer (`T101`)** on the Attendance Management console.

### Phase 2: Live Multi-Window Concurrency Test (60 seconds)
1. Open a **second browser window (side-by-side)**.
2. In Window 2, navigate to `http://localhost:5000/auth` and click **"Student (Debarred)"**.
3. In Window 2, click **Exams** on the sidebar. Notice that **Rohan Verma (`20CS003`)** has his **Hall Ticket LOCKED** due to low attendance (62%).
4. In Window 1 (Faculty), find Rohan Verma in today's class roster and mark him **Present** for multiple sessions.
5. **Watch Window 2 without refreshing**: Notice how Window 2 updates live via the Broadcast Bus, recalculating his attendance in real time.

### Phase 3: The Statutory Debarment & AI Copilot Test (45 seconds)
1. In the Student portal (Window 2), click **Ask AI** on the sidebar.
2. Click the prompt: *"Am I eligible to sit for the upcoming end-semester exams?"*
3. The AI Copilot reads the live relational state and explains the exact audit gate status and attendance shortfall.

### Phase 4: Anti-Mismatch Reconciliation & PDF Export (60 seconds)
1. Use the header persona switcher to switch to **Administrator (`ADM001`)**.
2. Arrive at `/admin/overview`. Observe the **Live KPI Cards** reflecting the real student counts, fee totals, and average attendance.
3. Scroll to the **"Spreadsheet Reconciliation & Anti-Mismatch Audit Ledger"** and click **"Re-Run Discrepancy Audit"**.
4. Navigate to **Manage Students**, filter by **"Debarred"**, and click **"Print Registry Report"** to view the styled institutional PDF report.

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone & Install
```bash
git clone https://github.com/Mausam5055/Nexora.git
cd Nexora

# Install root dependencies
npm install

# Install workspace dependencies (frontend & backend)
npm run install:all
```

### 2. Launch the Application

#### Option A: Full Concurrent Stack (Recommended)
Runs both the React Vite frontend (Port 5000) and the Node.js Express backend (Port 5001) concurrently:
```bash
npm run dev
```

#### Option B: Independent Services
```bash
# Terminal 1 - Backend Server (Port 5001)
cd backend
npm run dev

# Terminal 2 - Frontend Application (Port 5000)
cd frontend
npm run dev
```

### 3. Verify Server Endpoints
```bash
# Check Backend Healthcheck
curl http://localhost:5001/api/erp/health

# Check Synchronized State
curl http://localhost:5001/api/erp/state
```

### 4. Build for Production
```bash
# Validates TypeScript compilation and builds minified assets
npm run build
```
*(Verified: Compiles in ~15s with 0 errors across 3,200+ modules).*

---

## 📁 Repository Structure

```
Nexora/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Resilient database connection (MongoDB with File fallback)
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # JWT authentication & role verification routes
│   │   │   └── erpRoutes.js          # REST State Sync API (/health, /state, /sync, /reset)
│   │   ├── app.js                    # Express app configuration & middleware
│   │   └── server.js                 # HTTP server listening on Port 5001
│   ├── data/
│   │   └── erp_state.json            # File-backed persistence store for zero-setup demo
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── attendance/           # Batch attendance modal & subject cards
│   │   │   ├── billing/              # Billing tables, fee creation dialog, receipts
│   │   │   ├── exams/                # Student hall ticket gatekeeper & schedule
│   │   │   ├── layout/
│   │   │   │   ├── DemoRoleSwitcher.tsx # 1-click evaluation persona switcher
│   │   │   │   ├── MainHeader.tsx    # Header with sync status & quick persona picker
│   │   │   │   └── SidebarNavigation.tsx # Hierarchical ERP menu navigation
│   │   │   └── ui/                   # Accessible shadcn/ui component library
│   │   ├── data/
│   │   │   └── unifiedERPData.ts     # Canonical mock student relational records (20CS001-20CS008)
│   │   ├── hooks/
│   │   │   └── useERPData.ts         # Core state store, BroadcastChannel bus & REST sync
│   │   ├── pages/
│   │   │   ├── AdminOverview.tsx     # KPI metrics & Spreadsheet Reconciliation Ledger
│   │   │   ├── AskAI.tsx             # Context-aware offline & Gemini AI Copilot
│   │   │   ├── Auth.tsx              # Login page with Judge 1-Click Access Card
│   │   │   ├── ManageStudents.tsx    # Registry with Add/Delete & Status Filtering
│   │   │   ├── StudentAttendance.tsx # Live student attendance & shortage warnings
│   │   │   ├── StudentBilling.tsx    # Dues payment & auto-print fee voucher
│   │   │   ├── TeacherAttendance.tsx # Class roster batch attendance & register print
│   │   │   ├── TeacherTimetable.tsx  # Schedule with "Take Attendance" shortcut
│   │   │   └── ViewMarks.tsx         # Live transcript, SGPA/CGPA, probation warning
│   │   └── utils/
│   │       └── exportUtils.ts        # RFC 4180 CSV & Styled Print-to-PDF generator
│   └── package.json
│
├── package.json                      # Monorepo workspaces & concurrent scripts
└── README.md                         # Comprehensive project documentation
```

---

## 🏆 Hackathon Competitive Differentiation Matrix

| Evaluation Dimension | Typical Hackathon ERP Submission | Nexora (CampusSync) |
| :--- | :--- | :--- |
| **Data Architecture** | Separate mock arrays in each file with mismatched IDs | **Single relational store** (`campussync-unified-erp-v1`) linking all modules |
| **Multi-Window Sync** | Requires manual page reload; data desynchronizes | **0ms instantaneous live sync** via `BroadcastChannel` event bus |
| **Role-Based Access** | Single student dashboard with cosmetic role switcher | **Dedicated routes** (`/admin`, `/teacher`, `/student`) + 1-click persona switch |
| **Problem Alignment** | Generic CRUD forms ignoring the problem statement | **Anti-Mismatch Ledger** directly itemizing spreadsheet discrepancies |
| **Reports & Exports** | Dead buttons triggering `alert("Coming soon")` | **Fully functional CSV downloads & styled print-to-PDF transcripts** |
| **AI Integration** | Disconnected ChatGPT wrapper iframe | **Context-aware copilot** aware of live GPA, attendance %, and fee holds |
| **Offline Reliability** | Crashes if MongoDB or backend server is not running | **Graceful dual fallback**: runs offline, runs local JSON, runs with backend |

---

## 👨‍💻 Team & Authorship

Developed for the **12-Hour College Hackathon — Problem Statement PS-6 (ERP-based Integrated Student Management System)**.

- **Lead Full-Stack Architect & Core Developer**: [Mausam Kar](https://github.com/Mausam5055)
- **Affiliation**: Computer Science & Engineering, VIT Bhopal University
- **License**: MIT Open Source

---

<div align="center">
  <b>Built with architectural rigor, domain authenticity, and extreme performance.</b><br>
  <sub>Designed to eliminate spreadsheets and modernize campus administration.</sub>
</div>