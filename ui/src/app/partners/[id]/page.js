"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
// import api from "../../../lib/api";
import Image from "next/image";
import api from "../../../../lib/api";
import InquiryModal from "../../components/InquiryModal";
import { useAuth } from "../../../../context/AuthContext";

export default function PartnerProfilePage() {
  const router = useRouter();
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInquiry, setShowInquiry] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;
    if (user?.role !== "client" && user?.role !== "admin") {
      router.replace("/");
      return;
    }
    if (!id) return;
    setLoading(true);
    // console.log(`Fetching partner with ID: ${id}`);

    api
      .get(`/partner/partners/${id}`)
      .then((res) => {
        console.log(`Fetched partner data:`, res);

        setPartner(res.data);
      })
      .catch((err) => setError("Failed to load partner profile."))
      .finally(() => setLoading(false));
  }, [id, isAuthenticated, user, router]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError("");
    setReviewSuccess("");
    try {
      await api.post(
        "/reviews/create",
        {
          partnerId: id,
          rating: reviewRating,
          comment: reviewComment,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setReviewSuccess("Review submitted!");
      setReviewComment("");
      setReviewRating(5);
      // Refetch partner to update reviews
      api.get(`/partner/partners/${id}`).then((res) => setPartner(res.data));
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!partner)
    return <div className="text-center py-8">Partner not found.</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded shadow p-6 mt-6">
      <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-blue-200">
          <Image
            src={
              partner.portfolioSamples?.[0] ||
              "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4"
            }
            alt={partner.name}
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{partner.name}</h1>
          <div className="text-gray-600 mb-1">{partner.location}</div>
          <div className="text-blue-600 font-bold text-lg mb-1">
            ₹{partner.price !== undefined ? partner.price : "N/A"}
          </div>
          <div className="mb-2 text-blue-700 font-medium">
            {partner.serviceDetails}
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {(partner.styles || partner.tags || []).map((tag) => (
              <span
                key={tag}
                className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => setShowInquiry(true)}
          >
            Send Inquiry
          </button>
        </div>
      </div>
      {/* Portfolio / Gallery */}
      {partner.gallery && partner.gallery.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {partner.gallery.map((item) => (
              <div
                key={item._id}
                className="bg-gray-50 rounded shadow p-2 flex flex-col items-center"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.description || "Portfolio image"}
                  width={200}
                  height={140}
                  className="rounded object-cover border mb-2"
                />
                <div className="text-xs text-gray-700 text-center">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Reviews */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Reviews</h2>
        {partner.reviews && partner.reviews.length > 0 ? (
          <div className="space-y-3">
            {partner.reviews.map((review, idx) => (
              <div key={idx} className="border-b pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800">
                    {review.reviewerName || "User"}
                  </span>
                  <span className="text-yellow-400">
                    {"★".repeat(Math.round(review.rating))}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {review.rating.toFixed(1)}
                  </span>
                </div>
                <div className="text-gray-700 text-sm">{review.comment}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">No reviews yet.</div>
        )}
        {/* Review submission form (clients only) */}
        {user?.role === "client" && (
          <form
            onSubmit={handleReviewSubmit}
            className="mt-6 space-y-2 bg-gray-50 p-4 rounded"
          >
            <div>
              <label className="block mb-1 font-medium">Your Rating</label>
              <select
                className="border px-2 py-1 rounded"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                required
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Your Review</label>
              <textarea
                className="w-full border px-2 py-1 rounded"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
                rows={2}
                placeholder="Write your feedback..."
              />
            </div>
            {reviewError && (
              <div className="text-red-600 text-sm">{reviewError}</div>
            )}
            {reviewSuccess && (
              <div className="text-green-600 text-sm">{reviewSuccess}</div>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              disabled={reviewLoading}
            >
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>
      <InquiryModal
        open={showInquiry}
        onClose={() => setShowInquiry(false)}
        partnerId={partner._id}
      />
    </div>
  );
}
