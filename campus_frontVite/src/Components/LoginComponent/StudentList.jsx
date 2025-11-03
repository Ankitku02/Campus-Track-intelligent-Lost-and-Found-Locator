import React, { useEffect, useState } from "react";
import { getAllStudents } from "../../Services/LoginService";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await getAllStudents();
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600 animate-pulse">Loading students...</p>
      </div>
    );

  if (students.length === 0)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">No students found.</p>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 px-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-wide">Student Directory</h2>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-md">
            Total: {students.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm text-gray-700">
            <thead className="bg-indigo-100 text-indigo-800 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5 text-left">Username</th>
                <th className="py-3 px-5 text-left">Name</th>
                <th className="py-3 px-5 text-left">Email</th>
                <th className="py-3 px-5 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student.username}
                  className={`transition duration-150 ease-in-out ${
                    index % 2 === 0
                      ? "bg-white hover:bg-indigo-50"
                      : "bg-gray-50 hover:bg-indigo-50"
                  }`}
                >
                  <td className="py-3 px-5 font-medium">{student.username}</td>
                  <td className="py-3 px-5">{student.personName}</td>
                  <td className="py-3 px-5">{student.email}</td>
                  <td className="py-3 px-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        student.role === "Admin"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {student.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
