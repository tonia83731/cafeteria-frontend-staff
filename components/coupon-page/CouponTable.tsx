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
import dayjs from "dayjs";
import { useState } from "react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

type CouponTableType = {
  id: number;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  code: string;
  endDate: number;
  discountType: string;
  discountValue: number;
  isPublished: boolean;
};

const CouponTable = ({
  tableData,
  language,
  onCouponEdit,
  onCouponDelete,
  onCouponPublished,
}: {
  tableData: CouponTableType[];
  language: "zh" | "en";
  onCouponEdit: (id: number) => void;
  onCouponDelete: (id: number) => void;
  onCouponPublished: (id: number, isPublished: boolean) => void;
}) => {
  const [sourceSorting, setSourceSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });

  const columnHelper = createColumnHelper<any>();
  const columns = [
    columnHelper.accessor("title", {
      id: "title",
      header: () => <span>優惠券簡介</span>,
      cell: (info) => (
        <div className="flex flex-col gap-1">
          <div className="font-bold">
            {language === "en" ? info.row.original.title_en : info.getValue()}
          </div>
          <p className="text-[10px]">
            {language === "en"
              ? info.row.original.description_en
              : info.row.original.description}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("code", {
      id: "code",
      header: () => <span>優惠券代碼</span>,
      cell: (info) => (
        <div className="flex flex-col justify-center gap-1">
          <p>{info.getValue()}</p>
          <p className="md:hidden text-xs">
            {dayjs(info.row.original.endDate * 1000).format("YYYY-MM-DD")}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("endDate", {
      id: "endDate",
      header: () => <span>截止日期</span>,
      cell: (info) => (
        <span>{dayjs(info.getValue() * 1000).format("YYYY-MM-DD")}</span>
      ),
    }),
    columnHelper.accessor("discount", {
      id: "discount",
      header: () => <span>折扣</span>,
      cell: (info) => (
        <span>
          {info.row.original.discountType === 0
            ? `${(100 - info.row.original.discountValue) / 10}折`
            : `-${info.row.original.discountValue}元`}
        </span>
      ),
    }),
    columnHelper.accessor("note", {
      id: "note",
      header: () => <span>#</span>,
      cell: (info) => {
        return (
          <div className="w-full flex flex-col gap-2 text-white lg:flex-row lg:items-center">
            {!info.row.original.isPublished && (
              <button
                className="w-full px-2 py-0.5 rounded-md bg-brown disabled:bg-default-gray"
                disabled={info.row.original.isPublished}
                onClick={() =>
                  onCouponPublished(
                    info.row.original.id,
                    info.row.original.isPublished
                  )
                }
              >
                發布
              </button>
            )}
            <button
              className="w-full px-2 py-0.5 rounded-md bg-apricot disabled:bg-default-gray"
              disabled={info.row.original.isPublished}
              onClick={() => onCouponEdit(info.row.original.id)}
            >
              修改
            </button>
            <button
              className="w-full px-2 py-0.5 rounded-md bg-moss disabled:bg-default-gray"
              disabled={info.row.original.isPublished}
              onClick={() => onCouponDelete(info.row.original.id)}
            >
              刪除
            </button>
          </div>
        );
      },
    }),
  ];
  const table = useReactTable({
    data: tableData,
    columns,
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
  return (
    <>
      <table className="">
        <thead className="bg-fern text-ivory h-12 text-xs md:text-sm">
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr
                key={headerGroup.id}
                className={`grid grid-cols-6 h-12 leading-12`}
              >
                {headerGroup.headers.map((header, index) => {
                  return (
                    <th
                      key={header.id}
                      className={`flex justify-center items-center ${
                        index === 0 && "col-span-2"
                      } ${index === 1 && "col-span-2 md:col-span-1"} ${
                        index === 2 && "hidden md:flex"
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
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
        <tbody className="text-xs md:text-sm">
          {table.getRowModel().rows.map((row, index) => {
            return (
              <tr
                className={`grid grid-cols-6 ${
                  index !== 0 && "border-t-[0.5px] border-fern-30"
                } py-1`}
                key={row.id}
              >
                {row.getVisibleCells().map((cell, index) => {
                  return (
                    <td
                      className={`flex items-center ${
                        index === 0 ? "col-span-2 px-2" : "justify-center"
                      } ${index === 1 && "col-span-2 md:col-span-1"} ${
                        index === 2 && "hidden md:flex"
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
    </>
  );
};

export default CouponTable;
