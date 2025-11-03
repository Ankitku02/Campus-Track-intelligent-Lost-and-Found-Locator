import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBox, FaTimes } from "react-icons/fa";
import { getAllFoundItems, getFoundItemsByUser } from "../../Services/ItemService";
import { getUserDetails } from "../../Services/LoginService";

const FoundItemReport = () => {
  let navigate = useNavigate();
  const [itemList, setItemList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getUserDetails()
      .then((response) => setCurrentUser(response.data))
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (currentUser) {
      const fetchItems =
        currentUser.role === "Admin" ? getAllFoundItems : getFoundItemsByUser;
      fetchItems()
        .then((response) => setItemList(response.data))
        .catch((error) => console.error("Error fetching found items:", error))
        .finally(() => setLoading(false));
    }
  }, [currentUser]);

  const returnBack = () => {
    navigate(currentUser?.role === "Admin" ? "/AdminMenu" : "/StudentMenu");
  };

  if (loading) {
    return <div className="text-center text-lg mt-10">Loading found items...</div>;
  }

  const pageTitle = currentUser?.role === "Admin" ? "Found Item Report" : "My Found Items";
  const pageDescription = currentUser?.role === "Admin" ? "All Reported Found Items" : "Items you have reported as found";

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4 bg-indigo-100 rounded-full">
            <FaBox size={35} className="text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 text-center">{pageTitle}</h2>
          <p className="text-gray-500 mt-2">{pageDescription}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-indigo-600 text-white">
              <tr>
                {["Item Id", "Item Name", "Category", "Color", "Brand", "Location", "Found Date", "User", "Email"].map((header) => (
                  <th key={header} className="px-4 py-3 text-left text-sm font-semibold">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {itemList.length > 0 ? (
                itemList.map((item) => (
                  <tr key={item.foundItemId} className="hover:bg-gray-50 cursor-pointer transition" onClick={() => setSelectedItem(item)}>
                    <td className="px-4 py-3">{item.foundItemId}</td>
                    <td className="px-4 py-3">{item.itemName}</td>
                    <td className="px-4 py-3">{item.category}</td>
                    <td className="px-4 py-3">{item.color}</td>
                    <td className="px-4 py-3">{item.brand}</td>
                    <td className="px-4 py-3">{item.location}</td>
                    <td className="px-4 py-3">{item.foundDate}</td>
                    <td className="px-4 py-3">{item.username}</td>
                    <td className="px-4 py-3">{item.userEmail}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-6 text-center text-gray-500">No found items available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end">
          <button onClick={returnBack} className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700 transition">
            Return
          </button>
        </div>
      </div>
      {selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 md:w-1/2 relative">
            <button onClick={() => setSelectedItem(null)} className="absolute top-3 right-3 text-gray-600 hover:text-gray-800">
              <FaTimes size={20} />
            </button>
            <div className="flex flex-col items-center space-y-4">
              <img src={selectedItem.imageUrl || "https://via.placeholder.com/200"} alt={selectedItem.itemName} className="w-40 h-40 object-cover rounded-md shadow-md"/>
              <h2 className="text-2xl font-bold text-gray-800">{selectedItem.itemName}</h2>
              <div className="w-full text-left space-y-2 text-gray-700">
                <p><span className="font-semibold">Item ID:</span> {selectedItem.foundItemId}</p>
                <p><span className="font-semibold">Category:</span> {selectedItem.category}</p>
                <p><span className="font-semibold">Brand:</span> {selectedItem.brand}</p>
                <p><span className="font-semibold">Color:</span> {selectedItem.color}</p>
                <p><span className="font-semibold">Location:</span> {selectedItem.location}</p>
                <p><span className="font-semibold">Found Date:</span> {selectedItem.foundDate}</p>
                <p><span className="font-semibold">Reported By:</span> {selectedItem.username}</p>
                <p><span className="font-semibold">Email:</span> {selectedItem.userEmail}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoundItemReport;