import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import { foundItemSubmission } from "../../Services/ItemService";
import { getUserDetails } from "../../Services/LoginService";
import axios from "axios";

const FoundItemSubmission = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [campusUser, setCampusUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const today = new Date().toISOString().slice(0, 10);
  const [foundDate, setFoundDate] = useState(today);

  const [item, setItem] = useState({
    username: "",
    userEmail: "",
    itemName: "",
    category: "",
    color: "",
    brand: "",
    location: "",
    imageUrl: "",
    status:false,
  });

  useEffect(() => {
    getUserDetails().then((response) => {
      const userData = response.data;
      setCampusUser(userData);
      setItem((prev) => ({
        ...prev,
        username: userData.username,
        userEmail: userData.email,
      }));
    });
  }, []);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setPreviewImage(null);
      alert("Please select a valid image file (JPG, PNG).");
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewImage(null);
    const input = document.getElementById("image-upload-input");
    if (input) input.value = "";
  };

  const uploadImgToCloudinary = async () => {
    if (!imageFile) return null;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "LostFoundApp");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/datpjmugw/image/upload",
        formData
      );
      setIsUploading(false);
      return response.data.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      setIsUploading(false);
      setErrors((prev) => ({ ...prev, image: "Image Upload Failed. Please try again." }));
      return null;
    }
  };

  const foundItemFormSubmit = async () => {
    let imageUrl = null;
    if (imageFile) {
      const uploadedUrl = await uploadImgToCloudinary();
      if (uploadedUrl) imageUrl = uploadedUrl;
      else return; 
    }

    const finalItem = {
      ...item,
      username: campusUser.username,
      userEmail: campusUser.email,
      foundDate,
      imageUrl,
    };

    return foundItemSubmission(finalItem).then(() => {
        alert("Found Item Submitted Successfully!");
        navigate(campusUser?.role === "Admin" ? "/AdminMenu" : "/StudentMenu");
      }).catch((err) => {
        console.error("Submission failed:", err.response?.data || err);
        alert("Submission failed. Please try again.");
      });
  };

  const handleValidation = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let tempErrors = {};
    let isValid = true;

    const requiredFields = ["itemName", "category", "color", "brand", "location"];
    requiredFields.forEach((field) => {
      if (!String(item[field] || "").trim()) {
        tempErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      }
    });
    if (!foundDate) {
      tempErrors.foundDate = "Found Date is required";
      isValid = false;
    }

    setErrors(tempErrors);
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    foundItemFormSubmit().finally(() => setIsSubmitting(false));
  };

  const inputStyles =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  const labelStyles = "block text-sm font-medium text-gray-700 mb-1";
  const errorStyles = "text-red-500 text-xs mt-1";

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4 overflow-x-auto">
      <form
        onSubmit={handleValidation}
        className="flex flex-col md:flex-row gap-6 w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex-1 space-y-4">
            <h3 className="text-lg font-semibold text-indigo-600 mb-4">User & Item Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelStyles}>User Name</label>
                    <input className={`${inputStyles} bg-gray-100`} value={item.username} readOnly />
                </div>
                <div>
                    <label className={labelStyles}>User Email</label>
                    <input className={`${inputStyles} bg-gray-100`} value={item.userEmail} readOnly />
                </div>
                <div>
                    <label className={labelStyles}>Found Date *</label>
                    <input type="date" className={inputStyles} value={foundDate} onChange={(e) => setFoundDate(e.target.value)} />
                    {errors.foundDate && <p className={errorStyles}>{errors.foundDate}</p>}
                </div>
                {["itemName", "category", "color", "brand", "location"].map((field) => (
                    <div key={field}>
                        <label className={labelStyles}>{`${field.charAt(0).toUpperCase() + field.slice(1)} *`}</label>
                        <input name={field} className={inputStyles} value={item[field]} onChange={onChangeHandler} />
                        {errors[field] && <p className={errorStyles}>{errors[field]}</p>}
                    </div>
                ))}
            </div>
        </div>
        <div className="w-full md:w-px bg-gray-200 mx-4"></div>
        <div className="flex-1 flex flex-col items-center justify-between space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-indigo-600 mb-6">Upload Image</h3>
                <div className="border-4 border-dashed border-gray-300 p-4 w-full text-center rounded-md bg-white hover:bg-gray-100 transition cursor-pointer" onClick={() => document.getElementById("image-upload-input").click()}>
                    <FaCloudUploadAlt className="text-indigo-500 mx-auto mb-4" size={200} />
                    <p>Click to upload image</p>
                    <input id="image-upload-input" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    {previewImage && (
                        <div className="relative mt-4">
                            <img src={previewImage} alt="Preview" className="mx-auto w-48 h-48 object-cover rounded-md shadow-md" />
                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeImage(); }} className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-sm">X</button>
                        </div>
                    )}
                    {errors.image && <p className={errorStyles}>{errors.image}</p>}
                </div>
            </div>
            <div className="flex w-full gap-4">
                <button type="button" onClick={() => navigate(campusUser?.role === "Admin" ? "/AdminMenu" : "/StudentMenu")} className="w-full bg-gray-500 text-white font-bold py-3 rounded-md hover:bg-gray-600 transition">
                    Return
                </button>
                <button type="submit" disabled={isSubmitting || isUploading} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition">
                    {isUploading ? "Uploading..." : isSubmitting ? "Submitting..." : "Submit Found Item"}
                </button>
            </div>
        </div>
    </form>
    </div>
  );
};

export default FoundItemSubmission;