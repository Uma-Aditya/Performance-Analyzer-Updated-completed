# 🐍 Backend Installation Guide

The backend is built with **FastAPI** and uses **SQLite** as the primary database. Follow these steps for a proper installation.

## 📋 Prerequisites
- **Python**: Version 3.10 or higher.
- **pip**: Python package manager.

## ⚙️ Installation Steps

### 1. Navigate to the Backend Directory
```cmd
cd backend
```

### 2. Create a Virtual Environment
It is highly recommended to use a virtual environment to avoid dependency conflicts.
```cmd
python -m venv venv
```

### 3. Activate the Virtual Environment
- **Windows**:
  ```cmd
  venv\Scripts\activate
  ```
- **macOS/Linux**:
  ```bash
  source venv/bin/activate
  ```

### 4. Install Dependencies
```cmd
pip install -r requirements.txt
```

### 5. Setup Environment Variables
Create a file named `.env` in the `backend/` directory (or copy from `.env.example`).
```bash
GEMINI_API_KEY=your_google_gemini_api_key_here
DATABASE_URL=sqlite:///./database.sqlite
ADMIN_USERNAME=superadmin
ADMIN_PASSWORD=superadmin123
```

### 6. Run the Application
The server will start with hot-reload enabled, meaning it will restart automatically when you change the code.
```cmd
uvicorn main:app --reload --port 8000
```

## 🔍 Verification
- Open `http://127.0.0.1:8000/docs` in your browser.
- You should see the **Swagger UI** with all available API endpoints.

## 🛠️ Troubleshooting
- **Missing DLLs on Windows**: Ensure you have the "Microsoft Visual C++ Redistributable" installed.
- **Port Conflict**: If port 8000 is taken, use `--port 8001` (Note: You must then update the frontend configuration to point to the new port).
