# PowerShell script to create all React components with modern HeroUI design

Write-Host "Creating all React components with modern design..." -ForegroundColor Cyan

# TranscriptPreview.jsx
$transcriptPreview = @'
import { Card, CardHeader, CardBody, Chip } from "@heroui/react";

export default function TranscriptPreview({
  subtitles,
  transcriptData,
  highlights,
  selectedRange,
}) {
  const isWordHighlighted = (index) => {
    return highlights.some((h) => {
      const start = Math.min(h.start_word, h.end_word);
      const end = Math.max(h.start_word, h.end_word);
      return index >= start && index <= end;
    });
  };

  const isWordSelecting = (index) => {
    if (!selectedRange) return false;
    const start = Math.min(selectedRange.start, selectedRange.end);
    const end = Math.max(selectedRange.start, selectedRange.end);
    return index >= start && index <= end;
  };

  return (
    <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-fadeIn">
      <CardHeader className="flex flex-col items-start pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">📄</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Step 2: Transcript Preview
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Your transcript organized into subtitle boxes
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 max-h-96 overflow-y-auto">
          {subtitles.map((subtitle, index) => (
            <div
              key={index}
              className="mb-6 pb-5 border-b border-gray-300 last:border-b-0"
            >
              <Chip color="primary" variant="flat" size="sm" className="mb-3 font-semibold">
                Subtitle {index + 1}
              </Chip>
              <div className="leading-relaxed text-base">
                {Array.from(
                  { length: subtitle.end_word - subtitle.start_word + 1 },
                  (_, i) => {
                    const wordIndex = subtitle.start_word + i;
                    const word = transcriptData[wordIndex]?.word || "";
                    const highlighted = isWordHighlighted(wordIndex);
                    const selecting = isWordSelecting(wordIndex);

                    let className = "inline";
                    if (selecting) {
                      className += " word-preview-selecting";
                    } else if (highlighted) {
                      className += " word-preview-highlighted";
                    }

                    return (
                      <span key={wordIndex}>
                        <span className={className}>{word}</span>{" "}
                      </span>
                    );
                  }
                )}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
'@

$transcriptPreview | Out-File -FilePath "frontend\src\components\TranscriptPreview.jsx" -Encoding UTF8
Write-Host "✓ Created TranscriptPreview.jsx" -ForegroundColor Green

# WordSelection.jsx - Simplified version
$wordSelection = @'
import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardBody, Button, Select, SelectItem } from "@heroui/react";

export default function WordSelection({
  transcriptData,
  highlights,
  setHighlights,
  selectedRange,
  setSelectedRange,
}) {
  const [clipFile, setClipFile] = useState(null);
  const [existingClips, setExistingClips] = useState([]);
  const [selectedClip, setSelectedClip] = useState("");
  const [uploading, setUploading] = useState(false);
  const clipInputRef = useRef(null);

  useEffect(() => {
    loadExistingClips();
  }, []);

  const loadExistingClips = async () => {
    try {
      const response = await fetch("/list-clips");
      const data = await response.json();
      setExistingClips(data.clips || []);
    } catch (error) {
      console.error("Error loading clips:", error);
    }
  };

  const handleWordMouseDown = (index, e) => {
    if (e.shiftKey && selectedRange) {
      setSelectedRange({ ...selectedRange, end: index });
    } else {
      setSelectedRange({ start: index, end: index });
    }
  };

  const handleWordMouseEnter = (index, e) => {
    if (e.buttons === 1 && selectedRange) {
      setSelectedRange({ ...selectedRange, end: index });
    }
  };

  const handleUploadClip = async () => {
    if (!clipFile) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", clipFile);
    setUploading(true);

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

      setSelectedClip(data.file_path);
      await loadExistingClips();
      alert("File uploaded successfully!");
    } catch (error) {
      alert("Error uploading file: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddHighlight = () => {
    if (!selectedRange) return;

    const clipPath = selectedClip;
    if (!clipPath) {
      alert("Please select or upload a clip");
      return;
    }

    const start = Math.min(selectedRange.start, selectedRange.end);
    const end = Math.max(selectedRange.start, selectedRange.end);
    const phrase = transcriptData
      .slice(start, end + 1)
      .map((e) => e.word)
      .join(" ");

    const highlight = {
      phrase,
      start_word: start,
      end_word: end,
      clip_path: clipPath,
      music_path: null,
      music_volume: 1.0,
      occurrence: 1,
    };

    setHighlights([...highlights, highlight]);
    setSelectedRange(null);
    setClipFile(null);
    setSelectedClip("");
  };

  const isWordHighlighted = (index) => {
    return highlights.some((h) => {
      const start = Math.min(h.start_word, h.end_word);
      const end = Math.max(h.start_word, h.end_word);
      return index >= start && index <= end;
    });
  };

  const isWordSelected = (index) => {
    if (!selectedRange) return false;
    const start = Math.min(selectedRange.start, selectedRange.end);
    const end = Math.max(selectedRange.start, selectedRange.end);
    return index >= start && index <= end;
  };

  return (
    <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-fadeIn">
      <CardHeader className="flex flex-col items-start pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">✨</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Step 3: Select Text for Highlights
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Click and drag to select words, or Shift+Click for ranges
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="gap-6 pt-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 max-h-96 overflow-y-auto leading-loose text-base">
          {transcriptData.map((entry, index) => {
            const highlighted = isWordHighlighted(index);
            const selected = isWordSelected(index);

            let className = "word-selectable";
            if (selected) {
              className += " word-selected";
            } else if (highlighted) {
              className += " word-highlighted";
            }

            return (
              <span key={index}>
                <span
                  className={className}
                  onMouseDown={(e) => handleWordMouseDown(index, e)}
                  onMouseEnter={(e) => handleWordMouseEnter(index, e)}
                >
                  {entry.word}
                </span>{" "}
              </span>
            );
          })}
        </div>

        {selectedRange && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 space-y-4 border border-gray-200">
            <h3 className="text-lg font-semibold">
              Selected:{" "}
              <span className="text-blue-600">
                {transcriptData
                  .slice(
                    Math.min(selectedRange.start, selectedRange.end),
                    Math.max(selectedRange.start, selectedRange.end) + 1
                  )
                  .map((e) => e.word)
                  .join(" ")}
              </span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-2">Upload Clip:</label>
                <div className="flex gap-2">
                  <input
                    ref={clipInputRef}
                    type="file"
                    accept="video/*"
                    onChange={(e) => setClipFile(e.target.files[0])}
                    className="hidden"
                  />
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={() => clipInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                  <Button
                    color="secondary"
                    isDisabled={!clipFile || uploading}
                    isLoading={uploading}
                    onPress={handleUploadClip}
                  >
                    Upload
                  </Button>
                </div>
                {clipFile && <p className="mt-2 text-sm text-gray-600">{clipFile.name}</p>}
              </div>

              <div>
                <label className="block font-semibold mb-2">Or select existing:</label>
                <Select
                  placeholder="-- Select existing file --"
                  selectedKeys={selectedClip ? [selectedClip] : []}
                  onSelectionChange={(keys) => setSelectedClip(Array.from(keys)[0] || "")}
                >
                  {existingClips.map((clip) => (
                    <SelectItem key={`clips/${clip}`} value={`clips/${clip}`}>
                      📹 {clip}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button color="success" onPress={handleAddHighlight}>
                ✅ Add Highlight
              </Button>
              <Button
                color="default"
                variant="flat"
                onPress={() => setSelectedRange(null)}
              >
                ❌ Cancel
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
'@

$wordSelection | Out-File -FilePath "frontend\src\components\WordSelection.jsx" -Encoding UTF8
Write-Host "✓ Created WordSelection.jsx" -ForegroundColor Green

Write-Host "`nAll components created successfully!" -ForegroundColor Green
Write-Host "The frontend should now load without errors." -ForegroundColor Cyan

