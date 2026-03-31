"use client";

import {
  TransactionProgress,
  type StepStatus,
} from "@/registry/components/transaction-progress";
import * as React from "react";

const STEPS = [
  {
    label: "Submitting transaction...",
    description: "Filling your transaction on the blockchain.",
  },
  {
    label: "Confirming transaction...",
    description: "Waiting for blockchain confirmation.",
  },
];

const SEQUENCE: StepStatus[][] = [
  ["loading", "idle"],
  ["complete", "idle"],
  ["complete", "loading"],
  ["complete", "complete"],
];

const DELAYS = [1800, 800, 1800, 2000];

function MetaMaskIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 32 32"
      fill="none"
      aria-label="MetaMask"
    >
      <rect width="32" height="32" rx="8" fill="#F6851B" />
      <path
        d="M26.5 5L17.9 11.3l1.6-3.7L26.5 5z"
        fill="#E2761B"
        stroke="#E2761B"
        strokeWidth="0.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 5l8.5 6.4-1.5-3.7L5.5 5zM23.4 21.3l-2.3 3.5 4.9 1.4 1.4-4.8-4-0.1zM4.7 21.4l1.4 4.8 4.9-1.4-2.3-3.5-4 0.1z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.7 14.3l-1.4 2.1 4.9.2-.2-5.3-3.3 3zM20.3 14.3l-3.4-3.1-.1 5.3 4.9-.2-1.4-2zM11 24.8l2.9-1.4-2.5-2-0.4 3.4zM18.1 23.4l2.9 1.4-.4-3.4-2.5 2z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7M8 1h3m0 0v3m0-3L5 7"
        stroke="#9ca3af"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const TransactionProgressDemo = () => {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(
      () => {
        setPhase((prev) => (prev + 1) % SEQUENCE.length);
      },
      DELAYS[phase % DELAYS.length],
    );
    return () => clearTimeout(timer);
  }, [phase]);

  const statuses = SEQUENCE[phase] ?? ["idle", "idle"];

  const details = [
    {
      label: "Wallet",
      value: (
        <span className="flex items-center gap-1.5">
          <MetaMaskIcon />
          <span>Metamask</span>
          <ExternalLinkIcon />
        </span>
      ),
    },
    {
      label: "Network",
      value: "Ethereum",
    },
    {
      label: "Amount",
      value: "0.05 ETH",
    },
  ];

  return (
    <div className="flex items-center justify-center p-6">
      <TransactionProgress
        title="Deposit"
        steps={STEPS}
        statuses={statuses}
        details={details}
      />
    </div>
  );
};
