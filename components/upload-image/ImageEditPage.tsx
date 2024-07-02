import React, { useEffect, useState, useRef } from "react";
import { SewingPinIcon, UploadIcon } from "@radix-ui/react-icons";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Image from "next/image";
import Text from "@/components/typography/Text";
import Heading from "@/components/typography/Heading";
import { useDebounceEffect } from "@/hooks/useDebounceEffect";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { canvasPreview } from "./canvasPreview";
import { Button } from "@/components/ui/button";
import ImageEditButton from "./ImageEditButton";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

interface ImageEditPageProps {
  files: File[];
  removeImage: () => void;
  closeDialog: () => void;
  setCroppedImage: (file: File) => void;
}

const ImageEditPage: React.FC<ImageEditPageProps> = ({
  files,
  removeImage,
  closeDialog,
  setCroppedImage,
}) => {
  const firstImage = files[0];
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(1);
  const [circle, setCircle] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const blobUrlRef = useRef("");
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (firstImage) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(firstImage);
    }
  }, [firstImage]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setImageDimensions({ width, height });
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  const rotateImage = (angle: number) => {
    setRotate(rotate + angle);
  };

  const flipImageHorizontal = () => {
    setFlipHorizontal(!flipHorizontal);
  };

  const flipImageVertical = () => {
    setFlipVertical(!flipVertical);
  };

  const rotateOptions = [
    {
      name: "Rotate Left",
      value: "rotate-left",
      icon: <SewingPinIcon height={20} width={20} />,
      onClick: () => rotateImage(-90),
    },
    {
      name: "Rotate Right",
      value: "rotate-right",
      icon: <UploadIcon height={20} width={20} />,
      onClick: () => rotateImage(90),
    },
  ];

  const flipOptions = [
    {
      name: "Flip Horizontal",
      value: "flip-horizontal",
      icon: <UploadIcon height={20} width={20} />,
      onClick: flipImageHorizontal,
    },
    {
      name: "Flip Vertical",
      value: "flip-vertical",
      icon: <UploadIcon height={20} width={20} />,
      onClick: flipImageVertical,
    },
  ];

  async function onDownloadCropClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );

    const blob = await offscreen.convertToBlob({ type: "image/png" });
    const croppedImageFile = new File([blob], "cropped_image.png", {
      type: "image/png",
    });
    setCroppedImage(croppedImageFile);
    closeDialog();
  }

  return (
    <div className="flex flex-col md:flex-col lg:flex-row">
      <div className="w-full md:w-full lg:w-[60%] h-full flex flex-col justify-center items-center">
        <div>
          {!!imgSrc && (
            <ReactCrop
              crop={crop}
              circularCrop={circle}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minWidth={100}
              minHeight={100}
            >
              <div className="relative w-full">
                <Image
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  style={{
                    transform: `scale(${scale}) rotate(${rotate}deg) scaleX(${
                      flipHorizontal ? -1 : 1
                    }) scaleY(${flipVertical ? -1 : 1})`,
                    maxWidth: "100%",
                    height: "auto",
                  }}
                  onLoad={onImageLoad}
                  width={300}
                  height={300}
                />
              </div>
            </ReactCrop>
          )}
          <Text className="text-xs py-1">
            File Size: {Math.round((firstImage.size / 1024 / 1024) * 100) / 100}{" "}
            MB
          </Text>
          <div className="flex text-[#1174a8] font-semibold text-xs justify-center items-center gap-2">
            <UploadIcon height={15} width={15} />
            <Button
              variant={"ghost"}
              onClick={removeImage}
              className="p-0 hover:bg-transparent"
            >
              Replace Image
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full md:w-full lg:w-[40%] px-4 flex flex-col gap-8 justify-center">
        <Heading type="h1">Crop</Heading>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Text className="text-sm">Aspect Ratio</Text>
            <div className="flex flex-wrap gap-4">
              {aspectRatios.map((aspectRatio, index) => {
                const isSelected =
                  aspectRatio.name === "Circle"
                    ? circle
                    : aspect === aspectRatio.value && !circle;
                return (
                  <ImageEditButton
                    className={isSelected ? "border-blue-500" : ""}
                    key={index}
                    icon={aspectRatio.icon}
                    label={aspectRatio.name}
                    onClick={() => {
                      setCircle(aspectRatio.name === "Circle");
                      setAspect(aspectRatio.value);
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Text className="text-sm">Rotate and flip</Text>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-wrap gap-2">
                {rotateOptions.map((rotateOption, index) => (
                  <ImageEditButton
                    key={index}
                    height={8}
                    width={8}
                    icon={rotateOption.icon}
                    onClick={rotateOption.onClick}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {flipOptions.map((flipOption, index) => (
                  <ImageEditButton
                    height={8}
                    width={8}
                    key={index}
                    icon={flipOption.icon}
                    onClick={flipOption.onClick}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        {!!completedCrop && (
          <>
            {" "}
            <div className="hidden">
              <canvas
                ref={previewCanvasRef}
                style={{
                  border: "1px solid black",
                  objectFit: "contain",
                  width: completedCrop.width,
                  height: completedCrop.height,
                }}
              />
            </div>
            <div className="flex justify-around">
              <Button
                variant={"ghost"}
                onClick={() => {}}
                className=" w-[40%] py-2"
              >
                <DialogPrimitive.Close className="w-full rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <Text>Close</Text>
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
              </Button>

              <Button onClick={onDownloadCropClick} className="w-[40%] py-2">
                <Text>Done</Text>
              </Button>

              <a
                href="#hidden"
                ref={hiddenAnchorRef}
                download
                style={{
                  position: "absolute",
                  top: "-200vh",
                  visibility: "hidden",
                }}
              >
                Hidden download
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const aspectRatios = [
  {
    name: "1:1",
    value: 1,
    icon: <UploadIcon height={20} width={20} />,
  },
  {
    name: "4:3",
    value: 4 / 3,
    icon: <UploadIcon height={20} width={20} />,
  },
  {
    name: "16:9",
    value: 16 / 9,
    icon: <UploadIcon height={20} width={20} />,
  },
  {
    name: "3:4",
    value: 3 / 4,
    icon: <UploadIcon height={20} width={20} />,
  },
  {
    name: "9:16",
    value: 9 / 16,
    icon: <UploadIcon height={20} width={20} />,
  },
  {
    name: "Circle",
    value: 1,
    icon: <UploadIcon height={20} width={20} />,
  },
];

export default ImageEditPage;
