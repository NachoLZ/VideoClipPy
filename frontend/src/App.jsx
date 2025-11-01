import { useState } from "react";
import { Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import UploadSection from "./components/UploadSection";
import TranscriptPreview from "./components/TranscriptPreview";
import WordSelection from "./components/WordSelection";
import HighlightsList from "./components/HighlightsList";
import MusicSelection from "./components/MusicSelection";
import MusicList from "./components/MusicList";
import ProcessSection from "./components/ProcessSection";
import ResultSection from "./components/ResultSection";

function App() {
  // Global state
  const [currentVideoPath, setCurrentVideoPath] = useState(null);
  const [transcriptData, setTranscriptData] = useState([]);
  const [subtitles, setSubtitles] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [musicHighlights, setMusicHighlights] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null);
  const [outputFilename, setOutputFilename] = useState(null);

  // Section visibility
  const [showTranscriptPreview, setShowTranscriptPreview] = useState(false);
  const [showSelection, setShowSelection] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [showMusicSelection, setShowMusicSelection] = useState(false);
  const [showMusicHighlights, setShowMusicHighlights] = useState(false);
  const [showProcess, setShowProcess] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleUploadSuccess = (data) => {
    setCurrentVideoPath(data.video_path);
    setTranscriptData(data.transcript);
    setSubtitles(data.subtitles);
    setShowTranscriptPreview(true);
    setShowSelection(true);
    setShowHighlights(true);
    setShowMusicSelection(true);
    setShowMusicHighlights(true);
    setShowProcess(true);
  };

  const handleProcessSuccess = (filename) => {
    setOutputFilename(filename);
    setShowResult(true);
  };

  const handleReset = () => {
    setCurrentVideoPath(null);
    setTranscriptData([]);
    setSubtitles([]);
    setHighlights([]);
    setMusicHighlights([]);
    setSelectedRange(null);
    setOutputFilename(null);
    setShowTranscriptPreview(false);
    setShowSelection(false);
    setShowHighlights(false);
    setShowMusicSelection(false);
    setShowMusicHighlights(false);
    setShowProcess(false);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        {/* Header - iOS Style */}
        <header className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-[20px] shadow-lg mb-4">
            <Icon icon="mdi:movie-edit" className="text-white text-4xl" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            VideoClipPy
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto font-medium">
            Create stunning video highlights with automatic word-level clips and
            audio
          </p>
        </header>

        {/* Step 1: Upload */}
        <UploadSection onUploadSuccess={handleUploadSuccess} />

        {/* Step 2: Transcript Preview */}
        {showTranscriptPreview && (
          <TranscriptPreview
            subtitles={subtitles}
            transcriptData={transcriptData}
            highlights={highlights}
            selectedRange={selectedRange}
          />
        )}

        {/* Step 3: Word Selection */}
        {showSelection && (
          <WordSelection
            transcriptData={transcriptData}
            highlights={highlights}
            setHighlights={setHighlights}
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
          />
        )}

        {/* Step 4: Highlights List */}
        {showHighlights && (
          <HighlightsList
            highlights={highlights}
            setHighlights={setHighlights}
          />
        )}

        {/* Step 5: Music Selection */}
        {showMusicSelection && (
          <MusicSelection
            transcriptData={transcriptData}
            musicHighlights={musicHighlights}
            onAddMusicHighlight={(music) =>
              setMusicHighlights([...musicHighlights, music])
            }
          />
        )}

        {/* Step 6: Music List */}
        {showMusicHighlights && (
          <MusicList
            musicHighlights={musicHighlights}
            onRemoveMusicHighlight={(index) => {
              const newMusicHighlights = [...musicHighlights];
              newMusicHighlights.splice(index, 1);
              setMusicHighlights(newMusicHighlights);
            }}
          />
        )}

        {/* Step 7: Process */}
        {showProcess && (
          <ProcessSection
            currentVideoPath={currentVideoPath}
            highlights={highlights}
            musicHighlights={musicHighlights}
            transcriptData={transcriptData}
            onProcessSuccess={handleProcessSuccess}
          />
        )}

        {/* Step 8: Result */}
        {showResult && (
          <ResultSection
            outputFilename={outputFilename}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default App;
