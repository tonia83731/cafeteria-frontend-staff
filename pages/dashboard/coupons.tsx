import { clientFetch, serverFetch } from "@/lib/fetch";
import StaffSearch from "@/components/input/StaffSearch";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CouponModals from "@/components/coupon-page/CouponModals";
import { useState } from "react";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import CouponTable from "@/components/coupon-page/CouponTable";
export type LanguageOptions = {
  value: "zh" | "en";
  label: string;
};
export const language_options: LanguageOptions[] = [
  {
    value: "zh",
    label: "中文版",
  },
  {
    value: "en",
    label: "英文版",
  },
];
const DashboardCouponsPage = ({ coupons }: any) => {
  const token = getCookie("adminToken");
  const [modalToggle, setModalToggle] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit" | null>(null);
  const [language, setLanguage] = useState<LanguageOptions>(
    language_options[0]
  );
  const [inputValue, setInputValue] = useState("");
  const [couponDatas, setCouponDatas] = useState(coupons);
  const [coupon, setCoupon] = useState(null);

  const handleLanguageSwitch = () => {
    const new_lang = language_options.find(
      (lang) => lang.value !== language.value
    );
    if (new_lang) {
      setLanguage(new_lang);
    }
  };

  const handleSearchClick = () => {
    const filter_coupons = coupons.filter(
      (item: any) =>
        item.title.zh.includes(inputValue) ||
        item.title.en.toLowerCase().includes(inputValue.toLowerCase()) ||
        item.code.toLowerCase().includes(inputValue.toLowerCase())
    );
    setCouponDatas(filter_coupons);
  };
  const handleClearClick = () => {
    if (inputValue === "") return;
    setCouponDatas(coupons);
    setInputValue("");
  };

  const handleEditClick = async (couponId: number) => {
    setModalToggle(true);
    setModalType("edit");
    try {
      const response = await clientFetch(`/admin/coupons/${couponId}`, {
        token,
      });
      if (response.success) {
        setCoupon(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClick = async (couponId: number) => {
    try {
      const response = await clientFetch(`/admin/coupons/${couponId}/deleted`, {
        method: "DELETE",
        token,
      });

      if (response.success) {
        toast.success("優惠券刪除成功!");
        const update_coupons = coupons.filter(
          (coupon: any) => coupon.id !== couponId
        );
        setCouponDatas(update_coupons);
      } else {
        toast.error("優惠券刪除失敗，請在試一次!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (
    type: "create" | "edit" | null,
    body: any,
    couponId: number | null
  ) => {
    try {
      const url =
        type === "create"
          ? "/admin/coupons/add"
          : `/admin/coupons/${couponId}/updated`;
      const response = await clientFetch(url, {
        method: type === "create" ? "POST" : "PUT",
        body,
        token,
      });
      if (response.success) {
        if (type === "create") {
          setCouponDatas([...couponDatas, response.data]);
          return {
            status: true,
            message: "優惠券新增成功!",
          };
        } else {
          setCouponDatas((prevCoupon: any) =>
            prevCoupon.map((coupon: any) =>
              coupon.id === couponId ? response.data : coupon
            )
          );
          return {
            status: true,
            message: "優惠券修改成功!",
          };
        }
      } else {
        if (type === "create") {
          return {
            status: false,
            message: "優惠券新增失敗!",
          };
        } else {
          return {
            status: false,
            message: "優惠券修改失敗!",
          };
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlePublishedSwitch = async (couponId: number) => {
    try {
      const response = await clientFetch(
        `/admin/coupons/${couponId}/published`,
        {
          method: "PATCH",
          token,
        }
      );
      if (response.success) {
        const updated_coupons = couponDatas.map((coupon: any) => {
          return coupon.id === couponId
            ? { ...coupon, isPublished: true }
            : coupon;
        });
        setCouponDatas(updated_coupons);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-4 gap-4 flex justify-between items-end">
        <h1 className="text-2xl md:text-4xl font-bold">優惠券列表</h1>
        <div className="flex items-center gap-2">
          {/* <CouponModals type="create" categories={categories} /> */}
          <button
            onClick={() => {
              setModalToggle(true);
              setModalType("create");
            }}
            className="bg-apricot text-white px-4 py-1 rounded-lg md:text-lg"
          >
            新增
          </button>
          <button
            className="bg-fern text-white px-4 py-1 rounded-lg md:text-lg"
            onClick={handleLanguageSwitch}
          >
            {language.label}
          </button>
        </div>
      </div>
      <div className="w-full md:flex md:justify-end">
        <StaffSearch
          placeholder="請輸入優惠券名稱或code"
          className="md:w-2/5"
          inputValue={inputValue}
          onInputChange={(e) => setInputValue(e.target.value)}
          onSearchClick={handleSearchClick}
          onClearClick={handleClearClick}
        />
      </div>
      <CouponTable
        tableData={couponDatas}
        language={language.value}
        onCouponEdit={handleEditClick}
        onCouponDelete={handleDeleteClick}
        onCouponPublished={handlePublishedSwitch}
      />
      {modalToggle && (
        <CouponModals
          type={modalType}
          onModalClose={() => {
            setModalToggle(false);
            setModalType(null);
          }}
          coupon={coupon}
          onFormSubmit={handleFormSubmit}
        />
      )}
    </DashboardLayout>
  );
};

export default DashboardCouponsPage;

export async function getServerSideProps(context: any) {
  // const coupons = await serverFetch(context, `/api/admin/coupons`, "GET");
  // console.log(coupons);
  const coupons = await serverFetch(context, `/api/admin/coupons`, "GET");

  return {
    props: {
      coupons: coupons.data,
    },
  };
}
