# React Frontend with HeroUI - Setup Guide

This guide will help you set up and run the new React frontend for the Video Editor application.

## Overview

The frontend has been completely revamped using:
- **React 18** - Modern UI library
- **HeroUI** - Beautiful, accessible UI components (https://www.heroui.com/)
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework

## Features

The React frontend replicates **exactly** the same functionality as the original HTML/JS frontend:

### Step 1: Upload Video & Script
- Upload main video file (MP4, AVI, MOV, MKV)
- Upload transcript text file (.txt)
- Automatic processing and word distribution

### Step 2: Transcript Preview
- Read-only preview of transcript
- Organized by subtitle boxes (based on line breaks)
- Visual feedback for highlighted words
- Real-time preview of current selection

### Step 3: Select Text for Highlights
- Interactive word selection (click, drag, shift+click)
- Upload new video clips
- Select from existing clips
- Assign clips to selected word ranges

### Step 4: Review Your Clips
- View all assigned highlights
- See clip details (file name, word range)
- Remove highlights

### Step 5: Select Text for Music/Audio
- Interactive word selection for audio
- Upload new audio files
- Select from existing audio files
- Adjust volume (0.0 to 2.0)

### Step 6: Review Your Music/Audio
- View all music assignments
- See audio details (file name, volume, word range)
- Delete music assignments

### Step 7: Process Your Video
- Combine all highlights and music
- Process video with progress indicator
- Preserve original audio

### Step 8: Download Result
- Download processed video
- Start new project

## Installation

### Prerequisites

- Node.js 18+ and npm
- Python 3.x with Flask (for backend)

### Step 1: Install Frontend Dependencies

```bash
cd frontend
npm install
```

This will install:
- React and React DOM
- HeroUI components
- Vite
- TailwindCSS
- Framer Motion
- All necessary dev dependencies

### Step 2: Verify Installation

Check that all dependencies are installed:

```bash
npm list --depth=0
```

## Running the Application

### Development Mode

You need to run **both** the backend and frontend:

#### Terminal 1 - Backend (Flask)
```bash
python app.py
```

The backend will run on `http://localhost:5000`

#### Terminal 2 - Frontend (React)
```bash
cd frontend
npm run dev
```

Or use the provided batch file:
```bash
run_react_frontend.bat
```

The frontend will run on `http://localhost:3000`

**Important**: The frontend proxies API requests to the backend, so both must be running!

### Production Mode

#### Step 1: Build the React App
```bash
cd frontend
npm run build
```

This creates an optimized production build in `frontend/dist/`

#### Step 2: Run Flask
```bash
python app.py
```

Flask will automatically detect the React build and serve it from `http://localhost:5000`

## Project Structure

```
Video editing python/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── UploadSection.jsx
│   │   │   ├── TranscriptPreview.jsx
│   │   │   ├── WordSelection.jsx
│   │   │   ├── HighlightsList.jsx
│   │   │   ├── MusicSelection.jsx
│   │   │   ├── MusicList.jsx
│   │   │   ├── ProcessSection.jsx
│   │   │   └── ResultSection.jsx
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── index.html              # HTML template
│   ├── package.json            # Dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # TailwindCSS config
│   └── postcss.config.js       # PostCSS config
├── templates/                   # Original HTML templates
│   └── index.html              # Original frontend (still works)
├── static/                      # Original static files
│   ├── script.js
│   └── styles.css
├── app.py                       # Flask backend (updated)
├── run_react_frontend.bat       # Quick start script
└── REACT_FRONTEND_GUIDE.md      # This file
```

## API Endpoints

The React frontend uses the same API endpoints as the original:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/upload-video-with-txt` | POST | Upload video and transcript |
| `/upload-clip` | POST | Upload video clip or audio file |
| `/process-video` | POST | Process video with highlights |
| `/download/<filename>` | GET | Download processed video |
| `/list-clips` | GET | List available clips and audio |

## Configuration

### Vite Proxy Configuration

The `vite.config.js` file proxies API requests to Flask:

```javascript
server: {
  port: 3000,
  proxy: {
    '/upload-video-with-txt': 'http://localhost:5000',
    '/upload-clip': 'http://localhost:5000',
    '/process-video': 'http://localhost:5000',
    '/download': 'http://localhost:5000',
    '/list-clips': 'http://localhost:5000'
  }
}
```

### TailwindCSS Configuration

HeroUI is configured as a TailwindCSS plugin in `tailwind.config.js`:

```javascript
const { heroui } = require("@heroui/react");

module.exports = {
  plugins: [heroui()],
  // ...
}
```

## Styling

### Theme

The app uses a purple gradient theme matching the original design:
- Background: Purple gradient (`from-purple-600 via-purple-700 to-purple-900`)
- Primary color: Purple
- Success color: Green
- Danger color: Red

### Custom CSS Classes

Word selection uses custom CSS classes defined in `src/index.css`:

- `.word-selectable` - Base style for selectable words
- `.word-selected` - Currently selected words (green background)
- `.word-highlighted` - Already assigned words (yellow background)
- `.word-preview-highlighted` - Preview of assigned words
- `.word-preview-selecting` - Preview of current selection

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can change it in `vite.config.js`:

```javascript
server: {
  port: 3001, // Change to any available port
  // ...
}
```

### Backend Not Responding

Make sure Flask is running on port 5000:
```bash
python app.py
```

### Dependencies Not Installing

Clear npm cache and reinstall:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

Make sure you have the correct Node.js version:
```bash
node --version  # Should be 18+
```

## Comparison with Original Frontend

| Feature | Original | React + HeroUI |
|---------|----------|----------------|
| Framework | Vanilla JS | React 18 |
| UI Components | Custom CSS | HeroUI |
| Styling | Custom CSS | TailwindCSS |
| Build Tool | None | Vite |
| State Management | Global variables | React hooks |
| Component Structure | Single file | Modular components |
| Type Safety | None | JSX |
| Hot Reload | No | Yes (Vite HMR) |
| Production Build | No | Yes (optimized) |

## Benefits of React + HeroUI

1. **Better Performance**: Virtual DOM and optimized rendering
2. **Component Reusability**: Modular, reusable components
3. **Better Developer Experience**: Hot reload, JSX, modern tooling
4. **Accessibility**: HeroUI components are built with React Aria (WCAG compliant)
5. **Maintainability**: Clear component structure and separation of concerns
6. **Scalability**: Easy to add new features and components
7. **Modern UI**: Beautiful, consistent design with HeroUI
8. **Type Safety**: Can easily add TypeScript in the future

## Next Steps

1. **Add TypeScript**: Convert `.jsx` files to `.tsx` for type safety
2. **Add Tests**: Use Vitest or Jest for component testing
3. **Add Error Boundaries**: Better error handling
4. **Add Loading States**: More granular loading indicators
5. **Add Animations**: Leverage Framer Motion for smooth transitions
6. **Add Dark Mode**: HeroUI supports dark mode out of the box
7. **Add Responsive Design**: Optimize for mobile devices

## Support

For issues or questions:
- HeroUI Documentation: https://www.heroui.com/docs/
- React Documentation: https://react.dev/
- Vite Documentation: https://vitejs.dev/

## License

Same as the main project.

