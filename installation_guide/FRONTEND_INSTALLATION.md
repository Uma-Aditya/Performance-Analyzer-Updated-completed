# ⚛️ Frontend Installation Guide

The frontend is a modern React application built with **Vite**, **TypeScript**, and **TailwindCSS**.

## 📋 Prerequisites
- **Node.js**: Version 18.0 or higher.
- **npm**: (Included with Node.js).

## ⚙️ Installation Steps

### 1. Navigate to the Frontend Directory
```cmd
cd Performance-Analyzer
```

### 2. Install Package Dependencies
```cmd
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `Performance-Analyzer/` directory if you need to override the default API URL.
```bash
VITE_API_BASE_URL=http://localhost:8000
```

### 4. Start the Development Server
```cmd
npm run dev
```

### 5. Access the Application
By default, the Vite server is configured to run on port **8080**.
- Open `http://localhost:8080` in your browser.

---

## 🏗️ Production Build
If you want to build the project for deployment:
```cmd
npm run build
```
The output will be generated in the `dist/` folder. You can preview the build locally using:
```cmd
npm run preview
```

## 🛠️ Troubleshooting
- **Node Modules Error**: If you face issues after an update, delete `node_modules` and `package-lock.json` and run `npm install` again.
- **Port 8080 used**: Vite will automatically try the next available port (e.g., 8081). Check the terminal output for the exact URL.
