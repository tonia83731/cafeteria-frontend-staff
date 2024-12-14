"use client";

type MenuCategoryProps = {
  category_arr: {
    id: number;
    code: string;
    title: string;
  }[];
  selectCategory: string;
  onSelectClick: (e: any, code: string) => void;
};
const ProductCategory = ({
  category_arr,
  selectCategory,
  onSelectClick,
}: MenuCategoryProps) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {category_arr.map(({ id, code, title }) => {
        return (
          <label
            htmlFor={code}
            className={`w-full ${
              selectCategory === code
                ? "bg-fern text-light"
                : "border border-fern text-fern cursor-pointer"
            } text-center rounded-full py-1`}
            key={code}
          >
            <input
              id={code}
              type="radio"
              name="category"
              value={id}
              className="hidden"
              onChange={(e) => onSelectClick(e, code)}
              checked={selectCategory === code}
            />
            {title}
          </label>
        );
      })}
    </div>
  );
};

export default ProductCategory;
