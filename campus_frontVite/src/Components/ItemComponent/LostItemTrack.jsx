import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLostItemsByUser, getMatchingFoundItems } from "../../Services/ItemService";
import { FaSearch, FaTimes, FaArrowLeft } from "react-icons/fa";

const FoundItemTile = ({ item }) => (
  <div className="bg-gray-100 rounded-lg shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300 w-full max-w-xs">
    <img
      src={item.imageUrl || "https://via.placeholder.com/150"}
      alt={item.itemName}
      className="w-24 h-24 object-cover rounded-full mb-3 border-2 border-gray-300"
    />
    <p className="font-medium text-gray-900 text-lg truncate">{item.itemName}</p>
    <p className="text-gray-600 text-sm truncate">
      {item.brand || "N/A"} - {item.color || "N/A"}
    </p>
    <p className="text-gray-600 text-sm truncate">{item.category || "N/A"}</p>
  </div>
);

const LostItemPanel = ({ item }) => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleMatches = async () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await getMatchingFoundItems(item.lostItemId);
      setMatches(res.data);
      setIsExpanded(true);
    } catch (err) {
      console.error("Failed to get matches:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
      <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
        <h3 className="text-lg font-semibold truncate">{item.itemName}</h3>
        <button
          onClick={handleToggleMatches}
          className="text-white hover:text-gray-200 transition-colors"
        >
          {isExpanded ? <FaTimes /> : <FaSearch />}
        </button>
      </div>
      <div className="p-4 flex flex-col items-center">
        <img
          src={item.imageUrl || "https://via.placeholder.com/150"}
          alt={item.itemName}
          className="w-28 h-28 object-cover rounded-md mb-3 shadow-sm"
        />
        <p className="text-gray-700 text-sm">Brand: {item.brand || "Unknown"}</p>
        <p className="text-gray-700 text-sm">Color: {item.color || "Unknown"}</p>
        <p className="text-gray-500 text-xs mt-2">Lost on: {item.lostDate}</p>
      </div>
      {isExpanded && (
        <div className="p-4 bg-gray-50 border-t border-gray-300">
          {isLoading ? (
            <p className="text-center text-gray-600">Searching...</p>
          ) : matches.length > 0 ? (
            <div className="flex flex-col gap-4">
              <h4 className="text-indigo-700 font-medium text-center">
                Potential Matches
              </h4>
              {matches.map((found) => (
                <FoundItemTile key={found.foundItemId} item={found} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No potential matches found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const LostItemTrack = () => {
  const navigate = useNavigate();
  const [lostItems, setLostItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 Added state

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const res = await getLostItemsByUser();
        setLostItems(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLostItems();
  }, []);

  if (isLoading)
    return (
      <p className="text-center mt-12 text-gray-700 text-xl">
        Loading your lost items...
      </p>
    );

  // 🔍 Filtered items based on search input
  const filteredItems = lostItems.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.itemName.toLowerCase().includes(q) ||
      (item.brand && item.brand.toLowerCase().includes(q)) ||
      (item.color && item.color.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-indigo-700 font-semibold mb-6 hover:text-indigo-900 transition-colors"
      >
        <FaArrowLeft /> Return
      </button>

      <h2 className="text-4xl font-extrabold mb-6 text-indigo-800 text-center">
        Track Your Lost Items
      </h2>

      {/* 🔍 Search Bar Below Heading */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name, brand, color, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <LostItemPanel key={item.lostItemId} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-center mt-12 text-gray-700 text-xl">
          No matching items found.
        </p>
      )}
    </div>
  );
};

export default LostItemTrack;
