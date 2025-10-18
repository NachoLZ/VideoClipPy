# ✅ NEW WORKFLOW: Line-by-Line Subtitles

## 🎯 What Changed?

The client requested a **two-step workflow** where subtitles are defined FIRST by line breaks in the TXT file, THEN clips/audio are assigned to each subtitle.

### Old Workflow ❌
1. Upload video + TXT file
2. All words appear in one big block
3. Manually select words to create subtitles
4. Assign clips to selected words

### New Workflow ✅
1. Upload video + TXT file (with line breaks!)
2. **Each line becomes a subtitle box automatically**
3. Click "Assign Clip/Audio" on each subtitle box
4. Choose clip/audio for that subtitle
5. Process video!

---

## 📝 TXT File Format

**IMPORTANT:** Each line in your TXT file becomes ONE subtitle!

### Example:

```
Look if you're suffering from neuropathy I need to ask you three quick questions
I need you to answer them honestly
Because what I'm about to reveal could explain why nothing you've tried has ever worked
```

This creates **3 subtitle boxes**:
- **Subtitle #1:** "Look if you're suffering from neuropathy I need to ask you three quick questions"
- **Subtitle #2:** "I need you to answer them honestly"
- **Subtitle #3:** "Because what I'm about to reveal could explain why nothing you've tried has ever worked"

---

## 🎬 Step-by-Step Guide

### Step 1: Create Your TXT File

Open Notepad or any text editor and write your script with **one subtitle per line**:

```
First subtitle text here
Second subtitle text here
Third subtitle text here
```

**Tips:**
- Press **Enter** to create a new subtitle
- Each line = one subtitle box
- Empty lines are ignored
- No special formatting needed!

### Step 2: Upload Files

1. Start the server: `python app.py`
2. Open browser: `http://localhost:5000`
3. Choose your video file
4. Choose your TXT file
5. Click "Upload & Process"

### Step 3: Assign Clips to Subtitles

You'll see subtitle boxes like this:

```
┌──────────────────────────────────────────────────────┐
│  #1  │  SUBTITLE 1                                   │
│      │  "Look if you're suffering from neuropathy..."│
│      │  Words 1-15 (15 words)                        │
│      │  [📹 Assign Clip/Audio]                       │
└──────────────────────────────────────────────────────┘
```

For each subtitle:
1. Click **"📹 Assign Clip/Audio"**
2. Choose a video clip or audio file
3. Set the volume
4. Click "Add Highlight"
5. The subtitle box updates to show the assignment! ✅

### Step 4: Process Video

Once all subtitles have clips assigned:
1. Click "Process Video"
2. Wait for processing
3. Download your edited video!

---

## 🎨 Visual Feedback

### Before Assignment:
```
┌──────────────────────────────────────────────────────┐
│  #1  │  SUBTITLE 1                                   │
│      │  "Your subtitle text here"                    │
│      │  [📹 Assign Clip/Audio]  ← Click this!        │
└──────────────────────────────────────────────────────┘
```

### After Assignment:
```
┌──────────────────────────────────────────────────────┐
│  #1  │  SUBTITLE 1                                   │
│      │  "Your subtitle text here"                    │
│      │  ✅ Assigned: 📹 Video: neuropathy.mp4        │
│      │  Volume: 1.0  [Remove]                        │
└──────────────────────────────────────────────────────┘
```

---

## 🔧 Technical Changes

### Backend (`app.py`):
- Modified `/upload-video-with-txt` route to split TXT by lines
- Returns `subtitles` array with start_word, end_word for each line
- Each subtitle knows which words it contains

### Frontend (`static/script.js`):
- New `displaySubtitles()` function replaces `displayTranscript()`
- Creates subtitle boxes instead of word-by-word display
- `assignClipToSubtitle(index)` function auto-selects words for that subtitle
- `removeAssignment(index)` function to unassign clips
- Subtitle boxes update visually when clips are assigned

### Styling (`static/styles.css`):
- New `.subtitle-box` styles with hover effects
- `.subtitle-box-header` with purple gradient
- `.assigned-clip-info` with green success styling
- Responsive and modern design

---

## 📋 Example Workflow

### 1. Create `my_script.txt`:
```
Welcome to our product demonstration
This is the best solution for your needs
Try it today and see the difference
```

### 2. Upload:
- Video: `demo.mp4`
- Script: `my_script.txt`

### 3. You'll see 3 subtitle boxes:
- **Subtitle #1:** "Welcome to our product demonstration"
- **Subtitle #2:** "This is the best solution for your needs"
- **Subtitle #3:** "Try it today and see the difference"

### 4. Assign clips:
- Subtitle #1 → `intro.mp4`
- Subtitle #2 → `product_demo.mp4`
- Subtitle #3 → `cta_music.mp3`

### 5. Process and download! 🎉

---

## 🚀 Benefits

✅ **Easier to organize** - See all subtitles at once
✅ **No manual selection** - Line breaks define subtitles automatically
✅ **Clear visual feedback** - See which subtitles have clips assigned
✅ **Faster workflow** - No need to drag-select words
✅ **Better for clients** - Simple TXT file format, one line = one subtitle

---

## 🐛 Troubleshooting

**Q: My subtitles are too long!**
A: Add more line breaks in your TXT file to split them up.

**Q: I have too many subtitle boxes!**
A: Combine lines in your TXT file (remove line breaks).

**Q: Can I skip assigning a clip to a subtitle?**
A: Yes! Only subtitles with assigned clips will have overlays. Others will just show the text.

**Q: How do I change a subtitle's text?**
A: Edit your TXT file and re-upload.

---

## 📞 Support

If you have questions or need help, check:
- `README.md` - General documentation
- `example_script.txt` - Example TXT file format
- This guide - New workflow explanation

Happy editing! 🎬✨

