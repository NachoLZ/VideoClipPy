# 🚀 Quick Start Guide - Video Editor Frontend

## Start the Frontend (Easy Way)

### Option 1: Double-click the batch file
Simply double-click `start_frontend.bat` and your browser will be ready to go!

### Option 2: Command line
```bash
python app.py
```

Then open your browser to: **http://localhost:5000**

---

## How to Use (Step-by-Step)

### 📹 Step 1: Upload Your Main Video
1. Click the **"Choose Video File"** button
2. Select your video (MP4, AVI, MOV, or MKV)
3. Choose a Whisper model:
   - **Tiny** = Super fast, less accurate
   - **Base** = Recommended (good balance)
   - **Small/Medium/Large** = More accurate, slower
4. Click **"Upload & Generate Transcript"**
5. Wait for the transcript to be generated (this may take a minute)

### ✍️ Step 2: Highlight Words for Subtitles
1. You'll see your transcript displayed as clickable words
2. **Click and drag** across multiple words to select them (easiest method!)
3. **OR click** one word, then **Shift+Click** another to select the range
4. The selected words will turn **yellow** with a glow effect

### 🎬 Step 3: Add Video Clip or Audio
For each highlighted section:
1. **Upload a new file:**
   - Click "Choose File" under "Upload Clip/Audio"
   - Select a video clip (MP4, AVI, MOV) or audio file (MP3, WAV)
   - Click "Upload"

2. **OR select an existing file:**
   - Choose from the dropdown menu
   - Files in `clips/` folder (📹 videos)
   - Files in `audio_files/` folder (🎵 audio)

3. **Adjust volume** (optional):
   - Use the slider to set music volume (0.0 to 2.0)
   - Default is 1.0

4. Click **"Add Highlight"**
   - The selected words will turn **green**
   - The highlight appears in the list below

### 🎥 Step 4: Process Your Video
1. Review all your highlights in the list
2. Remove any you don't want (click 🗑️ Remove)
3. Click **"Process Video"**
4. Wait for processing (this can take several minutes depending on video length)
5. Click **"Download Processed Video"** when done!

---

## 💡 Tips & Tricks

### Selecting Text
- **Click and drag** = Select multiple words (easiest!)
- **Single click** = Select one word
- **Shift+click** = Extend selection from first word to clicked word
- **Click "Cancel"** = Clear current selection
- **Green words** = Already have a highlight assigned (can't select these)
- **Yellow words** = Currently selected (with glow effect)

### File Management
- Videos go in the `clips/` folder
- Audio files go in the `audio_files/` folder
- You can pre-load files there before starting the app
- Uploaded files are automatically saved to these folders

### Performance
- **Short videos** (< 2 min) = Process in 1-3 minutes
- **Medium videos** (2-5 min) = Process in 5-10 minutes
- **Long videos** (> 5 min) = May take 15+ minutes
- Processing time also depends on number of highlights

### Best Practices
1. **Test with a short video first** to understand the workflow
2. **Use the "base" Whisper model** for most cases
3. **Keep clips short** (5-15 seconds) for best results
4. **Don't close the browser** while processing
5. **Check the console** for any error messages

---

## 📁 What Gets Created

```
uploads/          ← Your uploaded main videos
outputs/          ← Your processed final videos
clips/            ← Video clips for overlays
audio_files/      ← Audio/music files
```

---

## ❓ Troubleshooting

### "Error uploading video"
- Check file size (max 500MB)
- Make sure it's a valid video format
- Try a different video file

### "Error processing video"
- Make sure you added at least one highlight
- Check that clip/audio files exist
- Look at the terminal/console for detailed error messages

### "Transcript generation failed"
- Make sure your video has audio
- Try a different Whisper model
- Check that the video isn't corrupted

### Server won't start
- Make sure Flask is installed: `pip install Flask`
- Check that port 5000 isn't already in use
- Try running: `python app.py` directly

### Page won't load
- Make sure the server is running (check the terminal)
- Try http://127.0.0.1:5000 instead
- Clear your browser cache

---

## 🎯 Example Workflow

1. **Upload** `my_video.mp4`
2. **Wait** for transcript (30 seconds)
3. **Select** "Hello world" in the transcript
4. **Upload** a cool animation clip
5. **Add highlight**
6. **Select** "Thank you for watching"
7. **Upload** an outro music file
8. **Add highlight**
9. **Process video**
10. **Download** your edited video!

---

## 🔧 Advanced: Using Existing Clips

If you already have clips in the `clips/` or `audio_files/` folders:
1. They'll automatically appear in the dropdown
2. Just select them instead of uploading new ones
3. Much faster workflow!

---

## 🎨 What the Output Looks Like

Your final video will have:
- ✅ Original video playing
- ✅ Subtitles appearing for highlighted text
- ✅ Video overlays during those moments
- ✅ Background music/audio during highlights
- ✅ Original audio preserved
- ✅ Smooth transitions

---

## Need Help?

Check the terminal/console where you ran `python app.py` for detailed logs and error messages.

**Happy Editing! 🎬✨**

