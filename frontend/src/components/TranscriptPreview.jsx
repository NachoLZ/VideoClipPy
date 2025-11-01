import {
  Card,
  CardHeader,
  CardBody,
  Chip,
  Divider,
  ScrollShadow,
} from "@heroui/react";
import { Icon } from "@iconify/react";

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
    <Card
      radius="lg"
      shadow="lg"
      className="mb-8 border-2 border-green-100 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 animate-fadeIn hover:shadow-2xl hover:border-green-200 transition-all duration-300"
    >
      <CardHeader className="flex flex-col items-start pb-6 border-b-2 border-green-100/50 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Icon
              icon="mdi:file-document-outline"
              className="text-white text-2xl"
            />
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
        <ScrollShadow className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 border-2 border-green-100 rounded-2xl p-6 max-h-80">
          {subtitles.map((subtitle, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <Chip
                color="success"
                variant="flat"
                size="md"
                radius="lg"
                className="mb-3 font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
              >
                Subtitle {index + 1}
              </Chip>
              <div className="leading-relaxed text-base font-medium text-gray-700">
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
              {index < subtitles.length - 1 && <Divider className="mt-3" />}
            </div>
          ))}
        </ScrollShadow>
      </CardBody>
    </Card>
  );
}
