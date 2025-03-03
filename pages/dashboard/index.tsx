import DashboardLayout from "@/components/layout/DashboardLayout";
// import StaffProductModals from "@/components/product-page/ProductModals";
import ProductModals from "@/components/product-page/ProductModals";
import ProductCategory from "@/components/product-page/ProductCategory";
import StaffSearch from "@/components/input/StaffSearch";
import { clientFetch, serverFetch } from "@/lib/fetch";
import ProductTable from "@/components/product-page/ProductTable";
import { LanguageOptions, language_options } from "./coupons";
import { getCookie } from "cookies-next";
import { useState } from "react";
import { toast } from "react-toastify";

const DashboardProductsPage = ({ categories, products }: any) => {
  const token = getCookie("adminToken");
  const [language, setLanguage] = useState<LanguageOptions>(
    language_options[0]
  );
  const [selectCategory, setSelectCategory] = useState("ALL");
  const [inputValue, setInputValue] = useState("");
  const [modalToggle, setModalToggle] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit" | null>(null);
  const [tableProducts, setTableProducts] = useState(products);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleLanguageSwitch = () => {
    const new_lang = language_options.find(
      (lang) => lang.value !== language.value
    );
    if (new_lang) {
      setLanguage(new_lang);
    }
  };

  const handleSelectClick = async (e: any, code: string) => {
    const categoryId = e.target.value;
    if (!categoryId) {
      setTableProducts(products);
      setSelectCategory("ALL");
      return;
    }
    try {
      const response = await clientFetch(
        `/admin/products?categoryId=${categoryId}`,
        {
          token,
        }
      );
      // console.log(response);
      const product_data = response.data.map(
        ({
          id,
          categoryCode,
          image,
          title,
          title_en,
          description,
          description_en,
          price,
          isPublished,
        }: any) => ({
          id,
          categoryCode,
          image,
          title: {
            zh: title,
            en: title_en,
          },
          description: {
            zh: description,
            en: description_en,
          },
          price,
          isPublished,
        })
      );
      // console.log(product_data);
      setTableProducts(product_data);
      setSelectCategory(code);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearchClick = () => {
    const filter_products = products.filter(
      (item: any) =>
        item.title.zh.includes(inputValue) ||
        item.title.en.toLowerCase().includes(inputValue.toLowerCase())
    );
    setTableProducts(filter_products);
  };
  const handleClearClick = () => {
    if (inputValue === "") return;
    setTableProducts(products);
    setInputValue("");
  };

  const handleProductEdit = async (productId: number) => {
    try {
      const response = await clientFetch(`/admin/products/${productId}`, {
        token,
      });
      if (response.success) {
        setModalToggle(true);
        setModalType("edit");
        setProduct(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductDelete = async (productId: number) => {
    // console.log(productId);
    try {
      const response = await clientFetch(`/admin/products/${productId}`, {
        method: "DELETE",
        token,
      });
      if (response.success) {
        toast.success("產品刪除成功!");
        const update_products = products.filter(
          (product: any) => product.id !== productId
        );
        setTableProducts(update_products);
      } else {
        toast.error("產品刪除失敗，請在試一次!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (
    type: "create" | "edit" | null,
    formData: any,
    productId: number | null
  ) => {
    if (type === "create") {
      try {
        setLoading(true);
        const response = await clientFetch("/admin/products", {
          method: "POST",
          body: formData,
          token,
        });
        if (response.success) {
          setLoading(false);
          const { id, categoryCode, title, description, price } = response.data;
          const new_product = {
            id,
            categoryCode,
            title,
            description,
            price,
          };
          setTableProducts([...tableProducts, new_product]);
          return {
            status: true,
            message: "產品新增成功!",
          };
        } else {
          setLoading(false);
          return {
            status: false,
            message: "產品新增失敗，請在試一次!",
          };
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        return {
          status: false,
          message: "產品新增失敗，請在試一次!",
        };
      }
    } else {
      if (!productId) return;
      try {
        setLoading(true);
        const response = await clientFetch(`/admin/products/${productId}`, {
          method: "PUT",
          body: formData,
          token,
        });
        if (response.success) {
          setLoading(false);
          const { id, categoryCode, title, description, price } = response.data;
          const update_product = {
            id,
            categoryCode,
            title,
            description,
            price,
          };
          setTableProducts((prevProducts: any) =>
            prevProducts.map((product: any) =>
              product.id === productId ? update_product : product
            )
          );

          return {
            status: true,
            message: "產品修改成功!",
          };
        } else {
          setLoading(false);
          return {
            status: false,
            message: "產品修改失敗，請在試一次!",
          };
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        return {
          status: false,
          message: "產品修改失敗，請在試一次!",
        };
      }
    }
  };

  const handleProductPublished = async (
    productId: number,
    isPublished: boolean
  ) => {};
  return (
    <DashboardLayout>
      <div className="mb-4 gap-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl font-bold">產品列表</h1>
        <div className="flex items-center gap-2">
          {/* <StaffProductModals type="create" /> */}
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
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
        <ProductCategory
          category_arr={categories}
          selectCategory={selectCategory}
          onSelectClick={handleSelectClick}
        />
        <StaffSearch
          placeholder="請輸入產品名稱"
          className="md:justify-self-end md:w-4/5"
          inputValue={inputValue}
          onInputChange={(e) => setInputValue(e.target.value)}
          onSearchClick={handleSearchClick}
          onClearClick={handleClearClick}
        />
      </div>
      {/* <div className=""></div> */}
      <ProductTable
        tableData={tableProducts}
        language={language.value}
        onProductEdit={handleProductEdit}
        onProductDelete={handleProductDelete}
        onProductPublished={handleProductPublished}
      />
      {modalToggle && (
        <ProductModals
          categories={categories}
          type={modalType}
          product={product}
          onModalClose={() => {
            setModalToggle(false);
            setProduct(null);
          }}
          onFormSubmit={handleFormSubmit}
          isLoading={loading}
        />
      )}
    </DashboardLayout>
  );
};

export default DashboardProductsPage;

export async function getServerSideProps(context: any) {
  const [categories, products] = await Promise.all([
    serverFetch(context, `/api/admin/categories`, "GET"),
    serverFetch(context, `/api/admin/products`, "GET"),
  ]);

  const cate_matched = [null, null, "咖啡", "茶飲", "冰品", "甜點"];

  // console.log(categories);

  let category_data = categories.data.map(
    ({ id, code }: { id: number; code: string }) => ({
      id,
      title: cate_matched[id - 1],
      code,
    })
  );

  category_data = [
    {
      title: "全部",
      code: "ALL",
    },
    ...category_data,
  ];

  const product_data = products.data.map(
    ({
      id,
      image,
      categoryCode,
      title,
      title_en,
      description,
      description_en,
      price,
      isPublished,
    }: any) => ({
      id,
      image,
      categoryCode,
      title: {
        zh: title,
        en: title_en,
      },
      description: {
        zh: description,
        en: description_en,
      },
      price,
      isPublished,
    })
  );

  return {
    props: {
      categories: category_data,
      products: product_data,
    },
  };
}
