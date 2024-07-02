import Text from "@/components/typography/Text";
import { Button } from "@/components/ui/button";

const ImageEditButton = ({
  icon,
  label,
  className,
  onClick,
  height = 12,
  width = 12,
}: {
  icon: React.ReactNode;
  label?: string;
  onClick: () => void;
  height?: number;
  className?: string;
  width?: number;
}) => {
  return (
    <Button
      onClick={onClick}
      variant={"ghost"}
      className={`w-${width} h-${height} border rounded-md shadow flex flex-col justify-center items-center p-1 gap-1 ${className}`}
    >
      {icon}
      <Text style={{ fontSize: "0.55rem", lineHeight: "1rem" }}>{label}</Text>
    </Button>
  );
};

export default ImageEditButton;
