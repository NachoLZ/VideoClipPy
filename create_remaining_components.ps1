# PowerShell script to create remaining React components

Write-Host "Creating remaining components..." -ForegroundColor Cyan

# HighlightsList.jsx
$highlightsList = @'
import { Card, CardHeader, CardBody, Button, Chip } from "@heroui/react";

export default function HighlightsList({ highlights, setHighlights }) {
  const handleRemove = (index) => {
    const newHighlights = highlights.filter((_, i) => i !== index);
    setHighlights(newHighlights);
  };

  return (
    <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-fadeIn">
      <CardHeader className="flex flex-col items-start pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">📋</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Step 4: Review Your Clips
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your assigned highlights
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-6">
        {highlights.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No highlights added yet. Select text above to create your first highlight.
          </p>
        ) : (
          <div className="space-y-4">
            {highlights.map((highlight, index) => {
              const fileName = (highlight.clip_path || highlight.music_path).split("/").pop();

              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <Chip color="primary" variant="flat" size="lg" className="font-bold">
                    #{index + 1}
                  </Chip>

                  <div className="flex-1">
                    <div className="font-bold text-gray-800 mb-2">
                      "{highlight.phrase}"
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      <Chip size="sm" variant="flat">
                        📹 {fileName}
                      </Chip>
                      <Chip size="sm" variant="flat">
                        Words {highlight.start_word + 1}-{highlight.end_word + 1}
                      </Chip>
                    </div>
                  </div>

                  <Button color="danger" size="sm" onPress={() => handleRemove(index)}>
                    🗑️ Remove
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
'@

$highlightsList | Out-File -FilePath "frontend\src\components\HighlightsList.jsx" -Encoding UTF8
Write-Host "✓ Created HighlightsList.jsx" -ForegroundColor Green

# MusicSelection.jsx - Similar to WordSelection
$musicSelection = @'
import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardBody, Button, Select, SelectItem, Slider } from "@heroui/react";

export default function MusicSelection({
  transcriptData,
  musicHighlights,
  setMusicHighlights,
  selectedMusicRange,
  setSelectedMusicRange,
}) {
  const [musicFile, setMusicFile] = useState(null);
  const [existingMusic, setExistingMusic] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState("");
  const [volume, setVolume] = useState(1.0);
  const [uploading, setUploading] = useState(false);
  const musicInputRef = useRef(null);

  useEffect(() => {
    loadExistingMusic();
  }, []);

  const loadExistingMusic = async () => {
    try {
      const response = await fetch("/list-clips");
      const data = await response.json();
      setExistingMusic(data.audio_files || []);
    } catch (error) {
      console.error("Error loading music:", error);
    }
  };

  const handleWordMouseDown = (index, e) => {
    if (e.shiftKey && selectedMusicRange) {
      setSelectedMusicRange({ ...selectedMusicRange, end: index });
    } else {
      setSelectedMusicRange({ start: index, end: index });
    }
  };

  const handleWordMouseEnter = (index, e) => {
    if (e.buttons === 1 && selectedMusicRange) {
      setSelectedMusicRange({ ...selectedMusicRange, end: index });
    }
  };

  const handleUploadMusic = async () => {
    if (!musicFile) {
      alert("Please select a music file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", musicFile);
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

      setSelectedMusic(data.file_path);
      await loadExistingMusic();
      alert("Music uploaded successfully!");
    } catch (error) {
      alert("Error uploading music: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddMusic = () => {
    if (!selectedMusicRange) return;

    const musicPath = selectedMusic;
    if (!musicPath) {
      alert("Please select or upload a music/audio file");
      return;
    }

    const start = Math.min(selectedMusicRange.start, selectedMusicRange.end);
    const end = Math.max(selectedMusicRange.start, selectedMusicRange.end);
    const phrase = transcriptData
      .slice(start, end + 1)
      .map((e) => e.word)
      .join(" ");

    const musicHighlight = {
      phrase,
      start_word: start,
      end_word: end,
      music_path: musicPath,
      music_volume: volume,
      occurrence: 1,
    };

    setMusicHighlights([...musicHighlights, musicHighlight]);
    setSelectedMusicRange(null);
    setMusicFile(null);
    setSelectedMusic("");
    setVolume(1.0);
  };

  const isWordHighlighted = (index) => {
    return musicHighlights.some((h) => {
      const start = Math.min(h.start_word, h.end_word);
      const end = Math.max(h.start_word, h.end_word);
      return index >= start && index <= end;
    });
  };

  const isWordSelected = (index) => {
    if (!selectedMusicRange) return false;
    const start = Math.min(selectedMusicRange.start, selectedMusicRange.end);
    const end = Math.max(selectedMusicRange.start, selectedMusicRange.end);
    return index >= start && index <= end;
  };

  return (
    <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-fadeIn">
      <CardHeader className="flex flex-col items-start pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🎵</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Step 5: Select Text for Music/Audio
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Add background music or audio to selected words
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="gap-6 pt-6">
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl p-6 max-h-96 overflow-y-auto leading-loose text-base">
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

        {selectedMusicRange && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 space-y-4 border border-gray-200">
            <h3 className="text-lg font-semibold">
              Selected:{" "}
              <span className="text-pink-600">
                {transcriptData
                  .slice(
                    Math.min(selectedMusicRange.start, selectedMusicRange.end),
                    Math.max(selectedMusicRange.start, selectedMusicRange.end) + 1
                  )
                  .map((e) => e.word)
                  .join(" ")}
              </span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-2">Upload Audio/Music:</label>
                <div className="flex gap-2">
                  <input
                    ref={musicInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setMusicFile(e.target.files[0])}
                    className="hidden"
                  />
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={() => musicInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                  <Button
                    color="secondary"
                    isDisabled={!musicFile || uploading}
                    isLoading={uploading}
                    onPress={handleUploadMusic}
                  >
                    Upload
                  </Button>
                </div>
                {musicFile && <p className="mt-2 text-sm text-gray-600">{musicFile.name}</p>}
              </div>

              <div>
                <label className="block font-semibold mb-2">Or select existing audio:</label>
                <Select
                  placeholder="-- Select existing audio --"
                  selectedKeys={selectedMusic ? [selectedMusic] : []}
                  onSelectionChange={(keys) => setSelectedMusic(Array.from(keys)[0] || "")}
                >
                  {existingMusic.map((audio) => (
                    <SelectItem key={`audio_files/${audio}`} value={`audio_files/${audio}`}>
                      🎵 {audio}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Audio Volume: {volume.toFixed(1)}
                </label>
                <Slider
                  size="sm"
                  step={0.1}
                  minValue={0}
                  maxValue={2}
                  value={volume}
                  onChange={setVolume}
                  className="max-w-md"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button color="success" onPress={handleAddMusic}>
                ✅ Add Music
              </Button>
              <Button
                color="default"
                variant="flat"
                onPress={() => setSelectedMusicRange(null)}
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

$musicSelection | Out-File -FilePath "frontend\src\components\MusicSelection.jsx" -Encoding UTF8
Write-Host "✓ Created MusicSelection.jsx" -ForegroundColor Green

Write-Host "`nRemaining components created!" -ForegroundColor Green

