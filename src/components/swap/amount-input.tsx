import React, { useState } from "react";

interface AmountInputProps {
  value: number | string;
  isLoading?: boolean;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AmountInput = ({
  value,
  isLoading,
  readOnly = false,
  onChange,
}: AmountInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const formattedValue = isFocused
    ? value.toString()
    : Number(value).toLocaleString("en-US", {
        maximumFractionDigits: 6,
      });

  if (isLoading) {
    return (
      <div className="h-8 w-full max-w-[150px] animate-pulse rounded-lg bg-layer-3" />
    );
  }

  return (
    <input
      className="text-text-primary border-none bg-transparent outline-none text-[22px] font-medium w-full text-ellipsis"
      placeholder="0.00"
      inputMode="decimal"
      spellCheck="false"
      pattern="^[0-9]*[.,]?[0-9]*$"
      autoComplete="off"
      type="text"
      value={value ? formattedValue : ""}
      readOnly={readOnly}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onChange={(e) => {
        const value = e.target.value;
        if (value === "" || /^[0-9]*[.]?[0-9]*$/.test(value)) {
          onChange?.(e);
        }
      }}
    />
  );
};

export default AmountInput;
