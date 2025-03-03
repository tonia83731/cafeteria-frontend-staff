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
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import Image from "next/image";

type ProductTableType = {
  id: number;
  categoryCode: string;
  title: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
  price: number;
};

const ProductTable = ({
  tableData,
  language,
  onProductEdit,
  onProductDelete,
  onProductPublished,
}: {
  tableData: ProductTableType[];
  language: "zh" | "en";
  onProductEdit: (id: number) => void;
  onProductDelete: (id: number) => void;
  onProductPublished: (id: number, isPublished: boolean) => void;
}) => {
  const [sourceSorting, setSourceSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });

  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("image", {
      id: "image",
      header: () => <span className="">產品圖片</span>,
      cell: (info) => {
        const src = info.getValue();
        return (
          <Image
            src={src as string}
            alt="product-image"
            width={300}
            height={300}
            className="w-[60px] h-[60px] object-cover"
          ></Image>
        );
      },
    }),
    columnHelper.accessor("categoryCode", {
      id: "categoryCode",
      header: () => <span>產品類別</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("title", {
      id: "title",
      header: () => <span>產品名稱</span>,
      cell: (info) => {
        const title = info.getValue();
        return <span>{title[language]}</span>;
      },
    }),
    columnHelper.accessor("description", {
      id: "description",
      header: () => <span className="">產品敘述</span>,
      cell: (info) => {
        const description = info.getValue();
        return <span className="text-xs">{description[language]}</span>;
      },
    }),
    columnHelper.accessor("price", {
      id: "price",
      header: () => <span>產品價格</span>,
      cell: (info) => <span>NT${info.getValue().toLocaleString()}</span>,
    }),
    columnHelper.accessor("note", {
      id: "note",
      header: () => <span>#</span>,
      cell: (info) => {
        return (
          <div className="w-full flex flex-col gap-2 text-white lg:flex-row lg:items-center">
            <button
              className="w-full px-2 py-0.5 rounded-md bg-brown disabled:bg-default-gray"
              // disabled={info.row.original.isPublished}
              onClick={() =>
                onProductPublished(
                  info.row.original.id,
                  info.row.original.isPublished
                )
              }
            >
              {info.row.original.isPublished ? "取消發布" : "發布"}
            </button>
            <button
              className="w-full px-2 py-0.5 rounded-md bg-apricot disabled:bg-default-gray"
              // disabled={info.row.original.isPublished}
              onClick={() => onProductEdit(info.row.original.id)}
            >
              修改
            </button>
            <button
              className="w-full px-2 py-0.5 rounded-md bg-moss disabled:bg-default-gray"
              disabled={info.row.original.isPublished}
              onClick={() => onProductDelete(info.row.original.id)}
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

  return (
    <>
      <table className="">
        <thead className="bg-fern text-ivory h-12 text-xs md:text-sm">
          {table.getHeaderGroups().map((headerGroup) => {
            // console.log(headerGroup.headers.length);
            return (
              <tr
                key={headerGroup.id}
                className={`grid grid-cols-4 md:grid-cols-7 h-12 leading-12`}
              >
                {headerGroup.headers.map((header, index) => {
                  const handleClick =
                    index === 0 || index === 1 || index === 3
                      ? header.column.getToggleSortingHandler()
                      : undefined;
                  return (
                    <th
                      key={header.id}
                      className={`h-12 justify-center items-center ${
                        index === 3 && "md:col-span-2"
                      } ${
                        index === 0 || index === 3 ? "hidden md:flex" : "flex"
                      }`}
                      onClick={handleClick}
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
        <tbody className="h-24 text-xs md:text-sm">
          {table.getRowModel().rows.map((row, index) => {
            return (
              <tr
                className={`h-24 grid grid-cols-4 md:grid-cols-7 ${
                  index !== 0 && "border-t-[0.5px] border-fern-30"
                }`}
                key={row.id}
              >
                {row.getVisibleCells().map((cell, index) => {
                  return (
                    <td
                      className={`h-24 items-center ${
                        index === 3 ? "md:col-span-2" : "justify-center"
                      } ${
                        index === 0 || index === 3 ? "hidden md:flex" : "flex"
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

export default ProductTable;
