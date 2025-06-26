import Sparkles from "@/registry/animations/sparkles";
import { Button } from "@workspace/ui/components/ui/button";

export const SparklesDemo = () => {
  return (
    <div className="w-fit h-full flex items-center justify-center mx-auto">
      <Sparkles sparkColor="#000">
        <Button variant="outline">Click me</Button>
      </Sparkles>
    </div>
  );
};
