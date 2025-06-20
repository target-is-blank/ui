import ParticlesButton from "@/registry/buttons/particles";
import { StarIcon } from "lucide-react";
import { motion } from "motion/react";

export const ParticlesButtonDemo = () => {
  return (
    <ParticlesButton
      as={motion.button}
      className="gap-2 p-2 bg-transparent rounded-md border border-neutral-300 text-neutral-700 dark:text-neutral-300 w-fit dark:border-neutral-700"
      count={10}
      color="#5a5a5a"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <StarIcon className="size-4" />
      Click me
    </ParticlesButton>
  );
};
