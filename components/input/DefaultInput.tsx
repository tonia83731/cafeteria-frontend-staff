"use client";

import { ChangeEvent } from "react";

// import { LegacyRef } from "react";
type StaffInputProps = {
  id: string;
  name: string;
  type?: string;
  label: string;
  placeholder: string;
  // ref: LegacyRef<HTMLInputElement>;
  value: any;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const DefaultInput = ({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  onInputChange,
}: StaffInputProps) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <label htmlFor={id} className="text-base font-medium">
        {label}
      </label>
      <div className="border border-fern rounded-lg h-10 leading-10 text-fern">
        <input
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          className="placeholder:text-fern-30 placeholder:text-sm px-4"
          value={value}
          onChange={onInputChange}
        />
      </div>
    </div>
  );
};

export default DefaultInput;
