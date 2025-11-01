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

function MusicList({ musicHighlights, onRemoveMusicHighlight }) {
  const handleRemove = (index) => {
    onRemoveMusicHighlight(index);
  };

  return (
    <Card
      radius="lg"
      shadow="lg"
      className="mb-8 border-2 border-violet-100 bg-gradient-to-br from-white via-violet-50/30 to-purple-50/30 animate-fadeIn hover:shadow-2xl hover:border-violet-200 transition-all duration-300"
    >
      <CardHeader className="flex flex-col items-start pb-6 border-b-2 border-violet-100/50 bg-gradient-to-r from-violet-50/50 to-purple-50/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Icon icon="mdi:music-note" className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Step 6: Review Your Music/Audio
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your audio assignments ({musicHighlights.length} added)
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-6">
        {musicHighlights.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
              <Icon icon="mdi:music-note" className="text-gray-400 text-5xl" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No music/audio added yet.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Select words in Step 5 to add background music or audio
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-violet-700">
                Your Music/Audio Highlights ({musicHighlights.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Each music/audio will play during the selected words
              </p>
            </div>
            <Divider className="mb-4" />
            {musicHighlights.map((music, index) => (
              <Card
                key={index}
                radius="lg"
                shadow="sm"
                className="border-2 border-violet-100 hover:border-violet-300 transition-all bg-gradient-to-br from-white to-violet-50/30"
              >
                <CardBody className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Chip
                          color="secondary"
                          variant="flat"
                          size="sm"
                          className="font-bold bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700"
                        >
                          #{index + 1}
                        </Chip>
                        <Chip
                          color="secondary"
                          variant="flat"
                          size="sm"
                          startContent={
                            <Icon icon="mdi:music-note" className="text-sm" />
                          }
                          className="font-medium"
                        >
                          Words {music.start_word + 1} - {music.end_word + 1}
                        </Chip>
                      </div>
                      <p className="text-base font-medium text-gray-800 mb-2 leading-relaxed">
                        "{music.text}"
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Icon
                          icon="mdi:file-music"
                          className="text-lg text-violet-600"
                        />
                        <span className="font-medium">
                          {music.music_path.split("/").pop()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Tooltip
                        content="Remove this music highlight"
                        color="danger"
                        radius="lg"
                      >
                        <Button
                          isIconOnly
                          color="danger"
                          size="lg"
                          variant="shadow"
                          radius="lg"
                          className="font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white"
                          onPress={() => handleRemove(index)}
                        >
                          <Icon icon="mdi:delete" className="text-xl" />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default MusicList;
