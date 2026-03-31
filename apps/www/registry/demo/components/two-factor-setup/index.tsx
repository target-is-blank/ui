"use client";

import { TwoFactorSetup } from "@/registry/components/two-factor-setup";

export default function TwoFactorSetupDemo() {
  return (
    <div className="flex items-center justify-center p-8 w-full">
      <TwoFactorSetup
        backupCode="ORBT-7X92-KLL9-001P"
        onVerify={(token) => console.log("Token:", token)}
        onCancel={() => console.log("Cancelled")}
        onClose={() => console.log("Closed")}
      />
    </div>
  );
}
