"use client";
import { useState } from "react";
import api from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import useProtectedPage from "../../../hooks/useProtectedPage";
// import useProtectedPage from "../../hooks/useProtectedPage";

export default function PartnerOnboardingForm() {
  useProtectedPage("partner");
  const { token } = useAuth();
  const [serviceDetails, setServiceDetails] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [portfolioSamples, setPortfolioSamples] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handlePortfolioChange = (idx, value) => {
    setPortfolioSamples((prev) => {
      const arr = [...prev];
      arr[idx] = value;
      return arr;
    });
  };

  const addPortfolioField = () => {
    setPortfolioSamples((prev) => [...prev, ""]);
  };

  const removePortfolioField = (idx) => {
    setPortfolioSamples((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      // 1. Submit onboarding (without portfolioSamples)
      await api.post(
        "/partner/onboard",
        {
          serviceDetails,
          documentInfo: { aadharNumber },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // 2. Add each portfolio image one by one
      const urls = portfolioSamples.filter((url) => url.trim());
      for (let i = 0; i < urls.length; i++) {
        await api.post(
          "/partner/portfolio",
          { imageUrl: urls[i], description: "", index: i },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setSuccess("Onboarding and portfolio submitted successfully!");
      setServiceDetails("");
      setAadharNumber("");
      setPortfolioSamples([""]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit onboarding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Partner Onboarding</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Service Details</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={serviceDetails}
            onChange={(e) => setServiceDetails(e.target.value)}
            required
            rows={3}
            placeholder="Describe your services, styles, etc."
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Aadhar Number</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={aadharNumber}
            onChange={(e) => setAadharNumber(e.target.value)}
            required
            placeholder="Enter your Aadhar number"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Portfolio Samples (URLs)
          </label>
          {portfolioSamples.map((url, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="url"
                className="w-full border px-3 py-2 rounded"
                value={url}
                onChange={(e) => handlePortfolioChange(idx, e.target.value)}
                placeholder="https://example.com/image.jpg"
                required={idx === 0}
              />
              {portfolioSamples.length > 1 && (
                <button
                  type="button"
                  className="bg-red-500 text-white px-2 rounded"
                  onClick={() => removePortfolioField(idx)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="bg-blue-500 text-white px-3 py-1 rounded mt-1"
            onClick={addPortfolioField}
          >
            Add Another
          </button>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Onboarding"}
        </button>
      </form>
    </div>
  );
}
