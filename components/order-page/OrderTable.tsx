import {
  PaginationState,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { orderStatus, paymentOpts, shippingOpts } from "@/data/status-option";
import dayjs from "dayjs";
import { iceOpts, sizeOpts, sugarOpts } from "@/data/product-options";

export type OrderTableType = {
  id: number;
  status: number;
  userId: number;
  User: {
    name: string;
    phone: string;
    email: string;
  }; // orderer
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  payment: number;
  shipping: number;
  productPrice: number;
  discountId: number | null;
  discountPrice: number;
  Discount: {
    Coupon: {
      code: string;
      discountType: number;
      discountValue: number;
      title: string;
    };
    id: number;
    couponId: number;
    userId: number;
    isApplied: true;
    updatedAt: string;
    createdAt: string;
  } | null;
  tax: number;
  total: number;
  OrderItems: {
    orderId: number;
    productId: number;
    Product: {
      title: string;
      title_en: string;
      price: number;
    };
    quantity: number;
    size: number | null;
    sugar: number | null;
    ice: number | null;
    price: number;
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

type OrderDetailType = {
  productPrice: number;
  discountCode: string | null;
  discountPrice: number;
  tax: number;
  total: number;
  orderItems: {
    title: string;
    quantity: number;
    size: string | null;
    sugar: string | null;
    ice: string | null;
    price: number;
  }[];
};

const OrderTable = ({
  tableData,
  onStatusUpdated,
  onStatusCanceled,
}: {
  tableData: OrderTableType[];
  onStatusUpdated: (orderId: number, status: number) => void;
  onStatusCanceled: (orderId: number, status: number) => void;
}) => {
  const [sourceSorting, setSourceSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [modalToggle, setModalToggle] = useState<{
    status: boolean;
    id: number | null;
  }>({
    status: false,
    id: null,
  });
  const [orderDetail, setOrderDetail] = useState<OrderDetailType | null>(null);

  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("orderers", {
      id: "orderers",
      header: () => <span className="">訂購人資訊</span>,
      cell: (info) => {
        return (
          <ul className="flex flex-col gap-0.5">
            <li className="">- 姓名: {info.row.original.User.name}</li>
            <li className="">
              - 電話:{" "}
              <span>
                <a href={`tel:${info.row.original.User.phone}`} className="">
                  {info.row.original.User.phone}
                </a>
              </span>
            </li>
            <li className="">
              - Email:{" "}
              <span>
                <a href={`mailto:${info.row.original.User.email}`} className="">
                  {info.row.original.User.email}
                </a>
              </span>
            </li>
          </ul>
        );
      },
    }),
    columnHelper.accessor("recipient", {
      id: "recipient",
      header: () => <span className="">收貨人資訊</span>,
      cell: (info) => {
        return (
          <ul className="flex flex-col gap-0.5">
            <li className="">- 姓名: {info.row.original.recipientName}</li>
            <li className="">
              - 電話:{" "}
              <span>
                <a
                  href={`tel:${info.row.original.recipientPhone}`}
                  className=""
                >
                  {info.row.original.recipientPhone}
                </a>
              </span>
            </li>
            <li className="">- 地址: {info.row.original.recipientAddress}</li>
          </ul>
        );
      },
    }),
    columnHelper.accessor("shipping", {
      id: "shipping",
      header: () => <span className="">運送方式</span>,
      cell: (info) => <span>{shippingOpts[info.getValue()]}</span>,
    }),
    columnHelper.accessor("payment", {
      id: "payment",
      header: () => <span className="">付款方式</span>,
      cell: (info) => <span>{paymentOpts[info.getValue()]}</span>,
    }),
    columnHelper.accessor("total", {
      id: "total",
      header: () => <span className="">總金額</span>,
      cell: (info) => (
        <div className="flex flex-col gap-1 items-center">
          <p>NT${info.getValue().toLocaleString()}</p>
          <div className="md:hidden">
            {shippingOpts[info.row.original.shipping]},{" "}
            {paymentOpts[info.row.original.payment]}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: () => (
        <div className="">
          <span className="hidden md:inline-block">訂單</span>狀態
        </div>
      ),
      cell: (info) => {
        return (
          <div className="flex flex-col gap-1 justify-center">
            <p className="text-center">{orderStatus[info.getValue()]}</p>
            <div className="flex flex-col gap-0.5">
              {info.getValue() < 3 && (
                <button
                  onClick={() =>
                    onStatusUpdated(info.row.original.id, info.getValue())
                  }
                  className="bg-apricot text-white px-2 py-0.5 rounded-md"
                >
                  更新狀態
                </button>
              )}
              {info.getValue() >= 1 ||
                (info.getValue() !== 4 && (
                  <button
                    onClick={() =>
                      onStatusCanceled(info.row.original.id, info.getValue())
                    }
                    className="bg-moss text-white px-2 py-0.5 rounded-md"
                  >
                    取消訂單
                  </button>
                ))}
            </div>
            <p className="text-[10px] text-fern-60">
              最後更新時間:{" "}
              {dayjs(info.row.original.updatedAt).format("YYYY-MM-DD HH:ss")}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("detail", {
      id: "detail",
      header: () => <span className="">細項</span>,
      cell: (info) => (
        <button
          onClick={() => handleOrderDetail(info.row.original.id)}
          className={
            modalToggle.status && modalToggle.id === info.row.original.id
              ? "rotate-180 transition-all"
              : ""
          }
        >
          <IoIosArrowDown />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: tableData,
    columns: columns,
    state: {
      sorting: sourceSorting,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSourceSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    debugTable: true,
  });

  const handleOrderDetail = (orderId: number) => {
    if (modalToggle.status) {
      setModalToggle((prev) => ({ ...prev, status: false, id: null }));
      setOrderDetail(null);
      return;
    }
    const order = tableData.find((order) => order.id === orderId);
    if (order) {
      setModalToggle((prev) => ({ ...prev, status: true, id: orderId }));
      const { OrderItems, Discount, productPrice, discountPrice, tax, total } =
        order;

      const orderItems = OrderItems.map((item) => {
        return {
          title: item.Product.title,
          quantity: item.quantity,
          size:
            item.size !== null
              ? `${sizeOpts[item.size].title} (+NT$${
                  sizeOpts[item.size].price
                })`
              : null,
          sugar: item.sugar !== null ? sugarOpts[item.sugar] : null,
          ice: item.ice !== null ? iceOpts[item.ice] : null,
          price: item.price,
        };
      });

      const body = {
        orderItems,
        productPrice,
        discountPrice,
        discountCode: Discount ? Discount?.Coupon.code : null,
        tax,
        total,
      };

      setOrderDetail(body);
    }
  };

  return (
    <>
      <table className="">
        <thead className="bg-fern text-ivory h-12">
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr
                key={headerGroup.id}
                className={`grid grid-cols-8 md:grid-cols-10 h-12 leading-12`}
              >
                {headerGroup.headers.map((header, index) => {
                  return (
                    <th
                      key={header.id}
                      className={`h-12 justify-center items-center cursor-pointer ${
                        (index === 0 || index === 1 || index === 5) &&
                        "col-span-2"
                      } ${
                        index === 2 || index === 3 ? "hidden md:flex" : "flex"
                      }
                      `}
                      {...{
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody className="text-xs md:text-md">
          {table.getRowModel().rows.map((row, index) => {
            const orderId = row.original.id;
            return (
              <>
                <tr
                  className={`py-2 grid gap-1 grid-cols-8 md:grid-cols-10 ${
                    index !== 0 && "border-t-[0.5px] border-fern-30"
                  } ${
                    modalToggle.status && modalToggle.id === orderId
                      ? "bg-ivory"
                      : "bg-white"
                  }`}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell, index) => {
                    return (
                      <td
                        className={`items-center ${
                          index === 0 || index === 1
                            ? "col-span-2"
                            : "justify-center"
                        } ${index === 5 && "col-span-2"} ${
                          index === 2 || index === 3 ? "hidden md:flex" : "flex"
                        }`}
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
                {modalToggle.status && modalToggle.id === orderId && (
                  <div className="bg-white p-2 md:px-4 text-xs md:text-sm flex flex-col gap-2">
                    <div className="flex flex-col gap-0.5">
                      {orderDetail?.orderItems.map(
                        (
                          { title, quantity, size, sugar, ice, price },
                          index
                        ) => {
                          return (
                            <div
                              className="grid grid-cols-[1fr_1.5fr_0.5fr]"
                              key={`order-detail-${index}`}
                            >
                              <div>
                                {title} *{quantity}
                              </div>
                              <div>
                                {size !== null &&
                                  sugar !== null &&
                                  ice !== null &&
                                  `${size}, ${sugar}, ${ice}`}
                              </div>
                              <div className="">
                                NT${price.toLocaleString()}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                    <div className="flex justify-between items-center gap-1 bg-natural text-white py-1 px-2 text-xs">
                      <div>
                        商品價格: <br className="md:hidden" /> NT$
                        {orderDetail?.productPrice}
                      </div>
                      <div>
                        稅: <br className="md:hidden" />
                        NT${orderDetail?.tax}
                      </div>
                      <div>
                        折扣: <br className="md:hidden" />
                        -NT${orderDetail?.discountPrice}
                        <br className="md:hidden" />
                        {orderDetail?.discountCode &&
                          `(${orderDetail?.discountCode})`}
                      </div>
                      <div>
                        總計: <br className="md:hidden" />
                        NT${orderDetail?.total}
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })}
        </tbody>
      </table>
      <div className="w-full flex justify-center md:justify-end">
        <div className="flex items-center gap-1">
          <button
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            className="disabled:text-default-gray"
            title="往 第一頁"
          >
            <MdOutlineKeyboardDoubleArrowLeft />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="disabled:text-default-gray"
            title="上一頁"
          >
            <MdOutlineKeyboardArrowLeft />
          </button>
          <div className="font-bold text-apricot border border-fern rounded-sm px-4 py-0.5">
            {table.getState().pagination.pageIndex + 1}
          </div>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="disabled:text-default-gray"
            title="下一頁"
          >
            <MdOutlineKeyboardArrowRight />
          </button>
          <button
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            className="disabled:text-default-gray"
            title="往 最末頁"
          >
            <MdOutlineKeyboardDoubleArrowRight />
          </button>
        </div>
      </div>
      {/* {modalToggle && (
        <StaffModals
          title="訂單詳細資料"
          onClose={() => {
            setModalToggle(false);
            setOrderDetail(null);
          }}
        >
          <div className="h-full max-h-[500px] px-4 overflow-y-auto overflow-x-hidden modal flex flex-col gap-1">
            <div className="flex flex-col gap-2 px-4 md:hidden">
              <h5 className="font-medium text-lg ml-4 bg-white relative z-[999] w-fit px-4">
                訂購人資料
              </h5>

              <ul className="flex flex-col gap-1 list-disc pl-12 border border-fern rounded-lg p-4 -mt-4">
                <div className="">
                  <h5 className="font-bold">{orderDetail?.orderer?.name}</h5>
                  <div className="flex flex-col gap-0.5">
                    <div className="text-fern-60 text-sm flex items-center gap-2">
                      <p>連絡電話:</p>
                      <a
                        href={`tel:${orderDetail?.orderer?.phone}`}
                        className="hover:text-fern hover:underline hover:underline-offset-2"
                      >
                        {orderDetail?.orderer?.phone}
                      </a>
                    </div>
                    <div className="text-fern-60 text-sm flex items-center gap-2">
                      <p>電子郵件:</p>
                      <a
                        href={`mailto:${orderDetail?.orderer?.email}`}
                        className="hover:text-fern hover:underline hover:underline-offset-2"
                      >
                        {orderDetail?.orderer?.email}
                      </a>
                    </div>
                  </div>
                </div>
              </ul>
            </div>
            <div className="flex flex-col gap-2 px-4">
              <h5 className="font-medium text-lg ml-4 bg-white relative z-[999] w-fit px-4">
                訂單資料
              </h5>
              <ul className="flex flex-col gap-1 pl-12 border border-fern rounded-lg p-4 -mt-4">
                {orderDetail?.orderItems.map((item, index) => {
                  return (
                    <li className="" key={`orderitem-${index}`}>
                      <div className="flex items-center gap-2">
                        <BiSolidDisc />
                        <h5 className="font-bold">
                          {item.name} x{item.quantity}
                        </h5>
                      </div>
                      {item.size && (
                        <p className="text-fern-60 text-sm pl-4">
                          - {item.size}, {item.sugar}, {item.ice}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex flex-col gap-2 px-4">
              <h5 className="font-medium text-lg ml-4 bg-white relative z-[999] w-fit px-4">
                付款方式
              </h5>
              <p className="pl-8 border border-fern rounded-lg p-4 -mt-4">
                {orderDetail?.payment}
              </p>
            </div>
            <div className="flex flex-col gap-2 px-4">
              <h5 className="font-medium text-lg ml-4 bg-white relative z-[999] w-fit px-4">
                運送方式
              </h5>
              <p className="pl-8 border border-fern rounded-lg p-4 -mt-4">
                {orderDetail?.shipping}
              </p>
            </div>
            <div className="flex flex-col gap-2 px-4">
              <h5 className="font-medium text-lg ml-4 bg-white relative z-[999] w-fit px-4">
                折價券
              </h5>
              {orderDetail?.discount ? (
                <p className="pl-8 border border-fern rounded-lg p-4 -mt-4">
                  {orderDetail?.discount?.title} / {orderDetail?.discount?.code}
                </p>
              ) : (
                <p className="pl-8 border border-fern rounded-lg p-4 -mt-4 text-fern-60">
                  未使用優惠券
                </p>
              )}
            </div>
          </div>
        </StaffModals>
      )} */}
    </>
  );
};

export default OrderTable;
