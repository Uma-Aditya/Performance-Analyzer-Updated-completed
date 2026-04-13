# 🛠️ Performance Analyzer Installation Guide

This directory contains detailed instructions for setting up the Performance Analyzer application. Follow the guides below to get the project running on your local machine.

## 📂 Guides
1. [Backend Setup Guide](./BACKEND_INSTALLATION.md)
2. [Frontend Setup Guide](./FRONTEND_INSTALLATION.md)

---

## 🚀 Quick Start Summary
If you are already familiar with the tech stack, here is the rapid setup:

### 1. Backend
```bash
cd backend
python -m venv venv
source venv/Scripts/activate # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend
```bash
cd Performance-Analyzer
npm install
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:8080
- **Backend API**: http://127.0.0.1:8000
- **API Documentation**: http://127.0.0.1:8000/docs
