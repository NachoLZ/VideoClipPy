# PowerShell script to create final React components

Write-Host "Creating final components..." -ForegroundColor Cyan

# MusicList.jsx
$musicList = @'
import { Card, CardHeader, CardBody, Button, Chip } from "@heroui/react";

export default function MusicList({ musicHighlights, setMusicHighlights }) {
  const handleDelete = (index) => {
    const newMusicHighlights = musicHighlights.filter((_, i) => i !== index);
    setMusicHighlights(newMusicHighlights);
  };

  return (
    <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-fadeIn">
      <CardHeader className="flex flex-col items-start pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🎼</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Step 6: Review Your Music/Audio
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your audio assignments
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-6">
        {musicHighlights.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No music/audio added yet. Select words in Step 5 to add music.
          </p>
        ) : (
          <div className="space-y-4">
            {musicHighlights.map((music, index) => {
              const musicName = music.music_path.split("/").pop();

              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <Chip color="secondary" variant="flat" size="lg" className="font-bold">
                    #{index + 1}
                  </Chip>

                  <div className="flex-1">
                    <div className="font-bold text-gray-800 mb-2">
                      "{music.phrase}"
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      <Chip size="sm" variant="flat">
                        🎵 {musicName}
                      </Chip>
                      <Chip size="sm" variant="flat">
                        🔊 Volume: {music.music_volume.toFixed(1)}
                      </Chip>
                      <Chip size="sm" variant="flat">
                        Words {music.start_word + 1}-{music.end_word + 1}
                      </Chip>
                    </div>
                  </div>

                  <Button color="danger" size="sm" onPress={() => handleDelete(index)}>
                    Delete
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

$musicList | Out-File -FilePath "frontend\src\components\MusicList.jsx" -Encoding UTF8
Write-Host "✓ Created MusicList.jsx" -ForegroundColor Green

# ProcessSection.jsx
$processSection = @'
import { useState } from "react";
import { Card, CardHeader, CardBody, Button, Progress } from "@heroui/react";

export default function ProcessSection({
  currentVideoPath,
  highlights,
  musicHighlights,
  transcriptData,
  onProcessSuccess,
}) {
  const [processing, setProcessing] = useState(false);

  const handleProcess = async () => {
    if (!currentVideoPath) {
      alert("Please upload a video first");
      return;
    }

    if (highlights.length === 0) {
      alert("Please add at least one highlight");
      return;
    }

    setProcessing(true);

    const allHighlights = [...highlights, ...musicHighlights];

    try {
      const response = await fetch("/process-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_path: currentVideoPath,
          highlights: allHighlights,
          transcript: transcriptData,
          preserve_audio: true,
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert("Error: " + data.error);
        return;
      }

      onProcessSuccess(data.output_filename);
    } catch (error) {
      alert("Error processing video: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-fadeIn">
      <CardHeader className="flex flex-col items-start pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">⚙️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Step 7: Process Your Video
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Ready to create your final video?
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="gap-4 pt-6">
        <Button
          color="primary"
          size="lg"
          className="w-full font-bold text-lg shadow-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          isDisabled={processing}
          isLoading={processing}
          onPress={handleProcess}
        >
          {processing ? "Processing video... This may take a while." : "🎥 Process Video"}
        </Button>

        {processing && (
          <div className="space-y-2">
            <Progress
              size="md"
              isIndeterminate
              aria-label="Processing..."
              className="w-full"
              color="secondary"
            />
            <p className="text-center text-sm text-gray-500">
              Processing your video with all highlights and music...
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
'@

$processSection | Out-File -FilePath "frontend\src\components\ProcessSection.jsx" -Encoding UTF8
Write-Host "✓ Created ProcessSection.jsx" -ForegroundColor Green

# ResultSection.jsx
$resultSection = @'
import { Card, CardHeader, CardBody, Button } from "@heroui/react";

export default function ResultSection({ outputFilename, onReset }) {
  const handleDownload = () => {
    window.location.href = `/download/${outputFilename}`;
  };

  return (
    <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-fadeIn">
      <CardHeader className="flex flex-col items-start pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">✅</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Video Processed Successfully!
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Your video is ready for download
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="gap-4 pt-6">
        <p className="text-lg text-gray-700">
          Your video has been processed and is ready for download!
        </p>

        <div className="flex gap-3">
          <Button
            color="success"
            size="lg"
            className="font-bold shadow-lg"
            onPress={handleDownload}
          >
            ⬇️ Download Processed Video
          </Button>

          <Button
            color="default"
            size="lg"
            variant="flat"
            onPress={onReset}
          >
            🔄 Start New Project
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
'@

$resultSection | Out-File -FilePath "frontend\src\components\ResultSection.jsx" -Encoding UTF8
Write-Host "✓ Created ResultSection.jsx" -ForegroundColor Green

Write-Host "`n✨ All components created successfully!" -ForegroundColor Green
Write-Host "The frontend should now load without errors." -ForegroundColor Cyan
Write-Host "`nRefresh your browser at http://localhost:3000 to see the modern design!" -ForegroundColor Yellow

