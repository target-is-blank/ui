"use client";

import { NumberMosaic } from "@/registry/components/number-mosaic";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

export const NumberMosaicDemo = () => {
  const isMobile = useIsMobile();
  return <NumberMosaic value={isMobile ? 1234 : 123456} random gap={3} />;
};
