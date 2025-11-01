import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Select,
  SelectItem,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";

function MusicSelection({
  transcriptData,
  musicHighlights,
  onAddMusicHighlight,
}) {
  const [selectedRange, setSelectedRange] = useState(null);
  const [audioFiles, setAudioFiles] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    loadExistingAudio();
  }, []);

  const loadExistingAudio = async () => {
    try {
      const response = await fetch("/api/list-clips");
      const data = await response.json();
      setAudioFiles(data.audio_files || []);
    } catch (error) {
      console.error("Error loading audio files:", error);
    }
  };

  const handleWordClick = (index) => {
    if (!selectedRange) {
      setSelectedRange({ start: index, end: index });
    } else {
      setSelectedRange({ ...selectedRange, end: index });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) {
      setModalMessage("Please select an audio file to upload");
      onOpen();
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile);

    setUploading(true);
    try {
      const response = await fetch("/api/upload-clip", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setModalMessage(
          `Audio file uploaded successfully: ${uploadedFile.name}`
        );
        onOpen();
        setUploadedFile(null);
        document.getElementById("audio-file-input").value = "";
        await loadExistingAudio();
        setSelectedAudio(data.file_path);
      } else {
        setModalMessage(`Upload failed: ${data.error}`);
        onOpen();
      }
    } catch (error) {
      setModalMessage(`Error uploading audio: ${error.message}`);
      onOpen();
    } finally {
      setUploading(false);
    }
  };

  const handleAddMusicHighlight = () => {
    if (!selectedRange) return;

    const audioPath = selectedAudio;
    if (!audioPath) {
      setModalMessage("Please select or upload an audio file");
      onOpen();
      return;
    }

    const start = Math.min(selectedRange.start, selectedRange.end);
    const end = Math.max(selectedRange.start, selectedRange.end);

    const selectedWords = transcriptData
      .slice(start, end + 1)
      .map((w) => w.word)
      .join(" ");

    const musicHighlight = {
      start_word: start,
      end_word: end,
      music_path: audioPath,
      text: selectedWords,
      occurrence: 1,
    };

    onAddMusicHighlight(musicHighlight);
    setSelectedRange(null);
  };

  const isWordSelected = (index) => {
    if (!selectedRange) return false;
    const start = Math.min(selectedRange.start, selectedRange.end);
    const end = Math.max(selectedRange.start, selectedRange.end);
    return index >= start && index <= end;
  };

  const isWordHighlighted = (index) => {
    return musicHighlights.some((music) => {
      const start = Math.min(music.start_word, music.end_word);
      const end = Math.max(music.start_word, music.end_word);
      return index >= start && index <= end;
    });
  };

  if (!transcriptData || transcriptData.length === 0) {
    return null;
  }

  return (
    <>
      <Card
        radius="lg"
        shadow="lg"
        className="mb-8 border-2 border-pink-100 bg-gradient-to-br from-white via-pink-50/30 to-rose-50/30 animate-fadeIn hover:shadow-2xl hover:border-pink-200 transition-all duration-300"
      >
        <CardHeader className="flex flex-col items-start pb-6 border-b-2 border-pink-100/50 bg-gradient-to-r from-pink-50/50 to-rose-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
              <Icon icon="mdi:music" className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Step 5: Select Text for Music/Audio
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Add background music or audio to selected words (Optional)
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-6 space-y-6">
          {/* Audio Upload/Select Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload New Audio */}
            <Card radius="lg" shadow="sm" className="border-2 border-pink-100">
              <CardBody className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Icon icon="mdi:upload" className="text-xl text-pink-600" />
                  <h3 className="text-lg font-bold text-pink-700">
                    Upload New Audio
                  </h3>
                </div>
                <input
                  type="file"
                  id="audio-file-input"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="audio-file-input"
                  className="block w-full mb-3 cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-dashed border-pink-300 rounded-xl hover:border-pink-400 hover:bg-pink-100 transition-all">
                    <Icon icon="mdi:folder-open" className="text-xl" />
                    <span className="text-sm font-medium text-gray-700">
                      {uploadedFile ? uploadedFile.name : "Choose Audio File"}
                    </span>
                  </div>
                </label>
                <Button
                  color="primary"
                  size="lg"
                  radius="lg"
                  className="w-full font-bold bg-gradient-to-r from-pink-600 to-rose-600 text-white"
                  onPress={handleUpload}
                  isLoading={uploading}
                  isDisabled={!uploadedFile}
                  startContent={
                    !uploading && <Icon icon="mdi:upload" className="text-xl" />
                  }
                >
                  {uploading ? "Uploading..." : "Upload Audio"}
                </Button>
              </CardBody>
            </Card>

            {/* Select Existing Audio */}
            <Card radius="lg" shadow="sm" className="border-2 border-pink-100">
              <CardBody className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Icon icon="mdi:folder" className="text-xl text-pink-600" />
                  <h3 className="text-lg font-bold text-pink-700">
                    Select Existing Audio
                  </h3>
                </div>
                <Select
                  label="Choose an audio file"
                  placeholder="Select audio file"
                  selectedKeys={selectedAudio ? [selectedAudio] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    setSelectedAudio(selected || "");
                  }}
                  radius="lg"
                  size="lg"
                  classNames={{
                    trigger: "border-2 border-pink-200",
                  }}
                >
                  {audioFiles.map((audio) => (
                    <SelectItem
                      key={`audio_files/${audio}`}
                      value={`audio_files/${audio}`}
                      startContent={
                        <Icon icon="mdi:music-note" className="text-lg" />
                      }
                    >
                      {audio}
                    </SelectItem>
                  ))}
                </Select>
              </CardBody>
            </Card>
          </div>

          <Divider className="my-4" />

          {/* Word Selection */}
          <div>
            <h3 className="text-lg font-bold text-pink-700 mb-3">
              Click words to select range for music
            </h3>
            <div className="p-6 bg-gradient-to-br from-pink-50/50 to-rose-50/50 rounded-2xl border-2 border-pink-100 max-h-96 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {transcriptData.map((entry, index) => (
                  <span
                    key={index}
                    onClick={() => handleWordClick(index)}
                    className={`
                      px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 font-medium text-base
                      ${
                        isWordSelected(index)
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg scale-105"
                          : isWordHighlighted(index)
                          ? "bg-gradient-to-r from-pink-200 to-rose-200 text-pink-900"
                          : "bg-white hover:bg-pink-100 text-gray-700 border border-pink-200"
                      }
                    `}
                  >
                    {entry.word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Selection Controls */}
      {selectedRange && (
        <Card
          radius="lg"
          shadow="lg"
          className="mb-8 border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50 animate-fadeIn"
        >
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-pink-700">
                Selected Range
              </h3>
              <span className="text-sm text-gray-600">
                Words {Math.min(selectedRange.start, selectedRange.end) + 1} -{" "}
                {Math.max(selectedRange.start, selectedRange.end) + 1}
              </span>
            </div>
            <div className="flex gap-3">
              <Tooltip
                content="Add this selection with music"
                color="success"
                radius="lg"
              >
                <Button
                  color="success"
                  size="lg"
                  variant="shadow"
                  radius="lg"
                  className="flex-1 font-bold text-base bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                  onPress={handleAddMusicHighlight}
                  startContent={
                    <Icon icon="mdi:check-circle" className="text-xl" />
                  }
                >
                  Add Music
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

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md" radius="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 bg-gradient-to-r from-pink-50 to-rose-50">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:information"
                    className="text-2xl text-pink-600"
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
                  onPress={onClose}
                  radius="lg"
                  className="font-bold bg-gradient-to-r from-pink-600 to-rose-600"
                >
                  OK
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default MusicSelection;
