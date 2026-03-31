"use client";

import MultiStepModal, {
  type Step,
  type DetailRow,
} from "@/registry/components/multi-step-modal";
import * as React from "react";

const STEPS: Step[] = [
  { label: "Initiate" },
  { label: "Confirm" },
];

export const MultiStepModalDemo = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [stepStatus, setStepStatus] = React.useState<
    "loading" | "success" | "error"
  >("loading");
  const [fillStatus, setFillStatus] = React.useState("Processing");

  React.useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Step 0: loading for 2s
      setCurrentStep(0);
      setStepStatus("loading");
      setFillStatus("Processing");

      await new Promise((r) => setTimeout(r, 2000));
      if (cancelled) return;

      // Step 0: success
      setStepStatus("success");
      setFillStatus("Confirmed");

      await new Promise((r) => setTimeout(r, 1000));
      if (cancelled) return;

      // Step 1: loading for 2s
      setCurrentStep(1);
      setStepStatus("loading");
      setFillStatus("Processing");

      await new Promise((r) => setTimeout(r, 2000));
      if (cancelled) return;

      // Step 1: success
      setStepStatus("success");
      setFillStatus("Confirmed");

      // Restart after 2s
      await new Promise((r) => setTimeout(r, 2000));
      if (cancelled) return;

      run();
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  const statusTitle =
    currentStep === 0
      ? stepStatus === "loading"
        ? "Initiating transaction..."
        : "Transaction initiated"
      : stepStatus === "loading"
        ? "Waiting for confirmation..."
        : "Transaction confirmed!";

  const statusDescription =
    currentStep === 0
      ? stepStatus === "loading"
        ? "Please wait while we process your request."
        : "Your transaction has been sent to the network."
      : stepStatus === "loading"
        ? "Waiting for network confirmation."
        : "Your transaction is complete.";

  const details: DetailRow[] = [
    {
      label: "Fill status",
      value: (
        <span
          className={
            fillStatus === "Confirmed" ? "text-green-600" : "text-amber-500"
          }
        >
          {fillStatus}
        </span>
      ),
    },
    {
      label: "Wallet",
      value: "MetaMask",
      icon: <span>🦊</span>,
    },
  ];

  return (
    <div className="flex items-center justify-center w-full py-8">
      <MultiStepModal
        title="Deposit"
        steps={STEPS}
        currentStep={currentStep}
        stepStatus={stepStatus}
        statusTitle={statusTitle}
        statusDescription={statusDescription}
        details={details}
        onClose={() => {}}
      />
    </div>
  );
};
