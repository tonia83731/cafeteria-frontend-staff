import dayjs from "dayjs";
import ToggleSwitch from "../input/ToggleSwtich";
import { ChangeEvent, useState } from "react";
import { clientFetch } from "@/lib/fetch";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
// import CouponModals from "./CouponModals";
export type CouponItemProps = {
  id: number;
  title: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
  code: string;
  startDate: string;
  endDate: string;
  discountType: string;
  discountValue: number;
  isPublished: boolean;

  language: "zh" | "en";
  // categories: any;
  onCouponEditClick: (id: number) => void;
  onCouponDeleteClick: (id: number) => void;
};
const CouponItem = ({
  id,
  title,
  description,
  code,
  startDate,
  endDate,
  discountType,
  discountValue,
  isPublished,
  language,
  // categories,
  onCouponEditClick,
  onCouponDeleteClick,
}: CouponItemProps) => {
  const token = getCookie("adminToken");
  const start = dayjs(startDate).format("YYYY-MM-DD");
  const end = dayjs(endDate).format("YYYY-MM-DD");
  const [published, setPublished] = useState(isPublished);

  const discount =
    discountType === "percent" ? `${discountValue}%` : `-${discountValue}`;

  const handleToggleChecked = async (e: ChangeEvent, id: number) => {
    try {
      const response = await clientFetch(`/admin/coupons/${id}/published`, {
        method: "PUT",
        token,
      });

      if (response.success) {
        toast.success("優惠券已成功發布!");
        setPublished(!published);
      } else {
        toast.error("優惠券發布失敗，請在試一次!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-ivory text-fern rounded-lg drop-shadow-lg p-4 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-0.5">
          <h5 className="text-base font-bold">{title[language]}</h5>
          <p className="text-xs">
            @{code} |{" "}
            <span className="bg-fern text-ivory px-1">{discount}</span>
          </p>
        </div>
        <ToggleSwitch
          checked={published}
          id={id}
          onToggleChecked={handleToggleChecked}
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-xs text-fern-60 h-[40px]">{description[language]}</p>
        <p className="text-xs text-fern-60">
          有效期限: {start} ~ {end}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          disabled={published}
          className="bg-apricot text-white rounded-lg hover:drop-shadow-lg py-0.5 disabled:bg-default-gray disabled:hover:drop-shadow-none"
          onClick={() => onCouponEditClick(id)}
        >
          修改
        </button>
        <button
          onClick={() => onCouponDeleteClick(id)}
          className="bg-fern-60 text-white rounded-lg hover:drop-shadow-lg py-0.5"
        >
          刪除
        </button>
      </div>
    </div>
  );
};

export default CouponItem;
