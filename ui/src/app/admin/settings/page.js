"use client";
import { useEffect, useState } from "react";
import api from "../../../../lib/api";
import useProtectedPage from "../../../../hooks/useProtectedPage";
// import useProtectedPage from "../../../hooks/useProtectedPage";

export default function LocationsManager() {
  useProtectedPage("admin");

  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState("");
  const [addingCat, setAddingCat] = useState(false);

  const fetchLocations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/inquiry/locations");
      setLocations(res.data.locations || []);
    } catch (err) {
      setError("Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCatLoading(true);
    setCatError("");
    try {
      const res = await api.get("/inquiry/categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      setCatError("Failed to fetch categories");
    } finally {
      setCatLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newLocation.trim()) return;
    setAdding(true);
    setError("");
    try {
      await api.post("/admin/locations/locations", { name: newLocation });
      setNewLocation("");
      fetchLocations();
    } catch (err) {
      setError("Failed to add location", err);
    } finally {
      setAdding(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setAddingCat(true);
    setCatError("");
    try {
      await api.post("/admin/categories/categories", { name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      setCatError("Failed to add category");
    } finally {
      setAddingCat(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Manage Locations</h2>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          className="border px-3 py-2 rounded flex-1"
          placeholder="Add new location"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          disabled={adding}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={adding}
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="list-disc pl-6">
          {locations.map((loc) => (
            <li key={loc._id} className="mb-1">
              {loc.name}
            </li>
          ))}
        </ul>
      )}

      {/* Category management section */}
      <h2 className="text-xl font-bold mb-4 mt-8">Manage Categories</h2>
      <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
        <input
          type="text"
          className="border px-3 py-2 rounded flex-1"
          placeholder="Add new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          disabled={addingCat}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={addingCat}
        >
          {addingCat ? "Adding..." : "Add"}
        </button>
      </form>
      {catError && <div className="text-red-600 mb-2">{catError}</div>}
      {catLoading ? (
        <div>Loading...</div>
      ) : (
        <ul className="list-disc pl-6">
          {categories.map((cat) => (
            <li key={cat._id} className="mb-1">
              {cat.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
