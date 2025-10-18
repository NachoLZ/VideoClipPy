// Global state
let currentVideoPath = null;
let transcriptData = [];
let subtitles = []; // Subtitle boxes from line breaks in TXT file (for organization only)
let highlights = [];
let selectedRange = null;

// DOM Elements
const mainVideoInput = document.getElementById("main-video-input");
const videoFilename = document.getElementById("video-filename");
const transcriptFileInput = document.getElementById("transcript-file-input");
const transcriptFilename = document.getElementById("transcript-filename");
const uploadBtn = document.getElementById("upload-btn");
const uploadProgress = document.getElementById("upload-progress");
const transcriptSection = document.getElementById("transcript-section");
const transcriptDisplay = document.getElementById("transcript-display");
const selectionControls = document.getElementById("selection-controls");
const selectedTextSpan = document.getElementById("selected-text");
const clipInput = document.getElementById("clip-input");
const uploadClipBtn = document.getElementById("upload-clip-btn");
const existingClipsSelect = document.getElementById("existing-clips");
const musicVolume = document.getElementById("music-volume");
const volumeDisplay = document.getElementById("volume-display");
const addHighlightBtn = document.getElementById("add-highlight-btn");
const cancelSelectionBtn = document.getElementById("cancel-selection-btn");
const highlightsSection = document.getElementById("highlights-section");
const highlightsList = document.getElementById("highlights-list");
const processBtn = document.getElementById("process-btn");
const processProgress = document.getElementById("process-progress");
const resultSection = document.getElementById("result-section");
const resultMessage = document.getElementById("result-message");
const downloadBtn = document.getElementById("download-btn");

// Event Listeners
mainVideoInput.addEventListener("change", handleVideoSelection);
transcriptFileInput.addEventListener("change", handleTranscriptSelection);
uploadBtn.addEventListener("click", uploadVideo);
uploadClipBtn.addEventListener("click", uploadClip);
musicVolume.addEventListener("input", (e) => {
  volumeDisplay.textContent = e.target.value;
});
addHighlightBtn.addEventListener("click", addHighlight);
cancelSelectionBtn.addEventListener("click", cancelSelection);
processBtn.addEventListener("click", processVideo);

// Load existing clips on page load
loadExistingClips();

function handleVideoSelection(e) {
  const file = e.target.files[0];
  if (file) {
    videoFilename.textContent = `Selected: ${file.name}`;
    checkUploadReady();
  }
}

function handleTranscriptSelection(e) {
  const file = e.target.files[0];
  if (file) {
    transcriptFilename.textContent = `Selected: ${file.name}`;
    checkUploadReady();
  }
}

function checkUploadReady() {
  const hasVideo = mainVideoInput.files.length > 0;
  const hasTranscript = transcriptFileInput.files.length > 0;
  uploadBtn.disabled = !(hasVideo && hasTranscript);
}

async function uploadVideo() {
  const videoFile = mainVideoInput.files[0];
  const txtFile = transcriptFileInput.files[0];

  if (!videoFile || !txtFile) {
    alert("Please select both video and TXT file");
    return;
  }

  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append("transcript_file", txtFile);

  uploadBtn.disabled = true;
  uploadProgress.style.display = "block";

  try {
    const response = await fetch("/upload-video-with-txt", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.error) {
      alert("Error: " + data.error);
      return;
    }

    if (!data.subtitles || !data.transcript) {
      alert(
        "Error: Invalid response from server. Missing subtitles or transcript data."
      );
      console.error("Server response:", data);
      return;
    }

    currentVideoPath = data.video_path;
    transcriptData = data.transcript;
    subtitles = data.subtitles;

    displaySubtitles(data.subtitles, data.transcript);
    transcriptSection.style.display = "block";
    highlightsSection.style.display = "block";

    alert(
      `Script loaded! Found ${data.subtitles.length} subtitle boxes from ${data.word_count} words.`
    );
  } catch (error) {
    alert("Error uploading files: " + error.message);
  } finally {
    uploadProgress.style.display = "none";
    uploadBtn.disabled = false;
  }
}

