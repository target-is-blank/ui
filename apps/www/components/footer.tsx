import config from "@workspace/ui/config";
export const Footer = () => {
  return (
    <div className="h-[55px] border-t">
      <div className="max-w-7xl mx-auto h-full">
        <div className="size-full px-4 md:px-6 flex items-center justify-start prose prose-sm text-sm text-muted-foreground">
          <p className="text-start truncate">
            Built by{" "}
            <a href={config.x.url} rel="noopener noreferrer" target="_blank">
              Lucas
            </a>
            . The source code is available on{" "}
            <a
              href={config.github.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
