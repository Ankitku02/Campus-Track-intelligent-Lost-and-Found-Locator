import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaCloudUploadAlt } from "react-icons/fa";
import { lostItemSubmission } from "../../Services/ItemService";
import { getUserDetails } from "../../Services/LoginService";
import axios from "axios";

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/datpjmugw/image/upload/v1759833173/Gemini_Generated_Image_vu4wr4vu4wr4vu4w_niixw0.png";

const LostItemSubmit = () => {
  let navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campusUser, setCampusUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const today = new Date().toISOString().slice(0, 10);
  const [ldate, setLdate] = useState(today);

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

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setItem((values) => ({ ...values, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    const input = document.getElementById("image-upload-input");
    if (input) {
      input.value = "";
    }
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
      setErrors((prev) => ({
        ...prev,
        image: "Image Upload Failed. Please try again.",
      }));
      return null;
    }
  };

  const lostItemFormSubmit = async () => {
    let finalImageUrl = DEFAULT_IMAGE_URL;

    if (imageFile) {
      const uploadedUrl = await uploadImgToCloudinary();
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      } else {
        setIsSubmitting(false);
        return;
      }
    }

    const finalItem = {
      ...item,
      username: campusUser.username,
      userEmail: campusUser.email,
      lostDate: ldate,
      imageUrl: finalImageUrl,
    };

    return lostItemSubmission(finalItem).then(() => {
      alert("Lost Item Submitted Successfully!");
      navigate(campusUser?.role === "Admin" ? "/AdminMenu" : "/StudentMenu");
    });
  };

  const handleValidation = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    let tempErrors = {};
    let isValid = true;

    if (!ldate) {
      tempErrors.lostDate = "Lost Date is required";
      isValid = false;
    }
    const requiredFields = ["itemName", "location", "category", "brand", "color"];
    requiredFields.forEach(field => {
      if (!String(item[field] || "").trim()) {
        tempErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      }
    });

    setErrors(tempErrors);
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    lostItemFormSubmit()
      .catch((err) => {
        console.error("Submission failed:", err);
        alert("Submission failed. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsUploading(false);
      });
  };

  const returnBack = () => {
    navigate(campusUser?.role === "Admin" ? "/AdminMenu" : "/StudentMenu");
  };

  const inputStyles =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  const labelStyles = "block text-sm font-medium text-gray-700 mb-1";
  const errorStyles = "text-red-500 text-xs mt-1";

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4 overflow-x-auto">
      <div className="flex space-x-8 w-max bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col justify-center items-center min-w-[400px] space-y-6">
          <div className="flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full">
            <FaBoxOpen size={40} className="text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Lost Item Submission
          </h2>
          <p className="text-gray-500 text-center">
            Report an item you have lost.
          </p>
          <div className="w-full space-y-4">
            <div>
              <label className={labelStyles}>User Name</label>
              <input
                className={`${inputStyles} bg-gray-100 cursor-not-allowed`}
                value={item.username}
                readOnly
              />
            </div>
            <div>
              <label className={labelStyles}>User Email</label>
              <input
                className={`${inputStyles} bg-gray-100 cursor-not-allowed`}
                value={item.userEmail}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="lostDate" className={labelStyles}>
                Select Lost Date *
              </label>
              <input
                id="lostDate"
                type="date"
                className={inputStyles}
                value={ldate}
                onChange={(e) => setLdate(e.target.value)}
              />
              {errors.lostDate && <p className={errorStyles}>{errors.lostDate}</p>}
            </div>
          </div>
        </div>
        <form
          onSubmit={handleValidation}
          className="flex flex-col min-w-[500px] space-y-6"
        >
          <div className="grid grid-cols-2 gap-6">
             {/* Form fields for itemName, category, color, brand, location */}
             {Object.keys(item).filter(k => ["itemName", "category", "color", "brand", "location"].includes(k)).map(field => (
                <div key={field} className={field === 'location' ? 'col-span-2' : ''}>
                  <label htmlFor={field} className={labelStyles}>
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} *
                  </label>
                  <input id={field} name={field} className={inputStyles} value={item[field]} onChange={onChangeHandler}/>
                  {errors[field] && <p className={errorStyles}>{errors[field]}</p>}
                </div>
              ))}
          </div>
          <div className="border-t border-gray-200 pt-6">
             {/* Image Upload JSX */}
             <label htmlFor="imageUpload" className={labelStyles}>Upload Item Image</label>
            <div className="mt-2 flex items-center justify-center w-full">
              <label htmlFor="image-upload-input" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                {imageFile ? (
                  <div className="relative w-full h-full">
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeImage(); }} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded px-2 py-1 text-sm font-bold">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaCloudUploadAlt className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, or JPEG</p>
                  </div>
                )}
                <input id="image-upload-input" type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} />
              </label>
            </div>
            {errors.image && <p className={errorStyles}>{errors.image}</p>}
          </div>
          <div className="flex flex-row gap-4 mt-8">
            <button type="button" onClick={returnBack} className="w-full bg-gray-500 text-white font-bold py-3 px-4 rounded-md hover:bg-gray-600 transition">
              Return
            </button>
            <button type="submit" disabled={isSubmitting || isUploading} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition">
              {isUploading ? "Uploading..." : isSubmitting ? "Submitting..." : "Submit Lost Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LostItemSubmit;