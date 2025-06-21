"use client";

import WheelSelector from "@/registry/components/wheel-selector";
import React from "react";

const WheelSelectorDemo = () => {
  const numberItems = React.useMemo(() => {
    const min = 100;
    const max = 200;
    return Array.from({ length: max - min + 1 }, (_, i) => i + min);
  }, []);
  const [numberValue, setNumberValue] = React.useState(numberItems[43]); // 143

  React.useEffect(() => {
    const interval = setInterval(() => {
      const newValue =
        numberItems[Math.floor(Math.random() * numberItems.length)];
      setNumberValue(newValue);
    }, 3000);

    return () => clearInterval(interval);
  }, [numberItems]);

  const fruitItems = React.useMemo(
    () => ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape"],
    [],
  );
  const [fruitValue, setFruitValue] = React.useState(fruitItems[2]);

  return (
    <div className="flex flex-col gap-8 justify-center items-center">
      <div>
        <h3 className="mb-2 font-semibold text-center">Number Selector</h3>
        <WheelSelector<number>
          items={numberItems}
          value={numberValue}
          onChange={setNumberValue}
          className="w-48"
        />
      </div>

      <div>
        <h3 className="mb-2 font-semibold text-center">Fruit Selector</h3>
        <WheelSelector<string>
          items={fruitItems}
          value={fruitValue}
          onChange={setFruitValue}
          width={100}
          className="w-80"
          renderItem={({ item, isSelected }) => (
            <div
              className={`flex h-full w-full items-center justify-center rounded-lg font-bold transition-all duration-200 ${
                isSelected
                  ? "text-neutral-300 bg-neutral-700 dark:bg-neutral-300 dark:text-neutral-700"
                  : "text-neutral-700 bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300"
              }`}
            >
              {item}
            </div>
          )}
        />
        <p className="text-xs text-center text-neutral-400 dark:text-neutral-600">
          Try to grab it
        </p>
      </div>
    </div>
  );
};

export default WheelSelectorDemo;