function displaySubtitles(subtitles, transcript) {
  transcriptDisplay.innerHTML = "";

  // Create full word-by-word transcript with selection enabled
  const transcriptHeader = document.createElement("div");
  transcriptHeader.className = "transcript-header";
  transcriptHeader.innerHTML = `
    <h3>🎯 Select Words to Assign Clips</h3>
    <p class="transcript-description">Click and drag to select words, or Shift+Click to extend selection. You can select any range of words across any subtitles.</p>
  `;
  transcriptDisplay.appendChild(transcriptHeader);

  const transcriptContainer = document.createElement("div");
  transcriptContainer.className = "transcript-container";

  // Display words grouped by subtitle with visual separators
  subtitles.forEach((subtitle, subtitleIndex) => {
    // Add subtitle separator
    const separator = document.createElement("div");
    separator.className = "subtitle-separator";
    separator.innerHTML = `<span class="subtitle-separator-badge">Subtitle #${
      subtitleIndex + 1
    }</span>`;
    transcriptContainer.appendChild(separator);

    // Add words for this subtitle
    const wordsContainer = document.createElement("div");
    wordsContainer.className = "subtitle-words-group";

    for (let i = subtitle.start_word; i <= subtitle.end_word; i++) {
      const wordSpan = document.createElement("span");
      wordSpan.className = "word";
      wordSpan.textContent = transcript[i].word;
      wordSpan.dataset.index = i;

      // Mouse events for selection
      wordSpan.addEventListener("mousedown", (e) => {
        if (e.shiftKey && selectedRange) {
          // Extend selection
          const newIndex = parseInt(wordSpan.dataset.index);
          selectedRange.end = newIndex;
          updateSelection();
        } else {
          // Start new selection
          selectedRange = {
            start: parseInt(wordSpan.dataset.index),
            end: parseInt(wordSpan.dataset.index),
          };
          updateSelection();
        }
      });

      wordSpan.addEventListener("mouseenter", (e) => {
        if (e.buttons === 1 && selectedRange) {
          // Dragging
          selectedRange.end = parseInt(wordSpan.dataset.index);
          updateSelection();
        }
      });

      wordsContainer.appendChild(wordSpan);
    }

    transcriptContainer.appendChild(wordsContainer);
  });

  transcriptDisplay.appendChild(transcriptContainer);
}

function updateSelection() {
  // Clear previous selection
  document.querySelectorAll(".word.selected").forEach((el) => {
    el.classList.remove("selected");
  });

  if (!selectedRange) return;

  const start = Math.min(selectedRange.start, selectedRange.end);
  const end = Math.max(selectedRange.start, selectedRange.end);

  // Highlight selected words
  for (let i = start; i <= end; i++) {
    const wordEl = document.querySelector(`.word[data-index="${i}"]`);
    if (wordEl) {
      wordEl.classList.add("selected");
    }
  }

  // Show selection controls
  const selectedWords = transcriptData
    .slice(start, end + 1)
    .map((e) => e.word)
    .join(" ");
  selectedTextSpan.textContent = selectedWords;
  selectionControls.style.display = "block";
}

function cancelSelection() {
  selectedRange = null;
  currentSubtitleIndex = null;
  document.querySelectorAll(".word.selected").forEach((el) => {
    el.classList.remove("selected");
  });
  selectionControls.style.display = "none";
}

