GENERAL INSTALLATION GUIDE SUMMARY

1. Backend Setup
   cd backend
   python -m venv venv
   source venv/Scripts/activate (Windows)
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000

2. Frontend Setup
   cd Performance-Analyzer
   npm install
   npm run dev

Access points:
- Frontend: http://localhost:8080
- Backend: http://127.0.0.1:8000
- API Docs: http://127.0.0.1:8000/docs
