import axios from "axios";

// Backend base URL
const BASE_URL = "http://localhost:9999/lost-found/login";

// Register a new user
export const registerNewUser = (user) => axios.post(BASE_URL, user);

// Validate login credentials
export const validateUser = (userId, password) =>
  axios.get(`${BASE_URL}/${userId}/${password}`);

// Get current user details
export const getUserDetails = () => axios.get(BASE_URL);

// Get all students
export const getAllStudents = () => axios.get(`${BASE_URL}/students`);

// Delete student by username
export const deleteStudentByUsername = (username) =>
  axios.delete(`${BASE_URL}/student/${username}`);
