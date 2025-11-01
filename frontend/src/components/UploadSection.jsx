import { useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Progress,
  Chip,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";

export default function UploadSection({ onUploadSuccess }) {
  const [videoFile, setVideoFile] = useState(null);
  const [txtFile, setTxtFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const videoInputRef = useRef(null);
  const txtInputRef = useRef(null);

  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleTxtChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setTxtFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !txtFile) {
      alert("Please select both video and TXT files");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("transcript_file", txtFile);
    setUploading(true);

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

      alert(
        `Script loaded! Found ${data.subtitles.length} subtitle boxes from ${data.word_count} words.`
      );
      onUploadSuccess(data);
    } catch (error) {
      alert("Error uploading files: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card
      radius="lg"
      shadow="lg"
      className="mb-8 border-2 border-purple-100 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 animate-fadeIn hover:shadow-2xl hover:border-purple-200 transition-all duration-300"
    >
      <CardHeader className="flex flex-col items-start pb-6 border-b-2 border-purple-100/50 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Icon icon="mdi:cloud-upload" className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Step 1: Upload Your Files
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Upload your video and transcript to begin
            </p>
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-6 space-y-6">
        {/* Video Upload */}
        <Card radius="lg" shadow="sm" className="border-2 border-purple-100">
          <CardBody className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                <Icon icon="mdi:video" className="text-purple-600 text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-purple-700 mb-1">
                  Main Video
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  MP4, AVI, MOV, MKV supported
                </p>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
                {videoFile ? (
                  <Chip
                    color="success"
                    variant="flat"
                    size="lg"
                    radius="lg"
                    className="font-medium"
                    startContent={<Icon icon="mdi:check" className="text-lg" />}
                  >
                    {videoFile.name}
                  </Chip>
                ) : (
                  <Button
                    color="primary"
                    variant="flat"
                    size="md"
                    radius="lg"
                    className="font-medium bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200"
                    onPress={() => videoInputRef.current?.click()}
                    startContent={
                      <Icon icon="mdi:folder-open" className="text-lg" />
                    }
                  >
                    Choose Video File
                  </Button>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* TXT Upload */}
        <Card radius="lg" shadow="sm" className="border-2 border-blue-100">
          <CardBody className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <Icon
                  icon="mdi:file-document"
                  className="text-blue-600 text-2xl"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-700 mb-1">
                  Script/Transcript
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Plain text file (.txt) with your script
                </p>
                <input
                  ref={txtInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleTxtChange}
                  className="hidden"
                />
                {txtFile ? (
                  <Chip
                    color="success"
                    variant="flat"
                    size="lg"
                    radius="lg"
                    className="font-medium"
                    startContent={<Icon icon="mdi:check" className="text-lg" />}
                  >
                    {txtFile.name}
                  </Chip>
                ) : (
                  <Button
                    color="primary"
                    variant="flat"
                    size="md"
                    radius="lg"
                    className="font-medium bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200"
                    onPress={() => txtInputRef.current?.click()}
                    startContent={
                      <Icon icon="mdi:folder-open" className="text-lg" />
                    }
                  >
                    Choose TXT File
                  </Button>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        <Divider className="my-4" />

        {/* Info Box */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
          <p className="text-sm text-blue-700 flex items-center gap-2 font-medium">
            <Icon icon="mdi:information" className="text-xl text-blue-600" />
            <span>
              Words will be evenly distributed across the video duration
            </span>
          </p>
        </div>

        {/* Upload Button */}
        <Button
          color="primary"
          size="lg"
          variant="shadow"
          radius="lg"
          className="w-full font-bold text-base h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
          isDisabled={!videoFile || !txtFile || uploading}
          isLoading={uploading}
          onPress={handleUpload}
          startContent={
            !uploading && <Icon icon="mdi:upload" className="text-xl" />
          }
        >
          {uploading ? "Processing..." : "Upload & Process"}
        </Button>

        {uploading && (
          <div className="space-y-2">
            <Progress
              size="md"
              isIndeterminate
              aria-label="Uploading..."
              className="w-full"
              color="secondary"
            />
            <p className="text-center text-sm text-gray-500">
              Analyzing your files...
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
