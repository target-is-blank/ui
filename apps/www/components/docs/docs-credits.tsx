import { cn } from "@workspace/ui/lib/utils";

interface Credit {
  name: string;
  url?: string;
}

interface DocsCreditsProps {
  credits: Credit[];
}

const linkClassName =
  "text-foreground underline underline-offset-2 decoration-blue-500 font-medium cursor-pointer hover:decoration-foreground";

export const DocsCredits = ({ credits }: DocsCreditsProps) => {
  if (!credits.length) return null;

  return (
    <span className="text-sm text-fd-muted-foreground italic">
      Inspired by{" "}
      {credits.map((credit, i) => (
        <span key={credit.name}>
          {i > 0 && i < credits.length - 1 && ", "}
          {i > 0 && i === credits.length - 1 && " and "}
          {credit.url ? (
            <a
              className={cn(linkClassName)}
              href={credit.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {credit.name}
            </a>
          ) : (
            <span className={linkClassName}>{credit.name}</span>
          )}
        </span>
      ))}
    </span>
  );
};
