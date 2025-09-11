"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownToLine } from "lucide-react";

// Example data

export function DataTableDemo({ data }: any) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  // 🔹 Function to auto-generate columns from data keys
  function generateColumns<T extends object>(data: T[]): ColumnDef<T>[] {
    if (!data.length) return [];

    return Object.keys(data[0]).map((key) => {
      return {
        accessorKey: key,
        header: ({ column }) => (
          <div>{key.charAt(0).toUpperCase() + key.slice(1)}</div>
        ),
        cell: ({ row }: any) => {
          const value = row.getValue(key);
          if (key === "amount") {
            const formatted = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(value);
            return <div className="text-left font-medium">{formatted}</div>;
          }
          return <div>{String(value)}</div>;
        },
      } as ColumnDef<T>;
    });
  }

  function DownloadCSV() {
    const downloadCSV = () => {
      // convert array to CSV string
      const headers = Object.keys(data[0]).join(","); // sno,email,name,urn,branch
      const rows = data.map((row: any) =>
        Object.values(row)
          .map((value) => `"${String(value).replace(/"/g, '""')}"`) // handle commas & quotes
          .join(",")
      );
      const csvContent = [headers, ...rows].join("\n");

      // create blob
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      // create a download link
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "students.csv");
      link.click();
    };

    return (
      <Button
        onClick={downloadCSV}
        variant={"default"}
        className="w-fit h-fit px-3 py-1"
      >
        Download CSV
        <ArrowDownToLine />
      </Button>
    );
  }

  const columns = React.useMemo(() => {
    const baseColumns = generateColumns(data);

    // Add "actions" column at the end
    return [
      {
        id: "actions",
        accessorKey: "SNo.",
        header: () => <div className="ml-2">SNo.</div>,
        cell: ({ row }) => {
          const item = row.index + 1;
          return <div className="ml-2">{String(item)}</div>;
        },
      },
      ...baseColumns,
    ];
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination: { pageIndex: 0, pageSize: data.length }, // 👈 all rows in one page
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  return (
    <div className="w-full">
      {/* 🔎 Search across all columns */}
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Search all columns..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <DownloadCSV />
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
