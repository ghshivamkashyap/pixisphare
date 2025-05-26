import Image from "next/image";
import Link from "next/link";

export default function PhotographerCard({ photographer }) {
  // Use avgRating from API if present, fallback to photographer.rating
  const rating = photographer.avgRating ?? photographer.rating ?? 0;
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center gap-3">
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-200 mb-2">
        <Image
          src="https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4"
          alt={photographer.name}
          width={96}
          height={96}
          className="object-cover w-full h-full"
        />
      </div>
      <h2 className="text-lg font-semibold text-gray-900">
        {photographer.name}
      </h2>
      <div className="text-blue-600 font-bold text-md">
        ₹{photographer.price !== undefined ? photographer.price : "N/A"}
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
            }
          >
            ★
          </span>
        ))}
        <span className="ml-1 text-sm text-gray-500">
          {rating ? rating.toFixed(1) : "0.0"}
        </span>
      </div>
      <div className="text-sm text-gray-500 mb-1">{photographer.location}</div>
      <div className="text-sm text-gray-700 mb-1">
        {photographer.serviceDetails}
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {(photographer.styles || photographer.tags || []).map((tag) => (
          <span
            key={tag}
            className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      <Link
        href={`/partners/${photographer._id}`}
        className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition block text-center"
      >
        View Profile
      </Link>
    </div>
  );
}
