import ParticlesBackground from "@/registry/backgrounds/particles";
import {
  Card,
  CardDescription,
  CardFooter,
  CardGradient,
  CardHeader,
  CardIndicator,
  CardTitle,
} from "@/registry/components/card";

export const CardDemo = () => {
  return (
    <Card
      image={
        "https://preview.redd.it/nature-vibes-v0-vhl86w7e60jc1.jpg?width=1080&crop=smart&auto=webp&s=b1553f868c8d46408ac0f2a860f19f8c14793bf4"
      }
    >
      <CardGradient from="rgba(255,255,255,0.70) 40%" to="transparent 80%" />
      <CardIndicator className="z-[1]">
        <div className="flex gap-2 justify-start items-center p-1 w-fit">
          <div className="bg-lime-400 rounded-full shadow-sm size-1.5 shadow-lime-300" />
          <span className="text-[9px] text-gray-600 leading-none">
            New-Reels Instagram Creator
          </span>
        </div>
      </CardIndicator>
      <CardHeader className="z-[1]">
        <CardTitle>
          <div className="flex flex-col gap-1">
            <span className="text-lime-900">Craft Your</span>
            <span className="italic font-light text-gray-800">
              Imaginary Escape
            </span>
          </div>
        </CardTitle>
        <CardDescription>
          <span className="text-sm text-lime-800">
            The leading AI art generation and image editing tool with 3.5B+
            creations
          </span>
        </CardDescription>
      </CardHeader>
      <CardFooter
        as="button"
        className="px-4 py-2 w-full tracking-tight bg-[#bee227] rounded-lg"
      >
        <ParticlesBackground count={10} />
        <span className="z-10 w-full text-center">Generated Image</span>
      </CardFooter>
    </Card>
  );
};
