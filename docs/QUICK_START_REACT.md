# Quick Start - React Frontend

Get the new React + HeroUI frontend running in 3 simple steps!

## Prerequisites

- Node.js 18+ installed
- Python 3.x with Flask installed

## Step 1: Install Dependencies

Open a terminal and run:

```bash
cd frontend
npm install
```

Wait for all packages to install (this may take a few minutes the first time).

## Step 2: Start the Backend

Open a **new terminal** and run:

```bash
python app.py
```

You should see:
```
* Running on http://127.0.0.1:5000
```

Keep this terminal open!

## Step 3: Start the Frontend

You have two options:

### Option A: Use the batch file (Windows)
Double-click `run_react_frontend.bat`

### Option B: Manual start
Open another terminal and run:

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

## Step 4: Open Your Browser

Navigate to: **http://localhost:3000**

You should see the Video Editor interface with the purple gradient background!

## That's It! 🎉

The React frontend is now running and connected to your Flask backend.

## What's Different?

The new frontend looks and works **exactly** like the original, but with:
- ✨ Modern React components
- 🎨 Beautiful HeroUI design system
- ⚡ Fast Vite development server
- 🔥 Hot module replacement (changes update instantly)
- 📱 Better accessibility
- 🎯 Cleaner, more maintainable code

## Troubleshooting

### "Port 3000 is already in use"
Change the port in `frontend/vite.config.js`:
```javascript
server: {
  port: 3001, // Use a different port
  // ...
}
```

### "Cannot connect to backend"
Make sure Flask is running on port 5000:
```bash
python app.py
```

### "npm: command not found"
Install Node.js from: https://nodejs.org/

## Production Build

To create an optimized production build:

```bash
cd frontend
npm run build
```

Then just run Flask:
```bash
python app.py
```

Flask will automatically serve the React build from `http://localhost:5000`

## Need Help?

See the full guide: `REACT_FRONTEND_GUIDE.md`

