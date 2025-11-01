# Video Editor Frontend - React + HeroUI

This is a modern React frontend for the Video Editor application, built with HeroUI components and Vite.

## Features

- **Step 1**: Upload video and transcript (.txt file)
- **Step 2**: Preview transcript with subtitle labels
- **Step 3**: Interactive word selection for highlights (click/drag/shift-click)
- **Step 4**: Review and manage assigned clips
- **Step 5**: Select text for music/audio overlay
- **Step 6**: Review and manage music assignments
- **Step 7**: Process video with all highlights and music
- **Step 8**: Download the processed video

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **HeroUI** - Beautiful React UI components
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library (used by HeroUI)

## Installation

```bash
cd frontend
npm install
```

## Development

To run the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

**Important**: Make sure the Flask backend is running on `http://localhost:5000` before using the frontend.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Endpoints

The frontend communicates with the following Flask backend endpoints:

- `POST /upload-video-with-txt` - Upload video and transcript
- `POST /upload-clip` - Upload video clips or audio files
- `POST /process-video` - Process the video with highlights
- `GET /download/<filename>` - Download processed video
- `GET /list-clips` - List available clips and audio files

## Component Structure

```
src/
├── App.jsx                      # Main app component with state management
├── main.jsx                     # Entry point
├── index.css                    # Global styles
└── components/
    ├── UploadSection.jsx        # Step 1: File upload
    ├── TranscriptPreview.jsx    # Step 2: Read-only preview
    ├── WordSelection.jsx        # Step 3: Interactive word selection
    ├── HighlightsList.jsx       # Step 4: Highlights review
    ├── MusicSelection.jsx       # Step 5: Music word selection
    ├── MusicList.jsx            # Step 6: Music review
    ├── ProcessSection.jsx       # Step 7: Video processing
    └── ResultSection.jsx        # Step 8: Download result
```

## Functionality

### Word Selection

The word selection feature allows users to:
- Click and drag to select multiple words
- Click one word, then Shift+Click another to select a range
- Selected words are highlighted in green
- Already assigned words are highlighted in yellow

### File Management

- Upload video clips and audio files
- Select from previously uploaded files
- Automatic file type detection (video vs audio)

### Volume Control

- Adjust music/audio volume with a slider (0.0 to 2.0)
- Default volume is 1.0

## Styling

The app uses a purple gradient theme matching the original design:
- Primary color: Purple (#667eea to #764ba2)
- Success color: Green (#48bb78)
- Danger color: Red (#f56565)

Custom CSS classes for word selection:
- `.word-selectable` - Base style for selectable words
- `.word-selected` - Currently selected words (green)
- `.word-highlighted` - Already assigned words (yellow)
- `.word-preview-highlighted` - Preview of assigned words
- `.word-preview-selecting` - Preview of current selection

