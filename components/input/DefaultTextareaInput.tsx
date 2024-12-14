import { ChangeEvent } from "react";

export type TextAreaProps = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  // ref: LegacyRef<HTMLTextAreaElement>;
  value: any;
  onInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
};
const DefaultTextareaInput = ({
  id,
  name,
  label,
  placeholder,
  value,
  onInputChange,
}: TextAreaProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-base md:text-lg">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        // ref={ref}
        value={value}
        onChange={onInputChange}
        placeholder={placeholder}
        className="border border-fern rounded-lg w-full resize-none hover:resize-y px-4 py-2 text-fern placeholder:text-fern-30 placeholder:text-sm"
      ></textarea>
    </div>
  );
};

export default DefaultTextareaInput;
