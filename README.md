# PrepNurse — NORCET Mock Test Platform

> **Practice • Prepare • Succeed**

A production-ready, modern, responsive **NORCET Mock Test Platform for India** built for nursing officer aspirants preparing for AIIMS NORCET, ESIC, RRB, and state nursing examinations.

---

## 🌟 Key Features

### 1. Dual Exam Modes
- **🕒 Mock Test Mode**:
  - Full exam simulation with configurable countdown timer (default 180 minutes).
  - Authentic AIIMS NORCET marking scheme: **+1 for correct**, **-0.33 for wrong**, **0 for unattempted**.
  - **Anti-Cheat Answer Security**: Correct answers and rationales remain strictly on the server during the test session and are never exposed in the client payload.
  - Interactive question palette with status indicators: *Answered*, *Not Answered*, *Marked for Review*, *Marked + Answered*, *Not Visited*.
  - Clear response, previous/next navigation, and mark-for-review bookmarks.
  - **Deadline-based Timer Resilience**: Survives browser reloads, refreshes, or restarts without resetting.
  - Auto-submits when the timer reaches `00:00:00`.
  - Tab visibility monitoring with anti-distraction alerts.
- **📘 Practice Mode**:
  - Untimed, question-by-question study mode.
  - Instant visual feedback (green checkmark for correct, red cross for incorrect).
  - Immediate display of the correct answer and comprehensive clinical rationales.

### 2. Comprehensive Results & Analytics
- Visual **Score Ring** showing marks obtained out of total questions.
- Key metrics: Total Questions, Attempted, Skipped, Correct, Incorrect, Accuracy %, Time Taken.
- **Question-by-Question Review**: Collapsible accordion cards with candidate answer vs correct answer and detailed clinical rationale.
- Filter chips: *All*, *Incorrect*, *Correct*, *Unattempted*, *Marked*.
- Candidate performance analytics with subject-wise clinical mastery bars (Med-Surg, OBG, Pediatrics, Psychiatry, Community Health, Foundations, Pharmacology).

### 3. Administrator Portal
- **Dashboard Overview**: Metrics on total tests, published tests, draft tests, total questions, total candidates, and total attempts.
- **Test Management**:
  - Create new tests with custom duration, marking scheme, categories, and instructions.
  - One-click **Duplicate Test** to quickly create Test 2, Test 3, etc.
  - Instant Publish / Unpublish toggles.
  - Admin Candidate Preview mode (preview without recording real attempts).
- **Bulk Question Upload**:
  - Drag-and-drop JSON and CSV upload.
  - Live pre-import validation: flags malformed questions, missing explanations, or incorrect option counts.
  - One-click import into any existing or new test.
- **Question Bank**: Searchable and filterable by test, subject, topic, and difficulty with manual question creation and editing.

### 4. 100% Mobile & iOS Safari Responsive
- Built with a modern mobile-first layout.
- Floating Action Button (FAB) + sliding bottom sheet drawer for question palette on mobile screens.
- Avoids text zoom on iOS Safari (`font-size: 16px` on inputs).
- Safe area inset support for modern notch devices (`env(safe-area-inset-bottom)`).
- Full dark mode and light mode toggle.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS.
- **Database**: MongoDB & Mongoose with zero-config local persistent storage adapter fallback (`backend/data/db.json`).

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Clone & Setup
```bash
git clone <repository-url>
cd NORCET
```

### 2. Backend Setup
```bash
cd backend
npm install
node src/utils/seed.js   # Seeds admin, candidate, and all 160 questions into NORCET Mains Test 1
npm run dev             # Starts backend on http://localhost:5000
```

### 3. Frontend Setup (in a separate terminal)
```bash
cd frontend
npm install
npm run dev             # Starts frontend on http://localhost:5173 (and LAN IP)
```

Now open `http://localhost:5173` in your browser!

---

## 🔐 Default Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@norcet.in` | `Admin@123` |
| **Candidate** | `candidate@norcet.in` | `Candidate@123` |

*(You can also use the 1-click Demo buttons on the `/login` page).*

---

## 📁 Question Import Specification

For guidelines on preparing JSON or CSV files for bulk upload, please refer to [QUESTION_IMPORT_FORMAT.md](QUESTION_IMPORT_FORMAT.md) and inspect [sample-questions.json](sample-questions.json).

---

## 🚢 Deployment Guide

### Frontend → Vercel
1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Set **Root Directory** to `frontend`.
4. Add environment variable:
   - `VITE_API_URL`: `https://your-backend-api.onrender.com`
5. Click **Deploy**.

### Backend → Render / Railway
1. Create a new **Web Service** on [Render](https://render.com) or [Railway](https://railway.app).
2. Set **Root Directory** to `backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `<generate-a-strong-random-secret>`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster.mongodb.net/norcet?retryWrites=true&w=majority`

### Database → MongoDB Atlas
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere).
3. Under **Database Access**, create a database user with read/write permissions.
4. Copy the connection string and set it as `MONGODB_URI` in your backend environment variables.

---

## 🧪 Automated Testing

To run the scoring and validator unit tests:
```bash
cd backend
npm test
```

All tests verify floating-point score calculation (+1 / -0.33), edge cases, and question schema validation.
