import useAsyncAction from "@/registry/hooks/use-async-action";
import { Button } from "@workspace/ui/components/ui/button";

function fakeUpload(): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.35) {
        resolve({ url: "https://cdn.example.com/file-" + Date.now() });
      } else {
        reject(new Error("Upload failed — server error"));
      }
    }, 1400);
  });
}

export default function AsyncActionDemo() {
  const { execute, status, data, error, reset, isLoading } = useAsyncAction(
    fakeUpload,
    { preventConcurrent: true },
  );

  return (
    <div className="flex flex-col gap-4 w-[360px]">
      <div className="flex items-center gap-3">
        <span className="capitalize text-xs font-medium px-2 py-0.5 rounded-full border border-current">
          {status}
        </span>
        {data && (
          <span className="text-xs text-muted-foreground truncate">
            {data.url}
          </span>
        )}
        {error && (
          <span className="text-xs text-destructive">{error.message}</span>
        )}
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => execute()} disabled={isLoading}>
          {isLoading ? "Uploading…" : "Upload file"}
        </Button>
        {status !== "idle" && (
          <Button size="sm" variant="outline" onClick={reset}>
            Reset
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        ~65% success rate. Click upload to trigger the async action.
      </p>
    </div>
  );
}
