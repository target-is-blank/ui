"use client";

import { MultiStepModal } from "@/registry/components/multi-step-modal";
import React from "react";

const STEPS = [{ label: "Approve" }, { label: "Confirm" }];

type Status = "loading" | "success" | "error";

const FLOW: {
  step: number;
  status: Status;
  title: string;
  description: string;
  delay: number;
}[] = [
  {
    step: 0,
    status: "loading",
    title: "Submitting transaction...",
    description: "Filling your transaction on the blockchain.",
    delay: 0,
  },
  {
    step: 1,
    status: "loading",
    title: "Confirming transaction...",
    description: "Waiting for blockchain confirmation.",
    delay: 2500,
  },
  {
    step: 2,
    status: "success",
    title: "Transaction complete!",
    description: "Your deposit has been confirmed.",
    delay: 5000,
  },
];

export default function MultiStepModalDemo() {
  const [flowIndex, setFlowIndex] = React.useState(0);

  React.useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    FLOW.forEach((f, i) => {
      if (i === 0) return;
      timers.push(setTimeout(() => setFlowIndex(i), f.delay));
    });

    // Restart after full cycle
    timers.push(setTimeout(() => setFlowIndex(0), 7000));

    return () => timers.forEach(clearTimeout);
  }, [flowIndex === 0 ? flowIndex : undefined]);

  const current = FLOW[flowIndex];

  return (
    <div className="flex items-center justify-center p-8 w-full bg-gray-200 rounded-2xl min-h-[500px]">
      <MultiStepModal
        title="Deposit"
        steps={STEPS}
        currentStep={current.step}
        stepStatus={current.status}
        statusTitle={current.title}
        statusDescription={current.description}
        details={[
          {
            label: "Fill status",
            value: current.step >= 1 ? "Confirmed" : "Processing",
          },
          {
            label: "Wallet",
            value: (
              <span className="flex items-center gap-1.5">
                <span>🦊</span>
                <span>Metamask</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </span>
            ),
          },
        ]}
        onBack={() => {}}
        onClose={() => {}}
        className="w-full max-w-md"
      />
    </div>
  );
}
