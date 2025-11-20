# 🚀 EngageHub - Employee Management System

A modern, full-stack employee management platform built with **FastAPI** and **React** that streamlines HR operations and enhances employee engagement through intuitive task management, performance tracking, and rewards systems.

![FastAPI](https://img.shields.io/badge/FastAPI-0.118.0-009688?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat-square&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.14-38B2AC?style=flat-square&logo=tailwind-css)

---

## ✨ Features

### 👥 For Employees
- **📋 Task Management** - View assigned tasks, track progress, and submit completion reports
- **📊 Performance Reviews** - Access performance evaluations and feedback
- **🏆 Rewards Tracking** - Monitor achievements and recognition
- **🏖️ Leave Requests** - Submit and track leave applications
- **👤 Profile Management** - Update personal information and view employment details

### 🛡️ For HR Managers
- **📈 Dashboard Overview** - Real-time statistics on employees, tasks, leaves, and performance
- **👨‍💼 Employee Management** - Comprehensive employee database with role management
- **✅ Approval System** - Review and approve new employee registrations
- **📝 Task Assignment** - Create and assign tasks with priorities, categories, and due dates
- **📊 Performance Tracking** - Submit and monitor employee performance reviews
- **🎁 Rewards Management** - Award points and recognize outstanding performance
- **📅 Leave Administration** - Review and approve/reject leave requests

---

## 🏗️ Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **MongoDB** - NoSQL database with Motor (async driver)
- **Pydantic** - Data validation and settings management
- **JWT Authentication** - Secure token-based auth with 7-day expiry
- **Bcrypt** - Password hashing and security
- **Python-JOSE** - JSON Web Token implementation

### Frontend
- **React 19.1.1** - Modern UI library with latest features
- **Vite 7.1.7** - Lightning-fast build tool and dev server
- **React Router DOM** - Client-side routing
- **TailwindCSS 4.1.14** - Utility-first CSS framework
- **Lucide React** - Beautiful, consistent icons
- **Axios** - HTTP client with interceptors
- **js-cookie** - Cookie management for auth tokens

---

## 📁 Project Structure

```
EngageHub/
├── backend/
│   ├── app/
│   │   ├── core/              # Security, middleware
│   │   ├── models/            # Pydantic models (User, Task, Leave, etc.)
│   │   ├── routes/            # API endpoints
│   │   ├── utils/             # Helper functions
│   │   ├── config.py          # Configuration settings
│   │   ├── database.py        # MongoDB connection
│   │   └── main.py            # FastAPI application
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios API client
│   │   ├── components/        # Reusable components
│   │   ├── pages/
│   │   │   ├── dashboards/    # Employee & HR dashboards
│   │   │   │   ├── employee/  # Employee-specific pages
│   │   │   │   └── hr/        # HR-specific pages
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.8+** installed
- **Node.js 18+** and npm installed
- **MongoDB** instance running (local or cloud)

### 1️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with MongoDB connection
echo MONGODB_URL=mongodb://localhost:27017 > .env
echo SECRET_KEY=your-secret-key-here >> .env

# Run the server
uvicorn app.main:app --reload
```

Backend will run on: **http://127.0.0.1:8000**

### 2️⃣ Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on: **http://localhost:5173**

---

## 🔐 Environment Variables

### Backend (.env)
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=engagehub
SECRET_KEY=your-super-secret-jwt-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=7
```

### Frontend
No environment variables required - API base URL is configured in `src/api/index.js`

---

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

### Key API Endpoints

#### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

#### Tasks
- `POST /tasks/` - Create task (HR only)
- `GET /tasks/my-tasks` - Get employee's tasks
- `PATCH /tasks/{task_id}` - Update task status
- `GET /tasks/statistics` - Get task analytics

#### Employees
- `GET /employees/` - List all employees (HR only)
- `GET /employees/statistics` - Get employee stats
- `PATCH /employees/{email}/approve` - Approve employee (HR only)

#### Leaves
- `POST /leaves/` - Submit leave request
- `GET /leaves/my-leaves` - Get employee's leaves
- `PATCH /leaves/{leave_id}` - Approve/reject leave (HR only)

#### Performance & Rewards
- `POST /performance/` - Submit performance review (HR only)
- `GET /performance/my-reviews` - Get employee's reviews
- `POST /rewards/` - Award points (HR only)
- `GET /rewards/my-rewards` - Get employee's rewards

---

## 👥 User Roles

### Employee
- Default role for new registrations
- Requires HR approval before accessing dashboard
- Can manage own tasks, leaves, and view performance/rewards

### HR Manager
- Set `is_hr: true` in MongoDB user document
- Full access to all management features
- Can approve employees, assign tasks, review performance

---

## 🎨 Design Features

- **Glassmorphism UI** - Modern frosted glass effects
- **Gradient Backgrounds** - Beautiful color transitions
- **Responsive Design** - Mobile-friendly layouts
- **Smooth Animations** - Hover effects and transitions
- **Intuitive Navigation** - Grouped sections with visual separators
- **Status Badges** - Color-coded status indicators
- **Loading States** - Skeleton loaders and spinners

---

## 🔧 Development

### Backend Development
```bash
# Run with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📝 Database Collections

- **users** - User accounts with roles and approval status
- **tasks** - Task assignments with status tracking
- **leaves** - Leave requests and approvals
- **performance** - Performance review records
- **rewards** - Employee recognition and points
- **projects** - Project management (if used)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🐛 Troubleshooting

### Backend won't start
- Ensure MongoDB is running and accessible
- Check `.env` file has correct `MONGODB_URL`
- Verify all dependencies are installed: `pip install -r requirements.txt`

### Frontend can't connect to backend
- Check backend is running on http://127.0.0.1:8000
- Verify CORS settings in `backend/app/main.py`
- Check API base URL in `frontend/src/api/index.js`

### Authentication issues
- Clear browser cookies
- Check JWT token expiry (default 7 days)
- Verify `SECRET_KEY` is set in backend `.env`

---

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

<div align="center">
  <strong>Built with ❤️ using FastAPI and React</strong>
  <br>
  <sub>Modern Employee Management Made Simple</sub>
</div>
