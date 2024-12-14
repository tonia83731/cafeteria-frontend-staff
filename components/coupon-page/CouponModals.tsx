"use client";
import { ChangeEvent, useState, useRef, useEffect } from "react";
import Select from "react-select";
import {
  SELECTSTYLES,
  // MULTISELECTSTYLES,
  // handleOptions,
  // SelectOptionTypes,
} from "@/constants/select-style";
import DatePicker from "react-datepicker";
// import { getCookie } from "cookies-next";
// import { toast } from "react-toastify";
// import { clientFetch } from "@/lib/fetch";
import StaffModals from "../layout/StaffModals";
import DefaultInput from "../input/DefaultInput";
import DefaultTextareaInput from "../input/DefaultTextareaInput";
import { RxCross2 } from "react-icons/rx";
import { MdError } from "react-icons/md";
import { toast } from "react-toastify";
// import { category_dummy } from "@/dummy/category_dummy";
interface I_StaffProductModals {
  type: "create" | "edit" | null;
  categories: any;
  coupon: any;
  onModalClose: () => void;
  onFormSubmit: (
    type: "create" | "edit" | null,
    body: any,
    couponId: number | null
  ) => Promise<{ status: boolean; message: string } | undefined>;
}
type DateRangeType = {
  startDate: Date | null;
  endDate: Date | null;
};
const discountType_options = [
  {
    value: "percent",
    label: "百分比折扣",
  },
  {
    value: "price",
    label: "金額折扣",
  },
];
const CouponModals = ({
  type,
  categories,
  coupon,
  onModalClose,
  onFormSubmit,
}: I_StaffProductModals) => {
  // const token = getCookie("adminToken");
  const category_options = categories.map(
    ({ id, title }: { id: number; title: string }) => {
      return {
        value: id,
        label: title,
      };
    }
  );

  const discountTypeRef = useRef<any>(null);
  const categoryRef = useRef<any>(null);
  const [dateRange, setDateRange] = useState<DateRangeType>({
    startDate: new Date(),
    endDate: null,
  });
  const [inputValue, setInputValue] = useState({
    title_zh: "",
    title_en: "",
    description_zh: "",
    description_en: "",
    code: "",
    // discountType,
    discountValue: 0,
    minSpend: 0,
    // categoryId,
  });
  const [isError, setIsError] = useState({
    status: false,
    message: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const initializedInput = () => {
    setInputValue({
      title_zh: "",
      title_en: "",
      description_zh: "",
      description_en: "",
      code: "",
      discountValue: 0,
      minSpend: 0,
    });
    setDateRange({
      startDate: new Date(),
      endDate: null,
    });
    setIsError({
      status: false,
      message: "",
    });
    if (discountTypeRef.current) discountTypeRef.current.value = null;
    if (categoryRef.current) categoryRef.current.value = null;
  };

  const handleModalClose = () => {
    onModalClose();
    initializedInput();
  };
  const handleModalSubmit = async (e: any) => {
    e.preventDefault();
    setIsError({
      status: false,
      message: "",
    });
    const {
      title_zh,
      title_en,
      description_zh,
      description_en,
      code,
      discountValue,
      minSpend,
    } = inputValue;
    const { startDate, endDate } = dateRange;
    const discountType = discountTypeRef.current?.props.value;
    const category = categoryRef.current?.props.value;
    // console.log(discountType, category);

    if (title_zh === "" || title_en === "") {
      setIsError({
        status: true,
        message: "優惠券名稱(zh, en)不可空白!",
      });
      return;
    }
    if (code === "") {
      setIsError({
        status: true,
        message: "優惠券CODE不可空白!",
      });
      return;
    }
    if (description_zh.length > 150 || description_en.length > 150) {
      setIsError({
        status: true,
        message: "優惠券介紹需介於1-150字之間!",
      });
      return;
    }

    if (!discountType) {
      setIsError({
        status: true,
        message: "折扣類型不可空白!",
      });
      return;
    }

    if (
      discountType.value === "percent" &&
      discountValue <= 0 &&
      discountValue >= 100
    ) {
      setIsError({
        status: true,
        message: "折扣金額錯誤，(百分比)金額請介於0-100之間!",
      });
      return;
    }

    if (discountType.value === "price" && discountValue <= 0) {
      setIsError({
        status: true,
        message: "折扣金額錯誤，(金額)請大於0!",
      });
      return;
    }

    if (!endDate) {
      setIsError({
        status: true,
        message: "有效日期(結束時間)不可空白!",
      });
      return;
    }

    if (startDate && endDate && (startDate > endDate || endDate < new Date())) {
      setIsError({
        status: true,
        message: "有效日期無效!",
      });
      return;
    }

    const body = {
      title_zh,
      title_en,
      description_zh,
      description_en,
      code,
      startDate,
      endDate,
      discountType: discountType.value,
      discountValue,
      ...(category ? { categoryId: category.value } : {}),
      ...(minSpend ? { categoryId: minSpend } : {}),
    };

    const couponId = type === "edit" ? coupon.id : null;

    const response = await onFormSubmit(type, body, couponId);

    if (response?.status) {
      toast.success(response.message);
      handleModalClose();
    } else {
      toast.error(response?.message);
    }
  };

  useEffect(() => {
    if (!coupon || type !== "edit") return;
    setInputValue({
      title_zh: coupon.title.zh || "",
      title_en: coupon.title.en || "",
      description_zh: coupon.description.zh || "",
      description_en: coupon.description.en || "",
      code: coupon.code || "",
      discountValue: coupon.discountValue || 0,
      minSpend: coupon.minSpend || 0,
    });

    setDateRange({
      startDate: coupon.startDate ? new Date(coupon.startDate) : new Date(),
      endDate: coupon.endDate ? new Date(coupon.endDate) : null,
    });

    if (coupon.discountType) {
      const curr_type = discountType_options.find((option) => {
        return option.value === coupon.discountType;
      });
      discountTypeRef.current.setValue(curr_type);
    }

    if (coupon.categoryId) {
      const curr_cate = category_options.find(
        (option: any) => option.value === coupon.categoryId
      );
      categoryRef.current.setValue(curr_cate);
    }
  }, [coupon, type]);

  return (
    <>
      <StaffModals title="新增優惠券" onClose={handleModalClose}>
        <form
          onSubmit={(e) => handleModalSubmit(e)}
          className="flex flex-col gap-6 h-full max-h-[500px] px-4 overflow-y-auto overflow-x-hidden modal"
        >
          <div className="flex flex-col gap-4">
            {/* name */}
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
              <DefaultInput
                label="優惠券名稱"
                id="title_zh"
                name="title_zh"
                placeholder="請輸入優惠券名稱"
                value={inputValue.title_zh}
                onInputChange={handleInputChange}
              />
              <DefaultInput
                label="Product Name"
                id="title_en"
                name="title_en"
                placeholder="Enter the product title"
                value={inputValue.title_en}
                onInputChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
              <DefaultInput
                label="優惠券CODE"
                id="code"
                name="code"
                placeholder="請輸入Code"
                value={inputValue.code}
                onInputChange={handleInputChange}
              />
              <div className="w-full flex flex-col gap-2">
                <label htmlFor="startDate" className="text-base font-medium">
                  有效日期
                </label>
                <DatePicker
                  className="w-full border border-fern rounded-lg h-10 leading-10 text-fern placeholder:text-fern-30 placeholder:text-sm px-4"
                  selected={dateRange.startDate}
                  onChange={(dates) => {
                    const [start, end] = dates;
                    setDateRange({ startDate: start, endDate: end });
                  }}
                  minDate={new Date()}
                  selectsRange
                  startDate={dateRange.startDate as Date}
                  endDate={dateRange.endDate as Date}
                  placeholderText="選擇日期範圍"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="discountType" className="text-base font-medium">
                  折扣類型
                </label>
                <Select
                  id="discountType"
                  ref={discountTypeRef}
                  options={discountType_options}
                  styles={SELECTSTYLES}
                  placeholder="請選擇折扣類型"
                />
              </div>
              <DefaultInput
                label="折扣金額"
                id="discountValue"
                name="discountValue"
                placeholder="請輸入折扣金額"
                value={inputValue.discountValue}
                onInputChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-base font-medium">
                  折扣類別
                </label>
                <div className="relative">
                  <Select
                    id="category"
                    // isClearable
                    ref={categoryRef}
                    options={category_options}
                    styles={SELECTSTYLES}
                    placeholder="請選擇折扣類別"
                  />
                  <button
                    onClick={() => {
                      if (categoryRef.current) {
                        categoryRef.current.clearValue();
                      }
                    }}
                    className="absolute top-1/2 right-2 -translate-y-1/2"
                  >
                    <RxCross2 />
                  </button>
                </div>
              </div>
              <DefaultInput
                label="優惠券最低使用金額"
                type="number"
                id="minSpend"
                name="minSpend"
                placeholder="請輸入最低使用金額"
                value={inputValue.minSpend}
                onInputChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col gap-4">
              <DefaultTextareaInput
                label="優惠券介紹"
                id="description_zh"
                name="description_zh"
                placeholder="請輸入優惠券介紹"
                value={inputValue.description_zh}
                onInputChange={handleInputChange}
              />
              <DefaultTextareaInput
                label="Coupon Description"
                id="description_en"
                name="description_en"
                placeholder="Enter the coupon description"
                value={inputValue.description_en}
                onInputChange={handleInputChange}
              />
            </div>
          </div>
          {isError.status && (
            <div className="text-red-500 flex items-center gap-1">
              <MdError />
              <p>{isError.message}</p>
            </div>
          )}
          <footer className="flex flex-col gap-2 md:grid md:grid-cols-2">
            <button
              type="button"
              onClick={handleModalClose}
              className="bg-moss-60 text-white py-1 w-full md:h-full rounded-lg"
            >
              取消
            </button>
            {type === "create" ? (
              <button
                type="submit"
                className="bg-apricot text-white py-1 w-full md:h-full rounded-lg hover:shadow-md"
              >
                新增
              </button>
            ) : (
              <button
                type="submit"
                className="bg-apricot text-white py-1 w-full md:h-full rounded-lg hover:shadow-md"
              >
                修改
              </button>
            )}
          </footer>
        </form>
      </StaffModals>
    </>
  );
};

export default CouponModals;
