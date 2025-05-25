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

  useEffect(() => {
    console.log("Fetching photographers...");

    setLoading(true);
    api
      .get("/partner/partners")
      .then((res) => {
        console.log("Photographers fetched:", res.data.partners);
        setPhotographers(res.data.partners || []);
      })
      .catch((err) => {
        console.log("Error fetching photographers:", err);

        setError(err.message || "Failed to load");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
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
    </section>
  );
}
