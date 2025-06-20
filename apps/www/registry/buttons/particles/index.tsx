import ParticlesBackground from "@/registry/backgrounds/particles";
import { cn } from "@workspace/ui/lib/utils";

const DEFAULT_COMPONENT = "button";

type ParticlesButtonProps<
  T extends React.ElementType = typeof DEFAULT_COMPONENT,
> = {
  as?: T;
  color?: string;
  count?: number;
} & React.ComponentProps<T>;

const ParticlesButton = <
  T extends React.ElementType = typeof DEFAULT_COMPONENT,
>({
  as,
  className,
  color = "white",
  count = 18,
  ...props
}: ParticlesButtonProps<T>) => {
  const Comp = as || DEFAULT_COMPONENT;

  return (
    <Comp
      className={cn(
        "flex overflow-hidden relative z-10 items-center w-full h-full text-sm text-center text-gray-700 shadow-[inset_0px_0px_2px_0px_#FFFFFF]",
        className,
      )}
      {...props}
    >
      <ParticlesBackground color={color} count={count} />
      {props.children}
    </Comp>
  );
};

export default ParticlesButton;
