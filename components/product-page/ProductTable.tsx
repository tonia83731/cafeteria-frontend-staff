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

const PRODUCTTABLEMAP = [
  // ["id", "ID"],
  ["categoryCode", "類別"],
  ["title", "產品名稱"],
  ["description", "產品介紹"],
  ["price", "價格"],
  ["note", "其他"],
];

const ProductTable = ({
  tableData,
  language,
  onProductEdit,
  onProductDelete,
}: {
  tableData: ProductTableType[];
  language: "zh" | "en";
  onProductEdit: (id: number) => void;
  onProductDelete: (id: number) => void;
}) => {
  const [sourceSorting, setSourceSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });

  const columnHelper = createColumnHelper<any>();
  const columns = PRODUCTTABLEMAP.map((tHead: string[]) => {
    if (tHead[0] === "title" || tHead[0] === "description") {
      return columnHelper.accessor(tHead[0], {
        id: tHead[0],
        header: () => <span>{tHead[1]}</span>,
        cell: (info) => <span>{info.getValue()[language]}</span>,
      });
    } else if (tHead[0] === "note") {
      return columnHelper.accessor(tHead[0], {
        id: "note",
        header: () => <span>#</span>,
        cell: (info) => (
          <div className="w-full flex flex-col gap-1 xl:flex-row xl:items-center xl:justify-center xl:gap-2">
            <button
              onClick={() => onProductEdit(info.row.original.id)}
              className="lg:px-4 bg-apricot text-white rounded-lg hover:drop-shadow-lg py-0.5"
            >
              修改
            </button>
            <button
              onClick={() => onProductDelete(info.row.original.id)}
              className="lg:px-4 bg-fern-60 text-white rounded-lg hover:drop-shadow-lg py-0.5"
            >
              刪除
            </button>
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

  return (
    <>
      <table className="">
        <thead className="bg-fern text-ivory h-12">
          {table.getHeaderGroups().map((headerGroup) => {
            // console.log(headerGroup.headers.length);
            return (
              <tr
                key={headerGroup.id}
                className={`grid grid-cols-3 md:grid-cols-7 h-12 leading-12`}
              >
                {headerGroup.headers.map((header, index) => {
                  const handleClick =
                    index === 0 || index === 1 || index === 3
                      ? header.column.getToggleSortingHandler()
                      : undefined;
                  return (
                    <th
                      key={header.id}
                      className={`h-12 flex justify-center items-center ${
                        (index === 0 || index === 1 || index === 3) &&
                        "cursor-pointer"
                      } ${(index === 0 || index === 2) && "hidden md:flex"} ${
                        (index === 1 || index === 2) && "md:col-span-2"
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
        <tbody className="h-20">
          {table.getRowModel().rows.map((row, index) => {
            return (
              <tr
                className={`h-20 grid grid-cols-3 md:grid-cols-7 ${
                  index !== 0 && "border-t-[0.5px] border-fern-30"
                }`}
                key={row.id}
              >
                {row.getVisibleCells().map((cell, index) => {
                  return (
                    <td
                      className={`h-20 ${
                        index === 0 || index === 2
                          ? "hidden md:flex md:items-center"
                          : "flex items-center"
                      } ${(index === 1 || index === 2) && "md:col-span-2"}  ${
                        index !== 2 && "justify-center"
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
