import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../../Services/LoginService";

const Personal = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // hook to navigate

  useEffect(() => {
    getUserDetails()
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch your details");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-5 text-lg text-center">Loading your details...</div>;
  if (error) return <div className="p-5 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-3xl font-bold mb-1">My Personal Details</h2>
        <p className="text-white/90">Here is all your account information.</p>
      </div>

      {/* Details Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-700">Username</td>
              <td className="px-6 py-4 text-gray-900">{user.username}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-700">Name</td>
              <td className="px-6 py-4 text-gray-900">{user.personName}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-700">Email</td>
              <td className="px-6 py-4 text-gray-900">{user.email}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-700">Role</td>
              <td className="px-6 py-4 text-gray-900">{user.role}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Return Button */}
      <div className="mt-6 text-center">
        <button
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
          onClick={() => navigate("/StudentMenu")}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default Personal;
