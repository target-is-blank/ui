import { Icons } from "@/components/icons";
import Transfer from "@/registry/animations/transfer";

export const TransferDemo = () => {
  return (
    <Transfer
      firstChild={
        <div className="z-10 flex items-center justify-center bg-white border border-gray-100 rounded-md size-10 p-1">
          <div className=" bg-white shadow-md w-full h-full flex items-center justify-center rounded-md">
            <Icons.gitHub className="size-6" />
          </div>
        </div>
      }
      secondChild={
        <div className="z-10 flex items-center justify-center bg-white border border-gray-100 rounded-md size-10 p-1">
          <div className=" bg-white shadow-md w-full h-full flex items-center justify-center rounded-md">
            <Icons.apple className="size-6" />
          </div>
        </div>
      }
      animation
      containerWidth="400px"
    />
  );
};
