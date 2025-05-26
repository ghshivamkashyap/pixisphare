"use client";
import { useEffect, useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../lib/api";

export default function LeadsPage() {
  const { user, isAuthenticated } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "partner") return;
    setLoading(true);
    api
      .get("/inquiry/partner/leads")
      .then((res) => {
        console.log("Fetched leads:", res.data);

        setLeads(res.data.inquiries || []);
      })
      .catch(() => setError("Failed to fetch leads."))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "partner") {
    return <div className="text-center py-8 text-red-500">Access denied.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded shadow p-6 mt-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Leads</h1>
      {loading && <div className="text-center text-gray-400">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && leads.length === 0 && !error && (
        <div className="text-center text-gray-400">No leads found.</div>
      )}
      <div className="grid gap-4">
        {leads &&
          leads?.map((lead) => (
            <div key={lead._id} className="border rounded p-4 bg-gray-50">
              <div className="font-semibold text-blue-700 mb-1">
                {lead.category} Inquiry
              </div>
              <div className="text-sm text-gray-700 mb-1">
                Date: {lead.date}
              </div>
              <div className="text-sm text-gray-700 mb-1">
                Budget: ₹{lead.budget}
              </div>
              <div className="text-sm text-gray-700 mb-1">
                City: {lead.city}
              </div>
              {lead.referenceImageUrl && (
                <div className="mb-1">
                  <a
                    href={lead.referenceImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-xs"
                  >
                    Reference Image
                  </a>
                </div>
              )}
              <div className="text-xs text-gray-500">
                Inquiry ID: {lead._id}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
