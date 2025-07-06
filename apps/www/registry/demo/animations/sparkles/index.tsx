import Sparkles from "@/registry/animations/sparkles";
import { Button } from "@workspace/ui/components/ui/button";
import { useTheme } from "next-themes";

export const SparklesDemo = () => {
  const { theme } = useTheme();

  return (
    <div className="w-fit h-full flex items-center justify-center mx-auto">
      <Sparkles sparkColor={theme === "dark" ? "#FFF" : "#000"}>
        <Button variant="outline">Click me</Button>
      </Sparkles>
    </div>
  );
};
