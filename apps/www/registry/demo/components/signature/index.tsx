"use client";

import { Signature } from "@/registry/components/signature";
import { useTheme } from "next-themes";

export const SignatureDemo = () => {
  const { theme } = useTheme();
  return <Signature strokeStyle={theme === "dark" ? "#FFF" : "#000"} />;
};
