import * as React from "react";

import { cn } from "@/lib/utils";

type SectionBackground = "default" | "muted" | "dark";

const backgroundClasses: Record<SectionBackground, string> = {
  default: "bg-background text-foreground",
  muted: "bg-muted text-foreground",
  dark: "bg-foreground text-background",
};

interface SectionProps extends React.ComponentProps<"section"> {
  background?: SectionBackground;
  containerClassName?: string;
}

function Section({
  className,
  containerClassName,
  background = "default",
  children,
  ...props
}: SectionProps) {
  return (
    <section
      data-slot="section"
      className={cn(
        "w-full py-16 sm:py-20 lg:py-28",
        backgroundClasses[background],
        className
      )}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="container"
      className={cn("mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12", className)}
      {...props}
    />
  );
}

export { Section, Container };
