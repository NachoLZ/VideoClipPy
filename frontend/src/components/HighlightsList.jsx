import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Chip,
  Tooltip,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";

function HighlightsList({ highlights, setHighlights }) {
  const handleRemove = (index) => {
    const newHighlights = highlights.filter((_, i) => i !== index);
    setHighlights(newHighlights);
  };

  return (
    <Card
      radius="lg"
      shadow="lg"
      className="mb-8 border-2 border-orange-100 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 animate-fadeIn hover:shadow-2xl hover:border-orange-200 transition-all duration-300"
    >
      <CardHeader className="flex flex-col items-start pb-6 border-b-2 border-orange-100/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <Icon icon="mdi:clipboard-list" className="text-white text-2xl" />
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
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
              <Icon
                icon="mdi:clipboard-list"
                className="text-gray-400 text-5xl"
              />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No highlights added yet.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Select text above to create your first highlight.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {highlights.map((highlight, index) => {
              const fileName = (highlight.clip_path || highlight.music_path)
                .split("/")
                .pop();

              return (
                <Card
                  key={index}
                  radius="lg"
                  shadow="md"
                  className="bg-gradient-to-br from-white via-orange-50/40 to-amber-50/40 border-2 border-orange-200 hover:border-orange-400 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <CardBody className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-2xl font-bold text-white">
                            #{index + 1}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 mb-2 border border-amber-200">
                          <p className="text-base font-bold text-gray-800 leading-relaxed">
                            "{highlight.phrase}"
                          </p>
                        </div>
                        <Divider className="my-2" />
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Chip
                            size="md"
                            variant="flat"
                            color="primary"
                            radius="lg"
                            className="font-semibold"
                          >
                            📹 {fileName}
                          </Chip>
                          <Chip
                            size="md"
                            variant="flat"
                            color="default"
                            radius="lg"
                            className="font-medium"
                          >
                            Words {highlight.start_word + 1}-
                            {highlight.end_word + 1}
                          </Chip>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <Tooltip
                          content="Remove this highlight"
                          color="danger"
                          radius="lg"
                        >
                          <Button
                            color="danger"
                            size="lg"
                            variant="shadow"
                            radius="lg"
                            className="font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white"
                            onPress={() => handleRemove(index)}
                            startContent={
                              <Icon icon="mdi:delete" className="text-xl" />
                            }
                          >
                            Remove
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default HighlightsList;
