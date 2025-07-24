"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/ui/button";
import { cn } from "@workspace/ui/lib/utils";
import { Loader, Send } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function useAutosizeTextArea(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  maxRows = 8,
) {
  const mirrorMap = React.useRef<WeakMap<HTMLTextAreaElement, HTMLDivElement>>(
    new WeakMap(),
  );

  React.useLayoutEffect(() => {
    const ta = ref.current;
    if (!ta) return;

    const text = typeof value === "string" ? value : "";

    let mirror = mirrorMap.current.get(ta);
    if (!mirror) {
      mirror = document.createElement("div");
      mirror.setAttribute("data-ta-mirror", "");
      mirror.style.position = "absolute";
      mirror.style.top = "-9999px";
      mirror.style.left = "0";
      mirror.style.visibility = "hidden";
      mirror.style.whiteSpace = "pre-wrap";
      mirror.style.wordWrap = "break-word";
      mirror.style.overflowWrap = "break-word";
      document.body.appendChild(mirror);
      mirrorMap.current.set(ta, mirror);
    }

    const computed = window.getComputedStyle(ta);
    const lineHeight = parseInt(computed.lineHeight || "24", 10);
    const maxHeight = lineHeight * maxRows;

    const propsToCopy = [
      "fontSize",
      "fontFamily",
      "fontWeight",
      "fontStyle",
      "letterSpacing",
      "textTransform",
      "textIndent",
      "padding",
      "borderWidth",
      "boxSizing",
      "lineHeight",
      "width",
    ] as const;

    propsToCopy.forEach((p) => {
      mirror!.style[p] = computed[p];
    });

    mirror.style.width = ta.offsetWidth + "px";

    let mirrorText = text;
    if (/\n$/.test(mirrorText)) {
      mirrorText += " ";
    }
    if (mirrorText === "") {
      mirrorText = " ";
    }
    mirror.textContent = mirrorText;

    const mirrorHeight = mirror.scrollHeight;
    const newHeight = Math.min(mirrorHeight, maxHeight);

    ta.style.height = newHeight + "px";
    ta.style.overflowY = mirrorHeight > maxHeight ? "auto" : "hidden";
  }, [ref, value, maxRows]);

  React.useEffect(() => {
    const ta = ref.current;
    return () => {
      if (!ta) return;
      const mirror = mirrorMap.current.get(ta);
      if (mirror && mirror.parentNode) {
        mirror.parentNode.removeChild(mirror);
        mirrorMap.current.delete(ta);
      }
    };
  }, [ref]);
}

const inputSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

export type AiInputProps = {
  onSend?: (text: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  maxRows?: number;
  showCharCount?: boolean;
  className?: string;
};

export default function AiInput({
  onSend,
  disabled = false,
  placeholder = "Ask thumbnail",
  maxRows = 8,
  showCharCount = false,
  className,
}: AiInputProps) {
  const [isSending, setIsSending] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const form = useForm<z.infer<typeof inputSchema>>({
    resolver: zodResolver(inputSchema),
    defaultValues: { text: "" },
  });

  const value = form.watch("text", "");

  const isMultiline = React.useMemo(() => {
    const ta = textareaRef.current;
    if (!ta) return /\n/.test(value);
    const lh = parseInt(getComputedStyle(ta).lineHeight || "24", 10);
    return ta.scrollHeight > lh + 1;
  }, [value]);

  useAutosizeTextArea(textareaRef, value, maxRows);

  const triggerSend = async (data: z.infer<typeof inputSchema>) => {
    const trimmed = data.text.trim();
    if (!trimmed) return;
    setIsSending(true);
    try {
      await onSend?.(trimmed);
      form.reset();
    } finally {
      setIsSending(false);
    }
  };

  const onSubmit = (data: z.infer<typeof inputSchema>) => {
    void triggerSend(data);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const isDisabled = (type: "textarea" | "button") => {
    const empty = !value || !value.trim();
    if (type === "textarea") return disabled || isSending;
    if (type === "button") return disabled || isSending || empty;
    return false;
  };

  const { ref: rhfRef, ...field } = form.register("text");
  const mergeRefs = (el: HTMLTextAreaElement | null) => {
    textareaRef.current = el;
    rhfRef(el);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn(
        "relative w-full border border-zinc-300 dark:border-zinc-700 rounded-2xl p-1 flex flex-col gap-2 transition-colors",
        className,
      )}
    >
      <div
        className={cn("flex gap-2", isMultiline ? "items-end" : "items-center")}
      >
        <textarea
          ref={mergeRefs}
          {...field}
          className="pl-2 flex-1 resize-none bg-transparent outline-none text-primary placeholder-zinc-400 text-base leading-6 max-h-[40vh]"
          placeholder={placeholder}
          disabled={isDisabled("textarea")}
          rows={1}
          onKeyDown={handleKeyDown}
        />

        <motion.div layout className="flex items-center gap-2">
          {showCharCount && (
            <div className="text-xs text-zinc-400 self-end mt-1">
              {value.length} characters
            </div>
          )}
          <Button
            size="icon"
            type="submit"
            disabled={isDisabled("button")}
            aria-label="Send"
          >
            {isSending ? <Loader className="animate-spin" /> : <Send />}
          </Button>
        </motion.div>
      </div>
    </form>
  );
}
