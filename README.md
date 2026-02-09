# HRMS Lite

A lightweight Human Resource Management System for managing employees and tracking attendance.

## 🚀 Live Demo

- **Frontend**: [https://hrms-lite-frontend-beta.vercel.app](https://hrms-lite-frontend-beta.vercel.app)
- **Backend API**: [https://hrms-lite-api-vi50.onrender.com](https://hrms-lite-api-vi50.onrender.com)
- **API Docs**: [https://hrms-lite-api-vi50.onrender.com/docs](https://hrms-lite-api-vi50.onrender.com/docs)

## 📋 Features

### Employee Management
- Add new employees (auto-generated unique ID)
- View all employees in a sortable table
- View attendance summary per employee
- Delete employees

### Attendance Management
- Mark daily attendance (Present/Absent)
- View attendance records filtered by date
- Visual attendance statistics on dashboard

### Dashboard
- Total employees count
- Today's attendance overview
- Overall attendance rate statistics

### UI/UX
- Collapsible sidebar navigation
- Responsive design
- Modern gradient styling

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, TailwindCSS 4, Radix UI |
| Backend | Python 3.11, FastAPI |
| Database | MongoDB Atlas |
| Deployment | Vercel (Frontend), Render (Backend) |

## 📁 Project Structure

```
hrms-lite/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/  # UI components (layout, ui)
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # React Query hooks
│   │   ├── services/    # API service layer
│   │   └── types/       # TypeScript types
│   └── package.json
├── backend/           # FastAPI backend application
│   ├── app/
│   │   ├── models/    # Pydantic schemas
│   │   ├── routes/    # API endpoints
│   │   ├── config.py  # Settings management
│   │   ├── database.py # MongoDB connection
│   │   └── main.py    # FastAPI app entry
│   └── requirements.txt
├── render.yaml        # Render deployment config
└── README.md
```

## 🏃 Running Locally

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB (local or Atlas account)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB connection string

# Run development server
uvicorn app.main:app --reload
```

Backend: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Run development server
npm run dev
```

Frontend: `http://localhost:5173`

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/hrms_lite
DATABASE_NAME=hrms_lite
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## 📝 API Endpoints

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employees | List all employees |
| POST | /api/employees | Create employee (ID auto-generated) |
| GET | /api/employees/{id} | Get employee by ID |
| DELETE | /api/employees/{id} | Delete employee |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/attendance | List attendance records |
| POST | /api/attendance | Mark attendance |
| GET | /api/attendance/summary/{id} | Get employee attendance summary |

## 📄 License

MIT