async function uploadClip() {
  const file = clipInput.files[0];
  if (!file) {
    alert("Please select a file to upload");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  uploadClipBtn.disabled = true;

  try {
    const response = await fetch("/upload-clip", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.error) {
      alert("Error: " + data.error);
      return;
    }

    // Add to existing clips dropdown
    const option = document.createElement("option");
    option.value = data.file_path;
    option.textContent = file.name;
    existingClipsSelect.appendChild(option);
    existingClipsSelect.value = data.file_path;

    alert("File uploaded successfully!");
  } catch (error) {
    alert("Error uploading file: " + error.message);
  } finally {
    uploadClipBtn.disabled = false;
  }
}

async function loadExistingClips() {
  try {
    const response = await fetch("/list-clips");
    const data = await response.json();

    // Add clips
    data.clips.forEach((clip) => {
      const option = document.createElement("option");
      option.value = `clips/${clip}`;
      option.textContent = `📹 ${clip}`;
      existingClipsSelect.appendChild(option);
    });

    // Add audio files
    data.audio_files.forEach((audio) => {
      const option = document.createElement("option");
      option.value = `audio_files/${audio}`;
      option.textContent = `🎵 ${audio}`;
      existingClipsSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading clips:", error);
  }
}

function addHighlight() {
  if (!selectedRange) return;

  const clipPath = existingClipsSelect.value;
  if (!clipPath) {
    alert("Please select or upload a clip/audio file");
    return;
  }

  const start = Math.min(selectedRange.start, selectedRange.end);
  const end = Math.max(selectedRange.start, selectedRange.end);
  const phrase = transcriptData
    .slice(start, end + 1)
    .map((e) => e.word)
    .join(" ");

  const highlight = {
    phrase: phrase,
    start_word: start,
    end_word: end,
    clip_path:
      clipPath.includes(".mp3") || clipPath.includes(".wav") ? null : clipPath,
    music_path:
      clipPath.includes(".mp3") || clipPath.includes(".wav") ? clipPath : null,
    music_volume: parseFloat(musicVolume.value),
    occurrence: 1,
  };

  highlights.push(highlight);

  updateHighlightsList();
  cancelSelection();
}

function updateHighlightsList() {
  highlightsList.innerHTML = "";

  if (highlights.length === 0) {
    highlightsList.innerHTML =
      '<p style="color: #999; text-align: center; padding: 20px;">No subtitles added yet. Select text in the transcript above to create your first subtitle.</p>';
    return;
  }

  // Add header
  const header = document.createElement("div");
  header.className = "subtitles-header";
  header.innerHTML = `
    <h3>📝 Your Subtitles (${highlights.length})</h3>
    <p class="subtitles-description">Each subtitle will appear during the selected words with the assigned clip/audio</p>
  `;
  highlightsList.appendChild(header);

  highlights.forEach((highlight, index) => {
    const item = document.createElement("div");
    item.className = "highlight-item";

    // Subtitle number badge
    const badge = document.createElement("div");
    badge.className = "subtitle-badge";
    badge.textContent = `#${index + 1}`;

    const info = document.createElement("div");
    info.className = "highlight-info";

    // Subtitle text label
    const label = document.createElement("div");
    label.className = "subtitle-label";
    label.textContent = `Subtitle ${index + 1}`;

    const phrase = document.createElement("div");
    phrase.className = "highlight-phrase";
    phrase.textContent = `"${highlight.phrase}"`;

    const details = document.createElement("div");
    details.className = "highlight-details";
    const fileName = (highlight.clip_path || highlight.music_path)
      .split("/")
      .pop();
    const fileType = highlight.clip_path ? "📹 Video Clip" : "🎵 Audio/Music";
    const wordRange = `Words ${highlight.start_word + 1}-${
      highlight.end_word + 1
    }`;
    details.innerHTML = `
      <span class="detail-item">${fileType}: <strong>${fileName}</strong></span>
      <span class="detail-item">Volume: <strong>${highlight.music_volume}</strong></span>
      <span class="detail-item">${wordRange}</span>
    `;

    info.appendChild(label);
    info.appendChild(phrase);
    info.appendChild(details);

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-danger";
    removeBtn.innerHTML = "🗑️<br>Remove";
    removeBtn.onclick = () => removeHighlight(index);

    item.appendChild(badge);
    item.appendChild(info);
    item.appendChild(removeBtn);
    highlightsList.appendChild(item);
  });
}

function removeHighlight(index) {
  const highlight = highlights[index];

  // Remove highlighted class from words
  for (let i = highlight.start_word; i <= highlight.end_word; i++) {
    const wordEl = document.querySelector(`.word[data-index="${i}"]`);
    if (wordEl) {
      wordEl.classList.remove("highlighted");
    }
  }

  highlights.splice(index, 1);
  updateHighlightsList();
}

async function processVideo() {
  if (!currentVideoPath) {
    alert("Please upload a video first");
    return;
  }

  if (highlights.length === 0) {
    alert("Please add at least one highlight");
    return;
  }

  processBtn.disabled = true;
  processProgress.style.display = "block";

  try {
    const response = await fetch("/process-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_path: currentVideoPath,
        highlights: highlights,
        transcript: transcriptData,
        preserve_audio: true,
      }),
    });

    const data = await response.json();

    if (data.error) {
      alert("Error: " + data.error);
      return;
    }

    resultMessage.textContent = data.message;
    downloadBtn.onclick = () => {
      window.location.href = `/download/${data.output_filename}`;
    };

    resultSection.style.display = "block";
    processProgress.style.display = "none";
  } catch (error) {
    alert("Error processing video: " + error.message);
    processProgress.style.display = "none";
  } finally {
    processBtn.disabled = false;
  }
}
