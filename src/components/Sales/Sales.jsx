import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SearchFilter from "./SearchFilter";
import Pagination from "../Resources/Pagination";
import { ChevronUp, ChevronDown } from "lucide-react";
import SalesGraph from "../Resources/SalesGraph";

export default function Sales() {
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState([]);
  const [token, setToken] = useState(null);
  const [pagination, setPagination] = useState({ before: "", after: "" });
  const [pageIndex, setPageIndex] = useState(0);
  const [totalSalesCount, setTotalSalesCount] = useState(0);

  const limit = 50;
  const totalPages = Math.ceil(totalSalesCount / limit);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    priceMin: "",
    email: "",
    phone: "",
  });

  const [sort, setSort] = useState({
    column: "date",
    order: "asc",
  });

  const getAuthToken = async () => {
    const res = await fetch(
      "https://autobizz-425913.uc.r.appspot.com/getAuthorize",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenType: "frontEndTest" }),
      }
    );
    const data = await res.json();
    setToken(data.token);
  };

  const fetchSales = async (cursor = {}, overrideFilters = filters) => {
    if (!token) return;

    const query = new URLSearchParams({
      startDate: overrideFilters.startDate,
      endDate: overrideFilters.endDate,
      priceMin: overrideFilters.priceMin,
      email: overrideFilters.email,
      phone: overrideFilters.phone,
      sortBy: sort.column,
      sortOrder: sort.order,
      limit: limit.toString(),
      ...cursor,
    }).toString();

    const url = `https://autobizz-425913.uc.r.appspot.com/sales?${query}`;
    const res = await fetch(url, {
      headers: { "X-AUTOBIZZ-TOKEN": token },
    });
    const data = await res.json();

    setSalesData(data.results?.Sales || []);
    setPagination(data.pagination || { before: "", after: "" });
    setTotalSalesCount(data.results?.TotalSales?.length || 0);
    setTotalSales(data.results?.TotalSales || []);
  };

  useEffect(() => {
    getAuthToken();
  }, []);

  useEffect(() => {
    if (token) fetchSales();
  }, [token, sort]);

  useEffect(() => {
    if (token) {
      setPageIndex(0);
      fetchSales({}, filters);
    }
  }, [
    filters.startDate,
    filters.endDate,
    filters.priceMin,
    filters.email,
    filters.phone,
  ]);

  const handlePageChange = (targetPage) => {
    if (targetPage > pageIndex) {
      fetchSales({ after: pagination.after });
    } else {
      fetchSales({ before: pagination.before });
    }
    setPageIndex(targetPage);
  };

  const handleSort = (column) => {
    setSort((prev) => ({
      column,
      order: prev.column === column && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const graphData = totalSales.slice(
    pageIndex * limit,
    (pageIndex + 1) * limit
  );

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-2">Sales Overview</h2>

      <p className="text-gray-700 mb-4">
        <strong>Total Sales:</strong> {totalSalesCount}
      </p>

      <SearchFilter
        filters={filters}
        setFilters={setFilters}
        onSearch={(newFilters) => setFilters(newFilters)}
      />

      <SalesGraph data={graphData} />

      <div className="border rounded-lg bg-white shadow-sm mt-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-white-100">
              <TableHead className="px-4 py-2 text-left">Sl.</TableHead>
              <TableHead className="px-4 py-2 text-left">Email</TableHead>
              <TableHead className="px-4 py-2 text-left">Phone</TableHead>

              <TableHead
                className="px-4 py-2 cursor-pointer select-none"
                onClick={() => handleSort("price")}
              >
                <span className="inline-flex items-center gap-1">
                  Price
                  {sort.column === "price" ? (
                    sort.order === "asc" ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )
                  ) : (
                    <ChevronUp size={14} className="opacity-50" />
                  )}
                </span>
              </TableHead>

              <TableHead
                className="px-4 py-2 cursor-pointer select-none"
                onClick={() => handleSort("date")}
              >
                <span className="inline-flex items-center gap-1">
                  Date
                  {sort.column === "date" &&
                    (sort.order === "asc" ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    ))}
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {salesData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No sales found
                </TableCell>
              </TableRow>
            ) : (
              salesData.map((sale, index) => (
                <TableRow key={sale._id}>
                  <TableCell>{pageIndex * limit + index + 1}</TableCell>
                  <TableCell>{sale.customerEmail}</TableCell>
                  <TableCell>{sale.customerPhone}</TableCell>
                  <TableCell>৳ {sale.price}</TableCell>
                  <TableCell>
                    {new Date(sale.date).toLocaleDateString("en-GB")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        pageIndex={pageIndex}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
