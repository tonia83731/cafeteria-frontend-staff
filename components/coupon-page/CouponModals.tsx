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
import { MdError } from "react-icons/md";
import { toast } from "react-toastify";
interface I_StaffProductModals {
  type: "create" | "edit" | null;
  coupon: any;
  onModalClose: () => void;
  onFormSubmit: (
    type: "create" | "edit" | null,
    body: any,
    couponId: number | null
  ) => Promise<{ status: boolean; message: string } | undefined>;
}

const discountType_options = [
  {
    value: 0,
    label: "百分比折扣",
  },
  {
    value: 1,
    label: "金額折扣",
  },
];
const CouponModals = ({
  type,
  coupon,
  onModalClose,
  onFormSubmit,
}: I_StaffProductModals) => {
  const discountTypeRef = useRef<any>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [inputValue, setInputValue] = useState({
    title: "",
    title_en: "",
    description: "",
    description_en: "",
    code: "",
    discountValue: 0,
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
      title: "",
      title_en: "",
      description: "",
      description_en: "",
      code: "",
      discountValue: 0,
    });
    setEndDate(null);
    setIsError({
      status: false,
      message: "",
    });
    if (discountTypeRef.current) discountTypeRef.current.value = null;
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
      title,
      title_en,
      description,
      description_en,
      code,
      discountValue,
    } = inputValue;
    const date = new Date(endDate as Date);
    date.setHours(23, 59, 59);
    const curr_timestamp = Date.now();
    const timestamp = date.getTime();

    const discountType = discountTypeRef.current?.props.value;

    if (title === "" || title_en === "") {
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
    if (description.length > 150 || description_en.length > 150) {
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

    if (timestamp && timestamp < curr_timestamp) {
      setIsError({
        status: true,
        message: "有效日期無效!",
      });
      return;
    }

    const body = {
      title,
      title_en,
      description,
      description_en,
      code,
      endDate: timestamp / 1000,
      discountType: discountType.value,
      discountValue,
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
      title: coupon.title || "",
      title_en: coupon.title_en || "",
      description: coupon.description || "",
      description_en: coupon.description_en || "",
      code: coupon.code || "",
      discountValue: coupon.discountValue || 0,
    });

    setEndDate(coupon.endDate ? new Date(coupon.endDate * 1000) : null);

    if (coupon.discountType) {
      const curr_type = discountType_options[coupon.discountType];
      discountTypeRef.current.setValue(curr_type);
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
                id="title"
                name="title"
                placeholder="請輸入優惠券名稱"
                value={inputValue.title}
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
                  selected={endDate}
                  onChange={(date) => {
                    console.log(date);
                    setEndDate(date);
                  }}
                  dateFormat="YYYY-MM-dd"
                  minDate={new Date()}
                  placeholderText="選擇日期"
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
                  value={discountType_options[coupon.discountType] || null}
                  options={discountType_options}
                  styles={SELECTSTYLES}
                  placeholder="請選擇折扣類型"
                />
              </div>
              <DefaultInput
                label="折扣金額"
                id="discountValue"
                name="discountValue"
                type="number"
                placeholder="請輸入折扣金額"
                value={inputValue.discountValue}
                onInputChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-4">
              <DefaultTextareaInput
                label="優惠券介紹"
                id="description"
                name="description"
                placeholder="請輸入優惠券介紹"
                value={inputValue.description}
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
