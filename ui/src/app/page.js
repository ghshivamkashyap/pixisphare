"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PhotographerCard from "./components/PhotographerCard";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Accept filter params (could be from context, state, or hardcoded for now)
  const [filters, setFilters] = useState({
    city: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    search: "",
    sortBy: "",
  });

  // Move fetch logic to a function for clarity
  const fetchPhotographers = () => {
    setLoading(true);
    const params = {};
    if (filters.city) params.city = filters.city;
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.rating) params.rating = filters.rating;
    if (filters.search) params.search = filters.search;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    api
      .get("/partner/partners", { params })
      .then((res) => {
        setPhotographers(res.data.partners || []);
      })
      .catch((err) => {
        setError(err.message || "Failed to load");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPhotographers();
  }, [filters]);

  return (
    <section className="flex gap-8">
      {/* Sidebar Filter */}
      <aside className="w-64 bg-white rounded shadow p-4 h-fit self-start">
        <h3 className="text-lg font-semibold mb-4">Filter</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setFilters({
              ...filters,
              // values are already in state, so just trigger useEffect
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={filters.category}
              onChange={(e) =>
                setFilters((f) => ({ ...f, category: e.target.value }))
              }
              placeholder="e.g. Wedding"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">City</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={filters.city}
              onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
              placeholder="e.g. Mumbai"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Min Price</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded"
                value={filters.minPrice}
                onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
                min={0}
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Max Price</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded"
                value={filters.maxPrice}
                onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
                min={0}
                placeholder="10000"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Min Rating</label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded"
              value={filters.rating}
              onChange={(e) => setFilters((f) => ({ ...f, rating: e.target.value }))}
              min={0}
              max={5}
              step={0.1}
              placeholder="e.g. 4.0"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Filter
          </button>
        </form>
      </aside>
      {/* Main content */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <input
            type="text"
            placeholder="Search by name or style"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="w-full md:w-1/2 p-2 border rounded"
          />
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))}
            className="ml-0 md:ml-2 p-2 border rounded"
          >
            <option value="">Sort By</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center">
          Explore Photographers
        </h1>
        {loading && <div className="text-center text-gray-400">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photographers.map((photographer) => (
            <PhotographerCard
              key={photographer._id}
              photographer={photographer}
            />
          ))}
        </div>
        {!loading && photographers.length === 0 && !error && (
          <div className="text-center text-gray-400 mt-8">
            No photographers found.
          </div>
        )}
      </div>
    </section>
  );
}
