import { UploadIcon } from "@radix-ui/react-icons";
import Text from "@/components/typography/Text";
import { Button } from "@/components/ui/button";
import { ORComponent } from "./ImageDropZone";
import { useDropzone } from "react-dropzone";
const ImageUploadPage = ({
  onDrop,
}: {
  onDrop: (acceptedFiles: File[]) => void;
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col justify-center md:flex-col lg:flex-row">
      <div className="w-full pt-14 md:w-full lg:w-[60%]">
        {/* Drop zone */}
        <div
          {...getRootProps()}
          className="flex flex-col border items-center justify-evenly h-[80%]"
        >
          <UploadIcon height={60} width={60} color="#a0c7dc" />
          <Text className="text-xs">Drag and Drop Images</Text>
          <ORComponent />
          {isDragActive || (
            <Button className="w-32 h-7 text-xs rounded-sm">Browse</Button>
          )}

          <input {...getInputProps()} />
        </div>
      </div>
    </div>
  );
};

export default ImageUploadPage;
