import useStaggeredReveal from "@/registry/hooks/use-staggered-reveal";
import { Button } from "@workspace/ui/components/ui/button";

const ITEMS = ["Design", "Develop", "Deploy", "Monitor", "Iterate"];

export default function StaggeredRevealDemo() {
  const { isVisible, replay } = useStaggeredReveal({
    count: ITEMS.length,
    stagger: 120,
    initialDelay: 100,
  });

  return (
    <div className="flex flex-col gap-6 w-[360px]">
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {ITEMS.map((item, i) => (
          <div
            key={item}
            style={{
              transition: "opacity 300ms ease, transform 300ms ease",
              opacity: isVisible(i) ? 1 : 0,
              transform: isVisible(i) ? "translateY(0)" : "translateY(8px)",
            }}
          >
            <span className="text-sm px-3 py-1 rounded-full bg-muted border border-border font-medium">
              {item}
            </span>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={replay} className="w-fit">
        Replay
      </Button>
    </div>
  );
}
