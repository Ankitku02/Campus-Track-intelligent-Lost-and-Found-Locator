import axios from "axios";

const BASE_URL = "http://localhost:9999/lost-found";

// --- Lost Item Endpoints ---
export const getAllLostItems = () => axios.get(`${BASE_URL}/lost-items`);
export const getLostItemsByUser = () => axios.get(`${BASE_URL}/lost-items/user`);
export const getLostItemById = (id) => axios.get(`${BASE_URL}/lost-items/${id}`);
export const lostItemSubmission = (lostItem) => axios.post(`${BASE_URL}/lost-items`, lostItem);
export const deleteLostItemById = (id) => axios.delete(`${BASE_URL}/lost-items/${id}`);

// --- Found Item Endpoints ---
export const getAllFoundItems = () => axios.get(`${BASE_URL}/found-items`);
export const getFoundItemsByUser = () => axios.get(`${BASE_URL}/found-items/user`);
export const getFoundItemById = (id) => axios.get(`${BASE_URL}/found-items/${id}`);
export const foundItemSubmission = (foundItem) => axios.post(`${BASE_URL}/found-items`, foundItem);
export const deleteFoundItemById = (id) => axios.delete(`${BASE_URL}/found-items/${id}`);

// --- FuzzyLogic Matching Endpoint ---
export const getMatchingFoundItems = (lostItemId, threshold = 0.8) =>
  axios.get(`${BASE_URL}/fuzzy/match/${lostItemId}?threshold=${threshold}`);