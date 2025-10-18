# Video Editor Frontend

A web-based frontend for the video editing script that allows you to easily upload videos, select text for highlights, and add overlay clips.

## Features

✅ **Upload Main Video** - Drag and drop or select your main video file  
✅ **Auto-Transcription** - Automatically generates transcript using Whisper AI  
✅ **Text Selection** - Click and select words from the transcript to highlight  
✅ **Upload Clips/Audio** - Add video clips or audio files for each highlight  
✅ **Visual Preview** - See all your highlights before processing  
✅ **One-Click Processing** - Process and download your edited video  

## Installation

1. Install Flask (already added to requirements.txt):
```bash
pip install -r requirements.txt
```

2. Make sure all dependencies are installed (OpenCV, MoviePy, Whisper, etc.)

## Usage

1. **Start the Flask server:**
```bash
python app.py
```

2. **Open your browser:**
Navigate to `http://localhost:5000`

3. **Upload your video:**
   - Click "Choose Video File" and select your main video
   - Choose the Whisper model (base is recommended)
   - Click "Upload & Generate Transcript"
   - Wait for the transcript to be generated

4. **Add highlights:**
   - Click on words in the transcript to select them
   - Hold Shift and click to extend selection
   - Upload a video clip or audio file for that highlight
   - Or select from existing clips in the dropdown
   - Adjust music volume if needed
   - Click "Add Highlight"

5. **Process video:**
   - Review all your highlights
   - Click "Process Video"
   - Wait for processing to complete (this may take a while)
   - Download your processed video!

## How It Works

### Step 1: Upload Main Video
The frontend uploads your video to the server and uses Whisper AI to generate a word-by-word transcript with timestamps.

### Step 2: Select Text for Highlights
Click on words in the transcript to select them. The selected text will be highlighted in yellow. You can:
- Click a word to start selection
- Shift+Click to extend selection
- Click "Cancel" to clear selection

### Step 3: Add Clips/Audio
For each selected text:
- Upload a new video clip or audio file, OR
- Select from existing clips in the dropdown
- Set the music volume (0.0 to 2.0)
- Click "Add Highlight"

The selected words will turn green to show they have a highlight assigned.

### Step 4: Process & Download
Click "Process Video" to render your final video with:
- Subtitles for highlighted text
- Overlay video clips during those moments
- Background audio/music
- Original video audio preserved

## File Structure

```
.
├── app.py                 # Flask backend server
├── templates/
│   └── index.html        # Main HTML page
├── static/
│   ├── styles.css        # Styling
│   └── script.js         # Frontend JavaScript
├── uploads/              # Uploaded main videos (auto-created)
├── outputs/              # Processed videos (auto-created)
├── clips/                # Video clips for overlays
└── audio_files/          # Audio files for background music
```

## Tips

- **Whisper Models:**
  - `tiny` - Fastest, least accurate
  - `base` - Good balance (recommended)
  - `small` - Better accuracy, slower
  - `medium` - High accuracy, much slower
  - `large` - Best accuracy, very slow

- **File Formats:**
  - Videos: MP4, AVI, MOV, MKV
  - Audio: MP3, WAV, AAC, M4A

- **Performance:**
  - Processing time depends on video length and number of highlights
  - Larger Whisper models take longer but are more accurate
  - Keep video files under 500MB for best performance

## Troubleshooting

**"Error processing video"**
- Make sure all required dependencies are installed
- Check that FFmpeg is available in the `ffmpeg/bin` folder
- Verify that uploaded clips/audio files are valid

**"Transcript generation failed"**
- Ensure the video has audio
- Try a different Whisper model
- Check that the video file is not corrupted

**"Cannot upload file"**
- Check file size (max 500MB)
- Verify file format is supported
- Ensure you have write permissions in the project folder

## Advanced Usage

You can still use the command-line interface:
```bash
python video_overlay_script.py --main-video input.mp4 --config project.json --output output.mp4
```

The web frontend generates the same configuration internally and calls the same processing functions.

