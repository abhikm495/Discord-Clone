import React from "react";

import { cn } from "@/lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Heading = ({ type, className, ...props }: HeadingProps) => {
  const Tag = type;

  return (
    <Tag className={cn("font-bold", className)} {...props} />
  );
};

export default Heading;
