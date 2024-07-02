import { UploadIcon, ReloadIcon } from "@radix-ui/react-icons";
import Text from "@/components/typography/Text";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import ImageEditPage from "./ImageEditPage";
import ImageUploadPage from "./ImageUploadPage";

const ImageDropZone = ({
  setCroppedImage,
  active,
  content,
}: {
  setCroppedImage: (file: File) => void;
  active: boolean;
  content: string;
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const onDrop = (acceptedFiles: File[]) => {
    addImage(acceptedFiles);
  };

  const [screenStack, setScreenStack] = useState([
    <ImageUploadPage key={0} onDrop={onDrop} />,
  ]);

  const addImage = (acceptedFiles: File[]) => {
    setImages(acceptedFiles);
    setScreenStack([
      ...screenStack,
      <ImageEditPage
        key={1}
        files={acceptedFiles}
        removeImage={removeImage}
        closeDialog={closeDialog}
        setCroppedImage={setCroppedImage}
      />,
    ]);
  };

  const removeImage = () => {
    setImages([]);
    setScreenStack([<ImageUploadPage key={0} onDrop={onDrop} />]);
  };
  const closeDialog = () => {
    setIsDialogOpen(false);
    removeImage();
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          removeImage();
        }
      }}
    >
      <DialogTrigger asChild>
        {active ? (
          <div className="w-96 border-2 border-dashed border-green-300 py-2 px-16 mt-8 rounded-lg flex gap-16 items-center cursor-pointer">
            <ReloadIcon color="#4cb553" height={20} width={20} />
            <div className="flex flex-col items-center text-[#4cb553]">
              <Text className="font-semibold">Got a better one?</Text>
              <Text className="text-xs opacity-80">
                Drag and drop or Browse
              </Text>
            </div>
          </div>
        ) : (
          <div className="w-96 border-2 border-dashed border-gray-300 py-2 px-16 mt-8 rounded-lg flex gap-16 items-center cursor-pointer">
            <UploadIcon height={20} width={20} />
            <div className="flex flex-col items-center text-[#595959]">
              <Text className="font-semibold">{content}</Text>
              <Text className="text-xs opacity-80">
                Drag and drop or Browse
              </Text>
            </div>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-[90%] min-h-[90%] md:min-w-[60%] md:min-h-[90%] lg:min-w-[60%] lg:min-h-[70%]">
        {screenStack[screenStack.length - 1]}
      </DialogContent>
    </Dialog>
  );
};

export const ORComponent = () => {
  return (
    <div className="flex items-center md:w-16 gap-2 justify-center">
      <Separator />
      <Text className="text-xs opacity-60">OR</Text>
      <Separator />
    </div>
  );
};

// export const socialMedias = [
//   {
//     icon: <FacebookBlueIcon width={20} height={20} />,
//     name: "Connect with Facebook",
//     onClick: () => {},
//   },
//   {
//     icon: <InstagramColourIcon />,
//     name: "Connect with Instagram",
//     onClick: () => {},
//   },
//   {
//     icon: <QRCodeIcon />,
//     name: "Add a QR Code",
//     onClick: () => {},
//   },
// ];

export default ImageDropZone;
