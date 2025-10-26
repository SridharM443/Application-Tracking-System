# 🚀 Hybrid ATS System

A **full-stack MERN-based Applicant Tracking System (ATS)** designed to simplify hiring, role tracking, and candidate management.  
It allows:
- 👨‍💼 **Applicants** to apply for jobs, upload resumes, and track application statuses.
- 👩‍💻 **Admins** to manage job posts, review applications, update progress, and monitor metrics.
- 🤖 **Bot (Mimic)** role to automate screening and log activities.

---

## 🧩 Tech Stack

**Frontend**
- React.js (with Hooks and Router)
- Context API (Authentication)
- Axios for API communication

**Backend**
- Node.js & Express.js
- MongoDB & Mongoose ORM
- JWT Authentication
- dotenv for environment configuration
- Swagger for API documentation

---

## 📁 Project Structure

```
hybrid-ats-system/
├── backend/
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ ├── applicationController.js
│ │ ├── adminController.js
│ │ ├── jobController.js
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ └── errorHandler.js
│ ├── models/
│ │ ├── Application.js
│ │ ├── JobPosting.js
│ │ ├── User.js
│ ├── routes/
│ │ ├── applicationRoutes.js
│ │ ├── adminRoutes.js
│ │ ├── jobRoutes.js
│ ├── utils/
│ │ ├── validators.js
│ │ └── logger.js
│ ├── scripts/
│ │ └── seedData.js
│ └── server.js
│
└── frontend/
├── src/
│ ├── components/
│ │ ├── admin/
│ │ │ ├── ApplicationManager.jsx
│ │ │ ├── JobPostingManager.jsx
│ │ │ ├── MetricsView.jsx
│ │ ├── applicant/
│ │ │ ├── JobList.jsx
│ │ │ ├── MyApplications.jsx
│ │ ├── common/
│ │ │ ├── Navbar.jsx
│ │ │ ├── Loader.jsx
│ │ ├── auth/
│ ├── services/
│ │ ├── adminService.js
│ │ ├── applicationService.js
│ │ ├── jobService.js
│ ├── context/
│ │ └── AuthContext.jsx
│ ├── utils/
│ │ ├── constants.js
│ │ └── helpers.js
```


---

## ⚙️ Setup Instructions

### 1️⃣ Environment Setup

#### Backend `.env`

- PORT=5000
- NODE_ENV=development
- MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/retryWrites=true&w=majority
- JWT_SECRET=your_secret_key
- JWT_EXPIRE=7d
- CORS_ORIGIN=* (For development only)


---

### 2️⃣ Install Dependencies

Backend dependencies
cd backend
npm install

Frontend dependencies
cd ../frontend
npm install


---

### 3️⃣ Start the Application

Start backend
cd backend
npm run dev

Start frontend
cd ../frontend
npm start

---

## 🧠 Seeding the Database

To insert sample users and job postings:
cd backend
node scripts/seedData.js


✅ This creates:
- Admin: `admin@test.com / password123`
- Applicant: `applicant@test.com / password123`
- Bot: `bot@test.com / password123`

If `.env` is outside `scripts/`, add this to the top of your seed script:

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });



---

## 🌐 API Endpoints Overview

### **Applicant Routes**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/applications` | Submit a new job application |
| GET | `/api/applications` | Get all applications (user-specific) |
| GET | `/api/applications/:id` | Fetch application by ID |
| GET | `/api/applications/:id/history` | Get application status history |

---

### **Admin Routes**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| PUT | `/api/admin/applications/:id/status` | Update job application status |
| POST | `/api/admin/applications/:id/comment` | Add comment to an application |
| GET | `/api/admin/metrics` | Get admin dashboard metrics |

---

## 🧪 Sample JSON Requests

#### Create Application  

{
"jobPostingId": "672f8de9e11f1cb1f5f661b4",
"resume": "resume_link_here",
"contactInfo": {
"email": "applicant@test.com",
"phone": "1234567890"
}
}


#### Update Application Status (Admin)  
{
"status": "Offer",
"comment": "Shortlisted for interview"
}


---

## 🧰 Features Overview

- Secure JWT-based authentication
- Role-based access control (Applicant, Admin, Bot)
- Application status tracking with history logs
- Metrics dashboard for admin analysis
- Comprehensive job posting CRUD system
- Validations and error handling middleware
---

## 🚀 Deployment

- **Frontend:** Render
- **Backend:** Render
- **Database:** MongoDB Atlas
- Link - https://application-tracking-system-2-2hpg.onrender.com/login
- Swagger API Documentation - https://application-tracking-system-1-tdrv.onrender.com/api-docs/

---

## 📄 License

Licensed under the **MIT License**.

---

## 👨‍💻 Author

**Sridhar**  
Full Stack Developer 

---



