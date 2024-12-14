import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Select from "react-select";
import {
  SELECTSTYLES,
  // MULTISELECTSTYLES,
  // handleOptions,
  // SelectOptionTypes,
} from "@/constants/select-style";
// import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
// import { clientFetch } from "@/lib/fetch";
import StaffModals from "../layout/StaffModals";
import DefaultInput from "../input/DefaultInput";
import DefaultTextareaInput from "../input/DefaultTextareaInput";
import { MdError } from "react-icons/md";
const handleOptions = (datas: any[]) => {
  return datas.map(({ id, title }: { id: number; title: string }) => ({
    label: title,
    value: id,
  }));
};

// type SelectOptionsType = {
//   label: string;
//   value: number;
// };

interface I_StaffProductModals {
  type: "create" | "edit" | null;
  categories: any;
  // sizes: any;
  // sugars: any;
  // ices: any;
  product: null | any;
  isLoading: boolean;
  onModalClose: () => void;
  onFormSubmit: (
    type: "create" | "edit" | null,
    formData: any,
    productId: number | null
  ) => Promise<{ status: boolean; message: string } | undefined>;
}

export const getFileExtension = (file: File) =>
  file?.name?.substring(file.name.lastIndexOf(".") + 1)?.toLowerCase();

const ProductModals = ({
  type,
  categories,
  product,
  isLoading,
  onModalClose,
  onFormSubmit,
}: I_StaffProductModals) => {
  const category_options = handleOptions(categories);
  const categoryRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState({
    title_zh: "",
    title_en: "",
    description_zh: "",
    description_en: "",
    price: 0,
  });
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [isError, setIsError] = useState({
    status: false,
    message: "",
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsError({
      status: false,
      message: "",
    });
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadlimits = 209715200;
    if (file.size > uploadlimits) {
      setIsError({
        status: true,
        message: "檔案不可超過200MB",
      });
      return;
    }
    if (!["jpg", "jpeg", "png"].includes(getFileExtension(file))) {
      setIsError({
        status: true,
        message: "檔案格式不符，格式須為 jpg, jpeg, pngPNG 或 JPEG 檔",
      });
      return;
    }

    setInputFile(file);
  };
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(typeof value);
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsError({
      status: false,
      message: "",
    });

    // const categoryId = categoryOptions?.value;
    const category = categoryRef.current?.props.value;
    const { title_zh, title_en, description_zh, description_en, price } =
      inputValue;

    if (title_zh === "" || title_en === "") {
      setIsError({
        status: true,
        message: "產品名稱(zh, en)不可空白!",
      });
      return;
    }

    if (price <= 0) {
      setIsError({
        status: true,
        message: "產品價格不可為0!",
      });
      return;
    }

    if (!category) {
      setIsError({
        status: true,
        message: "請選擇產品類別!",
      });
      return;
    }

    if (description_zh.length > 150 || description_en.length > 150) {
      setIsError({
        status: true,
        message: "產品介紹需介於1-150字之間!",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title_zh", title_zh);
    formData.append("title_en", title_en);
    formData.append("description_zh", description_zh);
    formData.append("description_en", description_en);
    formData.append("price", price.toString());
    formData.append("categoryId", category.value.toString());

    if (inputFile) {
      formData.append("file", inputFile);
    }

    const productId = type === "edit" ? product.id : null;

    const response = await onFormSubmit(type, formData, productId);

    if (response?.status) {
      toast.success(response.message);
      initializedData();
    } else {
      toast.error(response?.message);
    }
  };

  const initializedData = () => {
    onModalClose();
    setInputValue({
      title_zh: "",
      title_en: "",
      description_zh: "",
      description_en: "",
      price: 0,
    });
    setInputFile(null);
    // setCategoryOptions(null);
    if (categoryRef.current) categoryRef.current.value = null;
    setIsError({
      status: false,
      message: "",
    });
  };

  useEffect(() => {
    if (type === "create") return;
    if (!product) return;
    setInputValue({
      title_zh: product.title.zh || "",
      title_en: product.title.en || "",
      description_zh: product.description.zh || "",
      description_en: product.description.en || "",
      price: product.price || 0,
    });

    // setInputFile(product.image || null);

    // console.log(product.categoryId);
    if (product.categoryId) {
      const curr_cate = category_options.find(
        (cate) => cate.value === product.categoryId
      );
      // console.log(curr_cate);
      // if (curr_cate) {
      //   setCategoryOptions(curr_cate);
      // }
      categoryRef.current.setValue(curr_cate);
    }
  }, [product, type]);

  return (
    <StaffModals title="新增產品" onClose={initializedData}>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-6 h-full max-h-[500px] px-4 overflow-y-auto overflow-x-hidden modal"
      >
        <div className="flex flex-col gap-4">
          <label
            htmlFor="file"
            className="flex flex-col justify-center items-center gap-2"
          >
            <div
              className="w-[180px] h-[180px] bg-cover bg-no-repeat bg-center flex justify-center items-center"
              style={{
                backgroundImage: inputFile
                  ? `url(${URL.createObjectURL(inputFile)})`
                  : product && product.image
                  ? `url(${product.image})`
                  : "none",
              }}
            >
              <div className="w-[150px] h-[30px] bg-light-60 flex justify-center items-center gap-1.5 border border-fern text-fern hover:border-0 hover:bg-natural hover:text-white text-sm rounded-lg px-4 py-1 hover:shadow cursor-pointer">
                {inputFile || (product && product.image)
                  ? "更換檔案"
                  : "選擇檔案"}
              </div>
            </div>
            <p className="text-xs text-natural">
              可上傳.jpg, .jpeg, .png，檔案不超過200MB
            </p>
            <input
              type="file"
              name="file"
              id="file"
              className="hidden"
              accept=".jpg, .jpeg, .png"
              onChange={handleFileChange}
            />
          </label>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
            <DefaultInput
              label="產品名稱"
              id="title_zh"
              name="title_zh"
              placeholder="請輸入產品名稱"
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
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-base font-medium">
              商品類別
            </label>
            <Select
              id="category"
              options={category_options}
              styles={SELECTSTYLES}
              ref={categoryRef}
              placeholder="請選擇商品類別"
              isOptionDisabled={(option) => !option.value}
            />
          </div>

          <DefaultInput
            label="產品價格"
            id="price"
            name="price"
            type="number"
            placeholder="請輸入產品價格"
            value={inputValue.price}
            onInputChange={handleInputChange}
          />
          <div className="flex flex-col gap-4">
            <DefaultTextareaInput
              label="產品介紹"
              id="description_zh"
              name="description_zh"
              placeholder="請輸入產品介紹"
              value={inputValue.description_zh}
              onInputChange={handleInputChange}
            />
            <DefaultTextareaInput
              label="Product Description"
              id="description_en"
              name="description_en"
              placeholder="Enter the product description"
              value={inputValue.description_en}
              onInputChange={handleInputChange}
            />
          </div>
        </div>
        {/* <MdError /> */}
        {isError.status && (
          <div className="text-red-500 flex items-center gap-1">
            <MdError />
            <p>{isError.message}</p>
          </div>
        )}
        <footer className="flex flex-col gap-2 md:grid md:grid-cols-2">
          <button
            disabled={isLoading}
            type="button"
            onClick={initializedData}
            className="bg-moss-60 text-white py-1 w-full md:h-full rounded-lg"
          >
            取消
          </button>
          {type === "create" ? (
            <button
              disabled={isLoading}
              type="submit"
              className="bg-apricot text-white py-1 w-full md:h-full rounded-lg hover:shadow-md"
            >
              {isLoading ? "新增中..." : "新增"}
            </button>
          ) : (
            <button
              disabled={isLoading}
              type="submit"
              className="bg-apricot text-white py-1 w-full md:h-full rounded-lg hover:shadow-md"
            >
              {isLoading ? "修改中..." : "修改"}
            </button>
          )}
        </footer>
      </form>
    </StaffModals>
  );
};

export default ProductModals;
