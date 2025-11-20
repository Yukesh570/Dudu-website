/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export default function ExplorePage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const CORS_PROXY = "https://corsproxy.io/?";

  async function handleSearch() {
    if (!keyword) return;
    setLoading(true);
    setResults([]);

    try {
      // Step 1: Text Search
      const query = encodeURIComponent(`${keyword} in ${location || ""}`);
      const searchUrl = `${CORS_PROXY}https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${API_KEY}`;

      const res = await fetch(searchUrl);
      const data = await res.json();
      const places = data.results?.slice(0, 20) || [];

      // Step 2: Get details (to fetch phone numbers)
      const detailedPlaces = await Promise.all(
        places.map(async (p: any) => {
          const lat = p.geometry?.location?.lat || "N/A";
          const lng = p.geometry?.location?.lng || "N/A";

          try {
            const detailsUrl = `${CORS_PROXY}https://maps.googleapis.com/maps/api/place/details/json?place_id=${p.place_id}&fields=name,formatted_address,formatted_phone_number,rating&key=${API_KEY}`;
            const detailRes = await fetch(detailsUrl);
            const detailData = await detailRes.json();
            const d = detailData.result;

            return {
              name: d.name,
              address: d.formatted_address,
              phone: d.formatted_phone_number || "N/A",
              rating: d.rating || "N/A",
              lat,
              lng,
            };
          } catch {
            return {
              name: p.name,
              address: p.formatted_address,
              phone: "N/A",
              rating: p.rating || "N/A",
              lat,
              lng,
            };
          }
        })
      );

      setResults(detailedPlaces);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Explore Places</h1>

      {/* Search inputs */}
      <div className="flex gap-2">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Keyword (e.g. restaurant, electronics)"
          className="border p-2 rounded w-1/2"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (e.g. Kathmandu)"
          className="border p-2 rounded w-1/2"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Address</th>
              <th className="border px-4 py-2 text-left">Phone</th>
              <th className="border px-4 py-2 text-center">Rating</th>
              <th className="border px-4 py-2 text-center">Latitude</th>
              <th className="border px-4 py-2 text-center">Longitude</th>
              <th className="border px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0
              ? results.map((place, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="border px-4 py-2">{place.name}</td>
                    <td className="border px-4 py-2">{place.address}</td>
                    <td className="border px-4 py-2">{place.phone}</td>
                    <td className="border px-4 py-2 text-center">
                      {place.rating}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {place.lat}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {place.lng}
                    </td>
                    {/* <td className="border px-4 py-2 text-center">
                      <a
                        href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                      >
                        View Map
                      </a>
                    </td> */}
                  </tr>
                ))
              : !loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-gray-500 py-4 border"
                    >
                      No results found
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
