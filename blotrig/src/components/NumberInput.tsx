import React from "react";

interface NumberInputProps {
  value: number | "";
  setter: React.Dispatch<React.SetStateAction<number | "">>;
  label: string;
  onNumberChange: (
    setter: React.Dispatch<React.SetStateAction<number | "">>,
    label: string,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function NumberInput({
  value,
  setter,
  label,
  onNumberChange,
}: NumberInputProps) {
  return (
    <input
      type="number"
      min={0}
      max={50}
      step={1}
      value={value}
      onChange={onNumberChange(setter, label)}
      placeholder="Enter number"
      className="rounded border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
    />
  );
}
