import AiInput from "@/registry/components/ai-input";

export const AiInputDemo = () => {
  return (
    <AiInput
      showCharCount
      onSend={async (text) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }}
    />
  );
};
