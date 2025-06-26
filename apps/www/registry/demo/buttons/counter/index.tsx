import CounterButton from "@/registry/buttons/counter";

export default function CounterDemo() {
  return (
    <CounterButton
      durationSeconds={10}
      onComplete={() => console.log("Completed!")}
      onClick={() => console.log("Clicked!")}
      acceleration
      angleSpread={10}
    />
  );
}
