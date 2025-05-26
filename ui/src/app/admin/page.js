"use client";
import { useEffect, useState } from "react";
import api from "../../../lib/api";
// import api from "../../../lib/api";

export default function AdminDashboard() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState({});
  const [actionLoading, setActionLoading] = useState({});

  const fetchPendingPartners = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/verifications");
      setPartners(res.data.users || []);
    } catch (err) {
      setError("Failed to fetch partners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPartners();
  }, []);

  const handleAction = async (id, status) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await api.put(`/admin/verify/${id}`, {
        status,
        comment: comments[id] || "",
      });
      fetchPendingPartners();
    } catch (err) {
      alert("Action failed");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard: Pending Partner Verifications</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : partners.length === 0 ? (
        <div className="text-gray-500">No pending partners.</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Admin Comment</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p._id}>
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">{p.email}</td>
                <td className="p-2 border">₹{p.price !== undefined ? p.price : "N/A"}</td>
                <td className="p-2 border">{new Date(p.createdAt).toLocaleString()}</td>
                <td className="p-2 border">{p.verificationStatus}</td>
                <td className="p-2 border">
                  <input
                    type="text"
                    className="border px-2 py-1 rounded w-32"
                    value={comments[p._id] || ""}
                    onChange={(e) =>
                      setComments((prev) => ({ ...prev, [p._id]: e.target.value }))
                    }
                    placeholder="Admin comment"
                  />
                </td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                    disabled={actionLoading[p._id]}
                    onClick={() => handleAction(p._id, "verified")}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                    disabled={actionLoading[p._id]}
                    onClick={() => handleAction(p._id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
