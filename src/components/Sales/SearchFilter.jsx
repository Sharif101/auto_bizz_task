import React from "react";
import { Input } from "../ui/input";

export default function SearchFilter({ filters, setFilters, onSearch }) {
  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);

    // Auto search whenever input changes
    onSearch(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Filter Sales</h3>

      {/* ONE LINE FULL WIDTH */}
      <div className="flex items-end gap-4 w-full">
        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium">Phone</label>
          <Input
            type="text"
            name="phone"
            placeholder="01XXXXXXXXX"
            value={filters.phone}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            name="email"
            placeholder="example@mail.com"
            value={filters.email}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium">Min Price</label>
          <Input
            type="number"
            name="priceMin" // API KEY FIXED
            placeholder="Min price"
            value={filters.priceMin}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium">Start Date</label>
          <Input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium">End Date</label>
          <Input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
