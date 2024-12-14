import { ChangeEvent } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
const StaffSearch = ({
  placeholder,
  className = "",
  inputValue,
  onInputChange,
  onSearchClick,
  onClearClick,
}: {
  placeholder: string;
  className?: string;
  inputValue: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearchClick: () => void;
  onClearClick: () => void;
}) => {
  return (
    <div
      className={`w-full ${className} border border-fern text-fern rounded-full cursor-pointer`}
    >
      <div className="grid grid-cols-[2fr_20px_20px] gap-2 py-1 px-4">
        <input
          id="staff-search"
          type="text"
          className="placeholder:text-natural placeholder:text-sm"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => onInputChange(e)}
        />
        <button
          // disabled={inputValue === ""}
          className="text-fern-60 hover:text-fern disabled:hover:text-fern-60"
          onClick={onClearClick}
        >
          <RxCross2 />
        </button>
        <button
          disabled={inputValue === ""}
          className="text-lg w-[20px] disabled:text-fern-60"
          onClick={onSearchClick}
        >
          <FaMagnifyingGlass />
        </button>
      </div>
    </div>
  );
};

export default StaffSearch;
