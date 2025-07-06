import { Icons } from "@/components/icons";
import Transfer from "@/registry/animations/transfer";
import { useTheme } from "next-themes";

export const TransferDemo = () => {
  const { theme } = useTheme();

  return (
    <Transfer
      firstChild={
        <div className="z-10 flex items-center justify-center bg-white border border-gray-100 rounded-md size-10 p-1">
          <div className=" bg-white shadow-md w-full h-full flex items-center justify-center rounded-md">
            <Icons.gitHub className="size-6 text-black" />
          </div>
        </div>
      }
      secondChild={
        <div className="z-10 flex items-center justify-center bg-white border border-gray-100 rounded-md size-10 p-1">
          <div className=" bg-white shadow-md w-full h-full flex items-center justify-center rounded-md">
            <Icons.apple className="size-6 text-black" />
          </div>
        </div>
      }
      color={theme === "dark" ? ["#FFF"] : ["#000"]}
      animation
      containerWidth="400px"
    />
  );
};
