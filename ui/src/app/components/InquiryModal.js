"use client";
import { useState } from "react";
import api from "../../../lib/api";

export default function InquiryModal({ open, onClose, partnerId, onSuccess }) {
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");
  const [city, setCity] = useState("");
  const [referenceImageUrl, setReferenceImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.post(
        "/inquiry/inquiry",
        {
          partnerId,
          category,
          date,
          budget,
          city,
          referenceImageUrl,
        }
      );
      setSuccess("Inquiry sent successfully!");
      if (onSuccess) onSuccess();
      setCategory("");
      setDate("");
      setBudget("");
      setCity("");
      setReferenceImageUrl("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send inquiry."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Send Inquiry</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              className="w-full border px-3 py-2 rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Budget</label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
              min={0}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">City</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Reference Image URL</label>
            <input
              type="url"
              className="w-full border px-3 py-2 rounded"
              value={referenceImageUrl}
              onChange={(e) => setReferenceImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              placeholder="e.g. birthday"
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Inquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}
