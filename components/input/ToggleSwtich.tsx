import { ChangeEvent } from "react";

const ToggleSwitch = ({
  id,
  checked,
  onToggleChecked,
}: {
  id: number;
  checked: boolean;
  onToggleChecked: (e: ChangeEvent, id: number) => void;
}) => {
  return (
    <label
      htmlFor={`toggle-${id}`}
      className="relative inline-block w-[40px] h-[22px]"
    >
      <input
        id={`toggle-${id}`}
        type="checkbox"
        className="opacity-0 w-0 h-0"
        disabled={checked}
        onChange={(e) => onToggleChecked(e, id)}
      />
      <span
        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-[34px] transition duration-500 before:absolute before:content-[''] before:h-[18px] before:w-[18px] before:left-[2px] before:bottom-[2px] before:bg-white before:transition before:duration-500 before:rounded-full ${
          checked ? "bg-apricot before:translate-x-[18px]" : "bg-default-gray"
        }`}
      ></span>
    </label>
  );
};

export default ToggleSwitch;
