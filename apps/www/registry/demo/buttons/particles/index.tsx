import ParticlesButton from "@/registry/buttons/particles";
import { StarIcon } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";

export const ParticlesButtonDemo = () => {
  const [isFilled, setIsFilled] = React.useState(false);

  return (
    <ParticlesButton
      as={motion.button}
      className="gap-2 p-2 bg-transparent rounded-md border border-muted text-primary w-fit"
      count={10}
      color="#5a5a5a"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsFilled((prev) => !prev)}
    >
      <StarIcon className="size-4" fill={isFilled ? "none" : "currentColor"} />
      Click me
    </ParticlesButton>
  );
};
