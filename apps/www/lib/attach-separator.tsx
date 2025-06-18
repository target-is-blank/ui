import BaseUIIcon from "@workspace/ui/components/icons/baseui-icon";
import HeadlessUIIcon from "@workspace/ui/components/icons/headlessui-icon";
import RadixIcon from "@workspace/ui/components/icons/radix-icon";
import ShadcnIcon from "@workspace/ui/components/icons/shadcn-icon";
import type { BuildPageTreeOptions } from "fumadocs-core/source";

const Icon = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="size-4.5 [&_svg]:!size-[11px] flex items-center justify-center bg-foreground text-background rounded-sm">
      {children}
    </span>
  );
};

const Separator = ({ icon, name }: { icon: React.ReactNode; name: string }) => {
  return (
    <span className="flex items-center gap-1.5">
      <Icon>{icon}</Icon>
      <span>{name}</span>
    </span>
  );
};

export const attachSeparator: BuildPageTreeOptions["attachSeparator"] = (
  node,
) => {
  switch (node.name) {
    case "Radix UI / Shadcn UI":
      node.name = (
        <>
          <Separator
            icon={<RadixIcon className="!size-2.5" />}
            name="Radix UI"
          />{" "}
          /{" "}
          <Separator
            icon={<ShadcnIcon className="!size-3.5" />}
            name="Shadcn UI"
          />
        </>
      );
      break;
    case "Base UI":
      node.name = <Separator icon={<BaseUIIcon />} name="Base UI" />;
      break;
    case "Headless UI":
      node.name = <Separator icon={<HeadlessUIIcon />} name="Headless UI" />;
      break;
  }

  return node;
};
