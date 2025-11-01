import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Tooltip,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";

function ResultSection({ outputFilename, onReset }) {
  const handleDownload = () => {
    window.location.href = `/api/download/${outputFilename}`;
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
            <Icon icon="mdi:check-circle" className="text-white text-2xl" />
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

        <Divider className="my-2" />

        <div className="flex gap-3">
          <Tooltip
            content="Download your processed video"
            color="success"
            radius="lg"
          >
            <Button
              color="success"
              size="lg"
              variant="shadow"
              radius="lg"
              className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white"
              onPress={handleDownload}
              startContent={<Icon icon="mdi:download" className="text-xl" />}
            >
              Download Processed Video
            </Button>
          </Tooltip>

          <Tooltip
            content="Start a new video editing project"
            color="default"
            radius="lg"
          >
            <Button
              color="default"
              size="lg"
              variant="shadow"
              radius="lg"
              className="font-bold bg-gradient-to-r from-gray-600 to-slate-600 text-white"
              onPress={onReset}
              startContent={<Icon icon="mdi:refresh" className="text-xl" />}
            >
              Start New Project
            </Button>
          </Tooltip>
        </div>
      </CardBody>
    </Card>
  );
}

export default ResultSection;
