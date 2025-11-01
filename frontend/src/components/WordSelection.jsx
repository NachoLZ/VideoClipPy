import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
  ScrollShadow,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";

export default function WordSelection({
  transcriptData,
  highlights,
  setHighlights,
  selectedRange,
  setSelectedRange,
}) {
  const [clipFile, setClipFile] = useState(null);
  const [existingClips, setExistingClips] = useState([]);
  const [selectedClip, setSelectedClip] = useState(new Set([]));
  const [uploading, setUploading] = useState(false);
  const clipInputRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMessage, setModalMessage] = useState("");

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

  const showModal = (message) => {
    setModalMessage(message);
    onOpen();
  };

  const handleUploadClip = async () => {
    if (!clipFile) {
      showModal("Please select a file to upload");
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
        showModal("Error: " + data.error);
        return;
      }

      setSelectedClip(new Set([data.file_path]));
      await loadExistingClips();
      showModal("File uploaded successfully!");
    } catch (error) {
      showModal("Error uploading file: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddHighlight = () => {
    if (!selectedRange) return;

    const clipPath = Array.from(selectedClip)[0];
    if (!clipPath) {
      showModal("Please select or upload a clip");
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
    setSelectedClip(new Set([]));
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
    <Card
      radius="lg"
      shadow="lg"
      className="mb-8 border-2 border-blue-100 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 animate-fadeIn hover:shadow-2xl hover:border-blue-200 transition-all duration-300"
    >
      <CardHeader className="flex flex-col items-start pb-6 border-b-2 border-blue-100/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Icon icon="mdi:target" className="text-white text-2xl" />
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
      <CardBody className="pt-6 space-y-6">
        <ScrollShadow className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-2 border-blue-100 rounded-2xl p-6 max-h-80 leading-relaxed text-base font-medium">
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
        </ScrollShadow>

        {selectedRange && (
          <Card
            radius="lg"
            shadow="lg"
            className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 animate-fadeIn"
          >
            <CardBody className="p-6 space-y-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-blue-100">
                <h3 className="text-sm font-bold text-blue-600 mb-2">
                  Selected Text:
                </h3>
                <p className="text-lg font-bold text-blue-700 leading-relaxed">
                  "
                  {transcriptData
                    .slice(
                      Math.min(selectedRange.start, selectedRange.end),
                      Math.max(selectedRange.start, selectedRange.end) + 1
                    )
                    .map((e) => e.word)
                    .join(" ")}
                  "
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-blue-100">
                  <label className="flex items-center gap-2 font-bold text-blue-700 mb-3">
                    <Icon icon="mdi:upload" className="text-xl text-blue-600" />
                    Upload Clip:
                  </label>
                  <div className="flex gap-3">
                    <input
                      ref={clipInputRef}
                      type="file"
                      accept="video/*"
                      onChange={(e) => setClipFile(e.target.files[0])}
                      className="hidden"
                    />
                    <Button
                      color="primary"
                      variant="shadow"
                      size="lg"
                      radius="lg"
                      className="flex-1 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      onPress={() => clipInputRef.current?.click()}
                      startContent={
                        <Icon icon="mdi:folder-open" className="text-xl" />
                      }
                    >
                      Choose File
                    </Button>
                    <Button
                      color="success"
                      variant="shadow"
                      size="lg"
                      radius="lg"
                      className="flex-1 font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                      isDisabled={!clipFile || uploading}
                      isLoading={uploading}
                      onPress={handleUploadClip}
                      startContent={
                        !uploading && (
                          <Icon icon="mdi:upload" className="text-xl" />
                        )
                      }
                    >
                      Upload
                    </Button>
                  </div>
                  {clipFile && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border-2 border-green-200">
                      <p className="text-sm font-bold text-green-700 flex items-center gap-2">
                        <Icon icon="mdi:check" className="text-lg" />
                        {clipFile.name}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-blue-100">
                  <label className="flex items-center gap-2 font-bold text-blue-700 mb-3">
                    <Icon icon="mdi:folder" className="text-xl text-blue-600" />
                    Or select existing:
                  </label>
                  <Select
                    label="Select existing clip"
                    placeholder="-- Select existing file --"
                    selectedKeys={selectedClip}
                    onSelectionChange={setSelectedClip}
                    size="lg"
                    radius="lg"
                    variant="bordered"
                    classNames={{
                      trigger: "border-2 border-blue-200",
                    }}
                    startContent={<Icon icon="mdi:video" className="text-lg" />}
                  >
                    {existingClips.map((clip) => (
                      <SelectItem
                        key={`clips/${clip}`}
                        value={`clips/${clip}`}
                        startContent={
                          <Icon icon="mdi:video" className="text-lg" />
                        }
                      >
                        {clip}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Tooltip
                  content="Add this selection as a highlight"
                  color="success"
                  radius="lg"
                >
                  <Button
                    color="success"
                    size="lg"
                    variant="shadow"
                    radius="lg"
                    className="flex-1 font-bold text-base bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                    onPress={handleAddHighlight}
                    startContent={
                      <Icon icon="mdi:check-circle" className="text-xl" />
                    }
                  >
                    Add Highlight
                  </Button>
                </Tooltip>
                <Tooltip content="Cancel selection" color="danger" radius="lg">
                  <Button
                    color="danger"
                    size="lg"
                    variant="flat"
                    radius="lg"
                    className="flex-1 font-bold text-base hover:bg-red-100"
                    onPress={() => setSelectedRange(null)}
                    startContent={
                      <Icon icon="mdi:close-circle" className="text-xl" />
                    }
                  >
                    Cancel
                  </Button>
                </Tooltip>
              </div>
            </CardBody>
          </Card>
        )}
      </CardBody>

      {/* Modal for alerts */}
      <Modal isOpen={isOpen} onClose={onClose} size="md" radius="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:information"
                    className="text-2xl text-blue-600"
                  />
                  <span className="text-xl font-bold">Notice</span>
                </div>
              </ModalHeader>
              <Divider />
              <ModalBody className="py-6">
                <p className="text-base text-gray-700">{modalMessage}</p>
              </ModalBody>
              <Divider />
              <ModalFooter>
                <Button
                  color="primary"
                  variant="shadow"
                  radius="lg"
                  onPress={onClose}
                  className="font-semibold"
                >
                  OK
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
}
