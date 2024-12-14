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
import { CiCircleMore } from "react-icons/ci";
import { BiSolidDisc } from "react-icons/bi";
import StaffModals from "../layout/StaffModals";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

type OrderTableType = {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  orderer: {
    name: string;
    phone: string;
    email: string;
  };
  recipient: {
    name: string;
    phone: string;
    address: string;
  };
  payment: string;
  shipping: string;
  shippingId: number;
  discount: {
    title: string;
    code: string;
  } | null;
  orderItems: {
    name: string;
    quantity: number;
    price: number;
    size: string | null;
    sugar: string | null;
    ice: string | null;
  }[];
};

const ORDERTABLEMAP = [
  // ["id", "ID"],
  ["orderer", "訂購人資料"], // 2 //m //t
  ["recipient", "收貨人資料"], // 2 //m //t
  ["orderItems", "訂單資料"], // 2
  ["payment", "付款方式"], // 1 //t
  ["shipping", "運送方式"], // 1 //t
  ["discount", "折價券"], // 1
  ["totalPrice", "總金額"], // 1 //m //t
  ["status", "訂單狀態"], // 1 //m //t
];

const OrderTable = ({
  tableData,
  onStatusUpdated,
  onStatusCanceled,
}: {
  tableData: OrderTableType[];
  onStatusUpdated: (
    orderId: number,
    shippingId: number,
    status: string
  ) => void;
  onStatusCanceled: (orderId: number, status: string) => void;
}) => {
  // console.log(tableData);
  const [sourceSorting, setSourceSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [modalToggle, setModalToggle] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderTableType | null>(null);

  const columnHelper = createColumnHelper<any>();
  const columns = ORDERTABLEMAP.map((tHead: string[]) => {
    if (tHead[0] === "orderer") {
      return columnHelper.accessor(tHead[0], {
        id: tHead[0],
        header: () => <span>{tHead[1]}</span>,
        cell: (info) => (
          <ul className="flex flex-col gap-0.5 px-2">
            <li className="font-bold">{info.getValue()["name"]}</li>
            <li className="pl-0.5 text-xs">- {info.getValue()["phone"]}</li>
            <li className="pl-0.5 text-xs">- {info.getValue()["email"]}</li>
          </ul>
        ),
      });
    } else if (tHead[0] === "recipient") {
      return columnHelper.accessor(tHead[0], {
        id: tHead[0],
        header: () => <span>{tHead[1]}</span>,
        cell: (info) => (
          <ul className="flex flex-col gap-0.5 px-2">
            <li className="font-bold">{info.getValue()["name"]}</li>
            <li className="pl-0.5 text-xs">- {info.getValue()["phone"]}</li>
            <li className="pl-0.5 text-xs">- {info.getValue()["address"]}</li>
          </ul>
        ),
      });
    } else if (tHead[0] === "orderItems") {
      return columnHelper.accessor(tHead[0], {
        id: tHead[0],
        header: () => <span>{tHead[1]}</span>,
        cell: (info) => (
          <ul className="flex flex-col gap-1] text-sm">
            {info.getValue().map((item: any, index: number) => {
              return (
                <li className="" key={`orderitem-${index}`}>
                  <div className="flex items-center gap-2">
                    <BiSolidDisc />
                    <h5 className="font-bold">
                      {item.name} x{item.quantity}
                    </h5>
                  </div>
                  {item.size && (
                    <p className="text-fern-60 text-xs pl-4">
                      - {item.size}, {item.sugar}, {item.ice}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        ),
      });
    } else if (tHead[0] === "status") {
      return columnHelper.accessor(tHead[0], {
        id: tHead[0],
        header: () => <span>{tHead[1]}</span>,
        cell: (info) => (
          <div className="flex flex-col gap-1 items-center">
            <h5 className="font-bold">{info.getValue().toUpperCase()}</h5>
            <div
              className={`flex flex-col gap-0.5 ${
                (info.getValue() === "completed" ||
                  info.getValue() === "canceled") &&
                "hidden"
              }`}
            >
              <button
                onClick={() =>
                  onStatusUpdated(
                    info.row.original.id,
                    info.row.original.shippingId,
                    info.getValue()
                  )
                }
                className="px-4 lg:px-2.5 bg-apricot text-white rounded-lg hover:drop-shadow-lg py-0.5"
              >
                更新狀態
              </button>
              <button
                onClick={() =>
                  onStatusCanceled(
                    info.row.original.id,
                    // info.row.original.shippingId
                    info.getValue()
                  )
                }
                className="px-4 lg:px-2.5 bg-fern-60 text-white rounded-lg hover:drop-shadow-lg py-0.5"
              >
                取消訂單
              </button>
            </div>
          </div>
        ),
      });
    } else if (tHead[0] === "totalPrice") {
      return columnHelper.accessor(tHead[0], {
        id: tHead[0],
        header: () => <span>{tHead[1]}</span>,
        cell: (info) => (
          <div className="flex items-center gap-2">
            <div>{info.getValue()}</div>
            <button
              className="text-fern-60 hover:text-fern xl:hidden"
              onClick={() => handleOrderDetail(info.row.original.id)}
            >
              <CiCircleMore />
            </button>
          </div>
        ),
      });
    } else if (tHead[0] === "discount") {
      return columnHelper.accessor(tHead[0], {
        id: tHead[0],
        header: () => <span>{tHead[1]}</span>,
        cell: (info) => (
          <div className="flex flex-col justify-center items-center gap-2">
            {info.getValue() ? (
              <>
                <div>{info.getValue()["title"]}</div>
                <div>{info.getValue()["code"]}</div>
              </>
            ) : (
              <div className="text-fern-60 text-sm">未使用折價券</div>
            )}
          </div>
        ),
      });
    } else {
      return columnHelper.accessor(tHead[0], {
        id: tHead[0],
        header: () => <span>{tHead[1]}</span>,
        cell: (info) => <span>{info.getValue()}</span>,
      });
    }
  });

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

  const handleOrderDetail = (id: number) => {
    console.log(id);
    const order = tableData.find((data) => data.id === id);
    // console.log(order);
    if (order) {
      setModalToggle(true);
      setOrderDetail(order);
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
                className={`grid gap-1 grid-cols-4 md:grid-cols-6 xl:grid-cols-11 h-12 leading-12`}
              >
                {headerGroup.headers.map((header, index) => {
                  return (
                    <th
                      key={header.id}
                      className={`h-12 justify-center items-center cursor-pointer ${
                        (index === 0 || index === 1 || index === 2) &&
                        "col-span-2"
                      } 

                      ${
                        index === 0
                          ? "hidden md:flex"
                          : index === 1 || index === 6 || index === 7
                          ? "flex"
                          : "hidden xl:flex"
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
        <tbody className="">
          {table.getRowModel().rows.map((row, index) => {
            return (
              <tr
                className={`py-2 grid gap-1 grid-cols-4 md:grid-cols-6 xl:grid-cols-11 ${
                  index !== 0 && "border-t-[0.5px] border-fern-30"
                }`}
                key={row.id}
              >
                {row.getVisibleCells().map((cell, index) => {
                  return (
                    <td
                      className={`${
                        index === 0 || index === 1 || index === 2
                          ? "col-span-2"
                          : "justify-center"
                      } ${
                        index === 0
                          ? "hidden md:flex"
                          : index === 1 || index === 6 || index === 7
                          ? "flex"
                          : "hidden xl:flex"
                      } items-center px-2`}
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
      {modalToggle && (
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
      )}
    </>
  );
};

export default OrderTable;
