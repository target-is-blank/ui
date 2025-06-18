"use client";

import { index } from "@/__registry__";

import { cn } from "@workspace/ui/lib/utils";
import { useCallback, useState } from "react";
import { CodeTabs } from "./docs-code-tab";
import { ComponentManualInstallation } from "./docs-components-manual-installation";
import { DocsRender, DocsTrigger } from "./docs-trigger";

interface ComponentInstallationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
}

export enum InstallationType {
  CLI = "CLI",
  MANUAL = "Manual",
}

export function ComponentInstallation({
  name,
  className,
  ...props
}: ComponentInstallationProps) {
  const component = index[name];

  const commands = {
    npm: `npx shadcn@latest add "${component.command}"`,
    pnpm: `pnpm dlx shadcn@latest add "${component.command}"`,
    yarn: `npx shadcn@latest add "${component.command}"`,
    bun: `bun x --bun shadcn@latest add "${component.command}"`,
  };

  const [currentInstallationType, setCurrentInstallationType] =
    useState<InstallationType>(InstallationType.CLI);

  const handleInstallationTypeChange = useCallback(
    (type: InstallationType) => {
      setCurrentInstallationType(type);
    },
    [setCurrentInstallationType],
  );

  return (
    <div
      className={cn(
        "relative my-4 flex flex-col space-y-2 lg:max-w-[120ch]",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <DocsTrigger
          type={InstallationType.CLI}
          currentInstallationType={currentInstallationType}
          onClick={() => handleInstallationTypeChange(InstallationType.CLI)}
        >
          {InstallationType.CLI}
        </DocsTrigger>
        <DocsTrigger
          type={InstallationType.MANUAL}
          currentInstallationType={currentInstallationType}
          onClick={() => setCurrentInstallationType(InstallationType.MANUAL)}
        >
          Manual
        </DocsTrigger>
      </div>
      <div className="relative w-full min-h-[80px]">
        <DocsRender
          type={InstallationType.CLI}
          currentInstallationType={currentInstallationType}
        >
          <CodeTabs codes={commands} />
        </DocsRender>
        <DocsRender
          type={InstallationType.MANUAL}
          currentInstallationType={currentInstallationType}
        >
          <ComponentManualInstallation
            path={component.files[0].target}
            dependencies={component.dependencies}
            devDependencies={component.devDependencies}
            registryDependencies={component.registryDependencies}
            code={component.files[0].content}
          />
        </DocsRender>
      </div>
    </div>
  );
}
