# Auto-Edit Video Overlay Pipeline with React UI

This project provides a powerful video editing pipeline that transforms a simple talking-head video into a professionally edited clip with animated overlays, timed subtitles, and background music. The entire process is managed through a modern, user-friendly React web interface.

**[Live Demo Link]** - **[Project GIF]**

## Key Features

### Web Interface (React + HeroUI)
- **Modern & Intuitive:** A clean and beautiful interface built with React and the HeroUI design system.
- **Easy Video Upload:** Simply drag and drop your main video file to get started.
- **Interactive Transcript:** The system automatically generates a transcript of your video.
- **Click-and-Drag Selection:** Select words or phrases directly from the transcript to apply effects.
- **Clip & Audio Assignment:** Easily assign overlay videos or audio tracks to your selected text.
- **Visual Preview:** See all your planned edits and highlights before processing.
- **One-Click Processing:** Render and download your final video with a single click.

### Video Processing Backend (Python)
- **Automated Overlays:** Add secondary video clips (B-roll) that appear for specific phrases.
- **Timed Subtitles:** Automatically generate subtitles from your script or transcript.
- **Advanced Audio Mixing:** Preserve original audio, add music to specific highlights, or add a global background track.
- **Efficient Rendering:** The Python backend uses OpenCV and MoviePy to handle all video processing.

## Technology Stack

- **Frontend:** React, Vite, HeroUI
- **Backend:** Python, Flask
- **Video Processing:** OpenCV, MoviePy
- **Transcription:** Whisper AI (optional, can also use a `.txt` script)

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Start the Backend Server

Open a terminal and run:
```bash
python app.py
```
The backend will be running at `http://localhost:5000`.

### 3. Start the Frontend Development Server

Open a **new** terminal and run:
```bash
cd frontend
npm run dev
```
The React frontend will be available at `http://localhost:3000`.

## How It Works

1.  **Upload:** Upload your main video through the React interface.
2.  **Transcribe/Script:** The system either generates a transcript using Whisper AI or uses a `.txt` file you provide.
3.  **Select & Assign:** Click and drag to select words in the transcript. For each selection, you can assign an overlay video clip and/or an audio track.
4.  **Process:** Click the "Process Video" button. The Flask backend takes your video and the editing instructions and uses `video_overlay_script.py` to:
    *   Render subtitles frame-by-frame.
    *   Overlay the assigned video clips.
    *   Mix the audio tracks.
5.  **Download:** Once processing is complete, you can download the final, edited video.

## Project Structure

```
.
├── app.py                 # Flask backend server
├── video_overlay_script.py  # Main video processing script
├── frontend/              # React frontend application
│   ├── src/
│   └── package.json
├── templates/             # Original HTML templates (for non-React version)
├── static/                # Original CSS/JS (for non-React version)
├── clips/                 # Folder for overlay video clips
├── audio_files/           # Folder for audio files
├── uploads/               # Where uploaded videos are stored
└── outputs/               # Where processed videos are saved