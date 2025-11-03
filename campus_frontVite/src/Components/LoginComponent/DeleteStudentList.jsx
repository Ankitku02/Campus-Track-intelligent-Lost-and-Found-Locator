import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudents, deleteStudentByUsername } from "../../Services/LoginService";

const DeleteStudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getAllStudents();
      setStudents(response.data);
    } catch (err) {
      setError("Failed to fetch students");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Delete student
  const handleDelete = async () => {
    try {
      await deleteStudentByUsername(selectedStudent.username);
      setStudents(students.filter((s) => s.username !== selectedStudent.username));
      setShowModal(false);
      setSelectedStudent(null);
    } catch (err) {
      alert("Failed to delete student");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40 text-gray-600 font-medium">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-40 text-red-600 font-medium">
        {error}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      {/* Return Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded shadow-sm transition duration-200"
        >
          &larr; Return
        </button>
      </div>

      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
        Student Management
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.username} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4">{student.username}</td>
                  <td className="px-6 py-4">{student.personName}</td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        student.role === "Admin"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {student.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setShowModal(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-sm transition duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Warning!
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete <strong>{selectedStudent.username}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteStudentList;
