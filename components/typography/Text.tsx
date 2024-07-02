import { cn } from "@/lib/utils";
import React from "react";

const Text = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p
      className={cn("leading-7", className)}
      {...props}
    />
  );
};

export default Text;
