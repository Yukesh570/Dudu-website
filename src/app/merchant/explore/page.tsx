/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export default function ExplorePage() {
  const [keyword, setKeyword] = useState("");
  const [keywordActive, setKeywordActive] = useState(false);

  const [city, setCity] = useState("");

  // Country search + dropdown
  const [countrySearch, setCountrySearch] = useState("");
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  // results and pagination
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageTokens, setPageTokens] = useState<string[]>([]); // tokens for pages (index 0 = initial no-token)
  const [pageIndex, setPageIndex] = useState(0);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const [sortMode, setSortMode] = useState<
    "phone_first" | "alphabetical" | "none"
  >("phone_first");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const CORS_PROXY = "https://corsproxy.io/?";

  // Quick keyword categories
  const quickCategories = [
    { label: "Clothes", value: "clothing store" },
    { label: "Electronics", value: "electronics store" },
    { label: "Kitchen Items", value: "kitchen items" },
    { label: "AI Items", value: "computer store" },
    { label: "Motorcycle Parts", value: "motorcycle parts" },
    { label: "Cars", value: "car dealer" },
  ];

  // ---------------------
  // Fetch Country List (Places Autocomplete regions -> filter countries)
  // ---------------------
  async function fetchCountries(input: string) {
    const url = `${CORS_PROXY}https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&types=(regions)&key=${API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    return (data.predictions || []).filter((p: any) =>
      p.types?.includes("country")
    );
  }

  async function handleCountryInput(value: string) {
    setCountrySearch(value);
    setCountryDropdownOpen(true);

    if (!value || value.length < 2) {
      setCountries([]);
      return;
    }

    try {
      const items = await fetchCountries(value);
      setCountries(items);
    } catch (err) {
      console.error("country autocomplete failed", err);
      setCountries([]);
    }
  }

  // ---------------------
  // Places TextSearch -> then fetch details for each result
  // Implements pagination (20 results/page)
  // ---------------------
  async function fetchTextSearchPage({
    query,
    pagetoken,
  }: {
    query: string;
    pagetoken?: string | null;
  }) {
    // Build URL
    let url = `${CORS_PROXY}https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${API_KEY}`;
    if (pagetoken) url += `&pagetoken=${encodeURIComponent(pagetoken)}`;

    const res = await fetch(url);
    const data = await res.json();
    return data;
  }

  // fetch details for a single place_id (fields: name, formatted_phone_number, types, photos)
  async function fetchPlaceDetails(placeId: string) {
    const detailsUrl = `${CORS_PROXY}https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,international_phone_number,types,photos&key=${API_KEY}`;
    const dres = await fetch(detailsUrl);
    const ddata = await dres.json();
    return ddata.result;
  }

  // build photo url from photo_reference
  function buildPhotoUrl(photoRef?: string | null, maxWidth = 400) {
    if (!photoRef) return null;
    return `${CORS_PROXY}https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoRef}&key=${API_KEY}`;
  }

  // heuristic to decide "mobile-like" phone (very rough)
  function isMobileLikePhone(phone?: string | null) {
    if (!phone) return false;
    // strip non-digits
    const digits = phone.replace(/\D/g, "");
    // treat numbers with typical mobile lengths (>=9 && <=15) as mobile-like
    return digits.length >= 9 && digits.length <= 15;
  }

  // Sort results based on sortMode
  function sortResultsList(list: any[]) {
    const copy = [...list];
    if (sortMode === "phone_first") {
      // put those with phone first, then those without; within phone group, prefer "mobile-like"
      copy.sort((a, b) => {
        const aHas = !!a.phone;
        const bHas = !!b.phone;
        if (aHas === bHas) {
          // both have or both don't: prefer mobile-like
          const aMobile = isMobileLikePhone(a.phone) ? 0 : 1;
          const bMobile = isMobileLikePhone(b.phone) ? 0 : 1;
          if (aMobile !== bMobile) return aMobile - bMobile;
          // fallback alphabetical
          const an = (a.name || "").toLowerCase();
          const bn = (b.name || "").toLowerCase();
          return an.localeCompare(bn);
        }
        return aHas ? -1 : 1;
      });
    } else if (sortMode === "alphabetical") {
      copy.sort((a, b) =>
        (a.name || "").toLowerCase().localeCompare((b.name || "").toLowerCase())
      );
    }
    // none => keep order from API
    return copy;
  }

  // main runner to perform textsearch and populate results for a page
  async function runSearchPage(pagetoken?: string | null, tokenIndex?: number) {
    if (!keyword) return;
    setLoading(true);
    setResults([]);

    try {
      const q = `${keyword} in ${city || ""}, ${selectedCountry || ""}`;
      const query = encodeURIComponent(q);

      // fetch page (with retry if pagetoken exists but not yet active)
      let data;
      if (pagetoken) {
        // retry loop: next_page_token sometimes not valid immediately
        let attempts = 0;
        while (attempts < 6) {
          data = await fetchTextSearchPage({ query, pagetoken });
          // if invalid_request, wait and retry
          if (data.status === "OK" || data.status === "ZERO_RESULTS") break;
          // if INVALID_REQUEST, wait and retry
          attempts++;
          await sleep(1000);
        }
      } else {
        data = await fetchTextSearchPage({ query });
      }

      const places = data.results || [];
      const newNextToken = data.next_page_token || null;

      // get details for each place (phone, types, photos)
      const detailed = await Promise.all(
        places.map(async (p: any) => {
          try {
            const d = await fetchPlaceDetails(p.place_id);
            const photoRef =
              d.photos?.[0]?.photo_reference || p.photos?.[0]?.photo_reference;
            return {
              id: p.place_id,
              name: d?.name || p.name,
              address: d?.formatted_address || p.formatted_address,
              phone:
                d?.formatted_phone_number ||
                d?.international_phone_number ||
                "N/A",
              types: d?.types || p.types || [],
              photoReference: photoRef || null,
            };
          } catch (err) {
            // fallback to available textsearch data
            const photoRef = p.photos?.[0]?.photo_reference || null;
            return {
              id: p.place_id,
              name: p.name,
              address: p.formatted_address,
              phone: "N/A",
              types: p.types || [],
              photoReference: photoRef,
            };
          }
        })
      );

      // update pagination tokens stack and index
      if (typeof tokenIndex === "number") {
        // replacing/setting page token at tokenIndex
        const copyTokens = [...pageTokens];
        copyTokens[tokenIndex] = pagetoken || "";
        setPageTokens(copyTokens);
        setPageIndex(tokenIndex);
      } else if (!pagetoken) {
        // first search: reset tokens
        setPageTokens([""]);
        setPageIndex(0);
      }

      setNextPageToken(newNextToken);

      // sort according to mode
      const sorted = sortResultsList(detailed);
      setResults(sorted);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  }

  // Public handler called by button
  async function handleSearch() {
    // reset pagination
    setPageTokens([]);
    setPageIndex(0);
    setNextPageToken(null);
    await runSearchPage(null);
  }

  // Navigate to next page
  async function goToNextPage() {
    if (!nextPageToken) return;
    // push the token into pageTokens stack for current page index+1
    const newIndex = pageIndex + 1;
    const newTokens = [...pageTokens];
    newTokens[newIndex] = nextPageToken;
    setPageTokens(newTokens);
    // run search with pagetoken
    await runSearchPage(nextPageToken, newIndex);
  }

  // Navigate to previous page
  async function goToPrevPage() {
    if (pageIndex <= 0) return;
    const prevIndex = pageIndex - 1;
    const prevToken = pageTokens[prevIndex] || null;
    // if prevIndex === 0, we want the initial search (no token)
    await runSearchPage(prevIndex === 0 ? null : prevToken, prevIndex);
  }

  // When sort changes, re-sort existing results
  function changeSort(mode: "phone_first" | "alphabetical" | "none") {
    setSortMode(mode);
    setResults((r) => sortResultsList(r));
    setSortDropdownOpen(false);
  }

  // ===========================
  // UI
  // ===========================
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Explore Places</h1>

      {/* Input Row */}
      <div className="flex flex-wrap gap-4 items-start">
        {/* Country AutoComplete */}
        <div className="relative w-full sm:w-1/3">
          <label className="text-sm text-gray-600">Country</label>
          <input
            value={countrySearch}
            onChange={(e) => handleCountryInput(e.target.value)}
            onFocus={() => setCountryDropdownOpen(true)}
            placeholder="Search country"
            className="border p-2 rounded w-full"
          />

          {countryDropdownOpen && countries.length > 0 && (
            <div className="absolute left-0 right-0 bg-white border rounded shadow z-10 max-h-60 overflow-y-auto">
              {countries.map((c) => (
                <div
                  key={c.place_id}
                  onClick={() => {
                    setSelectedCountry(c.description);
                    setCountrySearch(c.description);
                    setCountryDropdownOpen(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {c.description}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* City */}
        <div className="w-full sm:w-1/4">
          <label className="text-sm text-gray-600">City</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Keyword */}
        <div className="w-full sm:w-1/3">
          <label className="text-sm text-gray-600">Keyword</label>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setKeywordActive(true)}
            placeholder="restaurant, electronics, hospital..."
            className="border p-2 rounded w-full"
          />

          {(keywordActive || keyword) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {quickCategories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setKeyword(c.value)}
                  className="px-3 py-1 border rounded-full text-sm hover:bg-gray-100 whitespace-nowrap"
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="flex items-end w-full sm:w-auto">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded h-[42px]"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* Sort + pagination controls */}
      <div className="flex items-center justify-between">
        <div className="relative inline-block">
          <button
            className="flex items-center gap-2 px-3 py-1 border rounded"
            onClick={() => setSortDropdownOpen((s) => !s)}
          >
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                d="M3 7h18M6 12h12M10 17h4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm">Sort</span>
          </button>

          {sortDropdownOpen && (
            <div className="absolute mt-2 bg-white border rounded shadow z-20">
              <div
                className="p-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                onClick={() => changeSort("phone_first")}
              >
                Phone first (default)
              </div>
              <div
                className="p-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                onClick={() => changeSort("alphabetical")}
              >
                Alphabetical
              </div>
              <div
                className="p-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                onClick={() => changeSort("none")}
              >
                None (API order)
              </div>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600">
          Page: {pageIndex + 1} • Showing up to 20 results/page
        </div>
      </div>

      {/* Results list (styled like Google Maps result cards) */}
      <div>
        {loading && (
          <div className="py-6 text-center text-gray-600">Loading results…</div>
        )}

        {!loading && results.length === 0 && (
          <div className="py-6 text-center text-gray-600">No results found</div>
        )}

        <div className="space-y-3">
          {results.map((place, idx) => (
            <div
              key={place.id || idx}
              className="flex gap-4 items-start border rounded p-3 hover:shadow transition"
            >
              {/* image */}
              <div className="w-24 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {place.photoReference ? (
                  <img
                    src={buildPhotoUrl(place.photoReference, 400) || ""}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
                )}
              </div>

              {/* content */}
              <div className="flex-1">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="font-medium">{place.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {place.types?.[0]?.replaceAll("_", " ") || "Unknown type"}
                    </div>
                  </div>

                  {/* sort/icon actions per row (placeholder for more actions) */}
                  <div className="text-right text-xs text-gray-500">
                    <button
                      title="Sort options"
                      className="px-2 py-1 border rounded text-xs"
                      onClick={() => setSortDropdownOpen((s) => !s)}
                    >
                      ☰
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {place.phone && place.phone !== "N/A" ? (
                      <a href={`tel:${place.phone}`} className="text-blue-600">
                        {place.phone}
                      </a>
                    ) : (
                      <span className="text-gray-400">No phone</span>
                    )}
                  </div>

                  <div className="text-xs text-gray-500">{place.address}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2 justify-end mt-4">
        <button
          onClick={goToPrevPage}
          disabled={pageIndex <= 0 || loading}
          className={`px-3 py-1 border rounded ${
            pageIndex <= 0 || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Prev
        </button>

        <button
          onClick={goToNextPage}
          disabled={!nextPageToken || loading}
          className={`px-3 py-1 border rounded ${
            !nextPageToken || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
