import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";

function ProcessSection({
  currentVideoPath,
  highlights,
  musicHighlights,
  transcriptData,
  onProcessSuccess,
}) {
  const [processing, setProcessing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info");

  const showModal = (message, type = "info") => {
    setModalMessage(message);
    setModalType(type);
    onOpen();
  };

  const handleProcess = async () => {
    if (!currentVideoPath) {
      showModal("Please upload a video first", "error");
      return;
    }

    if (highlights.length === 0) {
      showModal("Please add at least one highlight", "error");
      return;
    }

    setProcessing(true);

    const allHighlights = [...highlights, ...musicHighlights];

    const payload = {
      video_path: currentVideoPath,
      highlights: allHighlights,
      transcript: transcriptData,
      preserve_audio: true,
    };

    console.log("Payload being sent to backend:", payload);

    try {
      const response = await fetch("/process-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.error) {
        showModal("Error: " + data.error, "error");
        return;
      }

      onProcessSuccess(data.output_filename);
    } catch (error) {
      showModal("Error processing video: " + error.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card
      radius="lg"
      shadow="lg"
      className="mb-8 border-2 border-cyan-100 bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 animate-fadeIn hover:shadow-2xl hover:border-cyan-200 transition-all duration-300"
    >
      <CardHeader className="flex flex-col items-start pb-6 border-b-2 border-cyan-100/50 bg-gradient-to-r from-cyan-50/50 to-blue-50/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Icon icon="mdi:cog" className="text-white text-2xl" />
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
      <CardBody className="pt-6 space-y-6">
        <Tooltip
          content="Process your video with all highlights and effects"
          color="primary"
          radius="lg"
          isDisabled={processing}
        >
          <Button
            color="primary"
            size="lg"
            variant="shadow"
            radius="lg"
            className="w-full font-bold text-base h-14 bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
            isDisabled={processing}
            isLoading={processing}
            onPress={handleProcess}
            startContent={
              !processing && <Icon icon="mdi:movie" className="text-xl" />
            }
          >
            {processing
              ? "Processing video... This may take a while."
              : "Process Video"}
          </Button>
        </Tooltip>

        {processing && (
          <Card
            radius="lg"
            shadow="sm"
            className="border-2 border-cyan-100 bg-gradient-to-br from-cyan-50/50 to-blue-50/50"
          >
            <CardBody className="p-6 space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Icon
                  icon="mdi:cog"
                  className="text-3xl text-cyan-600 animate-spin"
                />
                <p className="text-base font-bold text-cyan-700">
                  Processing your video...
                </p>
              </div>
              <Progress
                size="lg"
                isIndeterminate
                aria-label="Processing..."
                className="w-full"
                color="primary"
                classNames={{
                  indicator: "bg-gradient-to-r from-cyan-500 to-blue-500",
                }}
              />
              <p className="text-center text-sm text-gray-600 font-medium">
                Combining all highlights and music. This may take a while...
              </p>
            </CardBody>
          </Card>
        )}
      </CardBody>

      {/* Modal for alerts */}
      <Modal isOpen={isOpen} onClose={onClose} size="md" radius="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 bg-gradient-to-r from-cyan-50 to-blue-50">
                <div className="flex items-center gap-2">
                  <Icon
                    icon={
                      modalType === "error"
                        ? "mdi:alert-circle"
                        : "mdi:information"
                    }
                    className={`text-2xl ${
                      modalType === "error" ? "text-red-600" : "text-cyan-600"
                    }`}
                  />
                  <span className="text-xl font-bold">
                    {modalType === "error" ? "Error" : "Notice"}
                  </span>
                </div>
              </ModalHeader>
              <Divider />
              <ModalBody className="py-6">
                <p className="text-base text-gray-700">{modalMessage}</p>
              </ModalBody>
              <Divider />
              <ModalFooter>
                <Button
                  color={modalType === "error" ? "danger" : "primary"}
                  variant="shadow"
                  radius="lg"
                  onPress={onClose}
                  className={`font-bold ${
                    modalType === "error"
                      ? "bg-gradient-to-r from-red-600 to-rose-600"
                      : "bg-gradient-to-r from-cyan-600 to-blue-600"
                  }`}
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

export default ProcessSection;
