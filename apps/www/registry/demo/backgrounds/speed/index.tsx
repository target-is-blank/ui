import SpeedBackground from "@/registry/backgrounds/speed";

export default function SpeedBackgroundDemo() {
  return (
    <SpeedBackground
      className="w-full h-96 bg-white rounded-xl"
      count={15}
      color="black"
    >
      <div className="flex items-center justify-center h-full text-3xl font-bold">
        Speed Mode 💨
      </div>
    </SpeedBackground>
  );
}
