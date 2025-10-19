# PowerShell script to create all React components with modern design

# Create TranscriptPreview.jsx
@"
import { Card, CardHeader, CardBody, Chip } from '@heroui/react'

export default function TranscriptPreview({ subtitles, transcriptData, highlights, selectedRange }) {
  const isWordHighlighted = (index) => {
    return highlights.some(h => {
      const start = Math.min(h.start_word, h.end_word)
      const end = Math.max(h.start_word, h.end_word)
      return index >= start && index <= end
    })
  }

  const isWordSelecting = (index) => {
    if (!selectedRange) return false
    const start = Math.min(selectedRange.start, selectedRange.end)
    const end = Math.max(selectedRange.start, selectedRange.end)
    return index >= start && index <= end
  }

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
            <div key={index} className="mb-6 pb-5 border-b border-gray-300 last:border-b-0">
              <Chip 
                color="primary" 
                variant="flat" 
                size="sm"
                className="mb-3 font-semibold"
              >
                Subtitle {index + 1}
              </Chip>
              <div className="leading-relaxed text-base">
                {Array.from({ length: subtitle.end_word - subtitle.start_word + 1 }, (_, i) => {
                  const wordIndex = subtitle.start_word + i
                  const word = transcriptData[wordIndex]?.word || ''
                  const highlighted = isWordHighlighted(wordIndex)
                  const selecting = isWordSelecting(wordIndex)
                  
                  let className = 'inline'
                  if (selecting) {
                    className += ' word-preview-selecting'
                  } else if (highlighted) {
                    className += ' word-preview-highlighted'
                  }
                  
                  return (
                    <span key={wordIndex}>
                      <span className={className}>{word}</span>
                      {' '}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
"@ | Out-File -FilePath "frontend\src\components\TranscriptPreview.jsx" -Encoding UTF8

Write-Host "Created TranscriptPreview.jsx"

