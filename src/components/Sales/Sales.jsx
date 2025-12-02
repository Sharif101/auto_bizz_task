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
import LoadingSkeleton from "../Resources/LoadingSkeleton";

export default function Sales() {
  const [salesData, setSalesData] = useState([]);
  const [token, setToken] = useState(null);
  const [pagination, setPagination] = useState({ before: "", after: "" });

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    priceMin: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const getAuthToken = async () => {
    try {
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
    } catch (error) {
      console.log("Error getting token:", error);
    }
  };

  const fetchSales = async (overrideFilters = filters) => {
    if (!token) return;

    try {
      setLoading(true);

      const query = new URLSearchParams({
        startDate: overrideFilters.startDate,
        endDate: overrideFilters.endDate,
        priceMin: overrideFilters.priceMin,
        email: overrideFilters.email,
        phone: overrideFilters.phone,
        sortBy: "date",
        sortOrder: "asc",
      }).toString();

      const url = `https://autobizz-425913.uc.r.appspot.com/sales?${query}`;

      const res = await fetch(url, {
        headers: { "X-AUTOBIZZ-TOKEN": token },
      });

      const data = await res.json();
      console.log({ data });
      setSalesData(data.results?.Sales || []);
      setPagination(data.pagination || { before: "", after: "" });
    } catch (error) {
      console.log("Error loading sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAuthToken();
  }, []);

  useEffect(() => {
    if (token) fetchSales();
  }, [token]);

  useEffect(() => {
    if (token) fetchSales();
  }, [
    token,
    filters.startDate,
    filters.endDate,
    filters.priceMin,
    filters.email,
    filters.phone,
  ]);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Sales Overview</h2>

      <SearchFilter
        filters={filters}
        setFilters={setFilters}
        onSearch={(newFilters) => setFilters(newFilters)}
        loading={loading}
      />

      <div className="border rounded-lg bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-white">
              <TableHead>Sl.</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <LoadingSkeleton rows={20} cols={5} />
            ) : salesData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-gray-500"
                >
                  No sales found
                </TableCell>
              </TableRow>
            ) : (
              salesData.map((sale, index) => (
                <TableRow key={sale._id}>
                  <TableCell>{index + 1}</TableCell>
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
    </div>
  );
}
