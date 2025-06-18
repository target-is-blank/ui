/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { index } from "@/__registry__";
import { ComponentWrapper } from "@/components/docs/docs-components-wrapper";
import { DynamicCodeBlock } from "@/components/docs/docs-dynamic-codeblock";

import { type Binds, Tweakpane } from "@workspace/ui/components/docs/tweakpane";
import ReactIcon from "@workspace/ui/components/icons/react-icon";
import { cn } from "@workspace/ui/lib/utils";
import { Loader } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { DocsRender, DocsTrigger } from "./docs-trigger";

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  iframe?: boolean;
  bigScreen?: boolean;
}

function flattenFirstLevel<T>(input: Record<string, any>): T {
  return Object.values(input).reduce((acc, current) => {
    return { ...acc, ...current };
  }, {} as T);
}

function unwrapValues(obj: Record<string, any>): Record<string, any> {
  if (obj !== null && typeof obj === "object" && !Array.isArray(obj)) {
    if ("value" in obj) {
      return obj.value;
    }
    const result: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = unwrapValues(obj[key]);
      }
    }
    return result;
  }
  return obj;
}

export function ComponentPreview({
  name,
  className,
  iframe = false,
  bigScreen = false,
  ...props
}: ComponentPreviewProps) {
  const [binds, setBinds] = useState<Binds | null>(null);
  const [componentProps, setComponentProps] = useState<Record<
    string,
    unknown
  > | null>(null);

  enum Tab {
    PREVIEW = "preview",
    CODE = "code",
  }
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.PREVIEW);

  const code = useMemo(() => {
    const code = index[name]?.files?.[0]?.content;

    if (!code) {
      console.error(`Component with name "${name}" not found in registry.`);
      return null;
    }

    return code;
  }, [name]);

  const preview = useMemo(() => {
    const Component = index[name]?.component;

    if (Object.keys(Component?.demoProps ?? {}).length !== 0) {
      if (componentProps === null)
        setComponentProps(unwrapValues(Component?.demoProps));
      if (binds === null) setBinds(Component?.demoProps);
    }

    if (!Component) {
      console.error(`Component with name "${name}" not found in registry.`);
      return (
        <p className="text-sm text-muted-foreground">
          Component{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {name}
          </code>{" "}
          not found in registry.
        </p>
      );
    }

    return <Component {...flattenFirstLevel(componentProps ?? {})} />;
  }, [name, componentProps, binds]);

  useEffect(() => {
    if (!binds) return;
    setComponentProps(unwrapValues(binds));
  }, [binds]);

  return (
    <div
      className={cn(
        "relative my-4 flex flex-col space-y-2 lg:max-w-[120ch] not-prose",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <DocsTrigger
          type={Tab.PREVIEW}
          currentInstallationType={currentTab}
          onClick={() => setCurrentTab(Tab.PREVIEW)}
        >
          Preview
        </DocsTrigger>
        <DocsTrigger
          type={Tab.CODE}
          currentInstallationType={currentTab}
          onClick={() => setCurrentTab(Tab.CODE)}
        >
          Code
        </DocsTrigger>
      </div>

      <div className="relative w-full min-h-[80px]">
        <DocsRender type={Tab.PREVIEW} currentInstallationType={currentTab}>
          <ComponentWrapper
            name={name}
            iframe={iframe}
            bigScreen={bigScreen}
            tweakpane={
              binds && <Tweakpane binds={binds} onBindsChange={setBinds} />
            }
          >
            <Suspense
              fallback={
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader className="mr-2 size-4 animate-spin" />
                  Loading...
                </div>
              }
            >
              {preview}
            </Suspense>
          </ComponentWrapper>
        </DocsRender>

        <DocsRender type={Tab.CODE} currentInstallationType={currentTab}>
          <div className="flex flex-col space-y-4">
            <div className="w-full rounded-md [&_pre]:my-0 [&_pre]:max-h-[400px] [&_pre]:overflow-auto">
              <DynamicCodeBlock
                code={code}
                lang="tsx"
                title={`${name}.tsx`}
                icon={<ReactIcon />}
              />
            </div>
          </div>
        </DocsRender>
      </div>
    </div>
  );
}
