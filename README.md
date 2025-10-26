# 🚀 Hybrid ATS System

A **Hybrid Applicant Tracking System (ATS)** that simplifies recruitment workflows for **Applicants, Admins, and Automated Bots**.
This project is built with a **MERN Stack (MongoDB, Express.js, React.js, Node.js)** and designed for modular scalability, real-time tracking, and secure role-based access.

---

## 🧩 Project Structure

```
hybrid-ats-system/
├── backend/                    
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   ├── swagger.js
│   └── package.json
│
└── frontend/                   
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── auth/           (Login, Register)
    │   │   ├── applicant/      (Dashboard, JobList, MyApplications)
    │   │   ├── admin/          (Dashboard, ApplicationManager, JobPostingManager, MetricsView)
    │   │   ├── bot/            (Dashboard, TechnicalApps, AutomationLogs)
    │   │   └── common/         (Navbar, ProtectedRoute, Loader)
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── applicationService.js
    │   │   ├── adminService.js
    │   │   ├── botService.js
    │   │   └── jobService.js
    │   ├── utils/
    │   │   ├── constants.js
    │   │   └── helpers.js
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── .env
    └── package.json

```

---

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router, Axios, Context API, TailwindCSS/CSS Modules
- **Backend:** Node.js, Express.js, MongoDB Atlas, JWT Authentication, CORS, dotenv, Swagger
- **Deployment:** Render (Backend), Vercel/Netlify (Frontend)

---

## ⚙️ Environment Variables

**Backend `.env`**

```
PORT=8080
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CORS_ORIGIN=*
```

**Frontend `.env`**

```
REACT_APP_API_URL=https://your-backend.onrender.com
```

---

## 🏗️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/hybrid-ats-system.git
cd hybrid-ats-system
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create `.env` and add backend environment variables.
Run backend locally:

```bash
npm start
```

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
```

Create `.env` with frontend API URL.
Run frontend locally:

```bash
npm start
```

---

## 🌐 Deployment

**Backend (Render):**

* Connect GitHub repo
* Set environment variables
* Build Command: `npm install`
* Start Command: `npm start`

**Frontend (Vercel / Netlify):**

* Add backend API URL in `.env`:

```
REACT_APP_API_URL=https://hybrid-ats-backend.onrender.com
```

---

## 📘 API Documentation

Swagger is integrated.
Access docs locally:

```
http://localhost:8080/api-docs
```

Or on deployed backend:


[https://hybrid-ats-backend.onrender.com/api-docs](https://application-tracking-system-1-tdrv.onrender.com/api-docs)](https://application-tracking-system-1-tdrv.onrender.com/api-docs)


---

## 🧪 Testing

Backend tests:

```bash
npm test
```

Frontend tests:

```bash
npm run test
```

---

## 📊 Future Enhancements

* AI-based resume screening
* Email & SMS notifications
* Real-time WebSocket updates
* Advanced role-based access control

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 🧑‍💻 Author

**Sridhar M**


---


