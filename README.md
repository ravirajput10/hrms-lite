# HRMS Lite

A lightweight Human Resource Management System for managing employees and tracking attendance.

## 🚀 Live Demo

- **Frontend**: [https://hrms-lite.vercel.app](https://hrms-lite.vercel.app)
- **Backend API**: [https://hrms-lite-api.onrender.com](https://hrms-lite-api.onrender.com)

## 📋 Features

### Employee Management
- Add new employees with ID, name, email, and department
- View all employees in a sortable table
- Delete employees

### Attendance Management
- Mark daily attendance (Present/Absent)
- View attendance records by employee
- Filter attendance by date

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TailwindCSS 4, ShadcnUI |
| Backend | Python, FastAPI |
| Database | MongoDB |
| Deployment | Vercel (Frontend), Render (Backend) |

## 📁 Project Structure

```
hrms-lite/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── backend/           # FastAPI backend application
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   └── main.py
│   └── requirements.txt
└── README.md
```

## 🏃 Running Locally

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB (or MongoDB Atlas account)

### Backend Setup

```bash
# Navigate to backend
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

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB connection string

# Run development server
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/
DATABASE_NAME=hrms_lite
CORS_ORIGINS=["http://localhost:5173"]
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

## 📝 API Endpoints

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employees | List all employees |
| POST | /api/employees | Create employee |
| GET | /api/employees/{id} | Get employee |
| DELETE | /api/employees/{id} | Delete employee |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/attendance | List attendance records |
| POST | /api/attendance | Mark attendance |
| GET | /api/attendance/employee/{id} | Get employee attendance |

## ⚠️ Limitations

- Single admin user (no authentication)
- No leave management or payroll features
- Basic reporting only

## 📄 License

MIT
