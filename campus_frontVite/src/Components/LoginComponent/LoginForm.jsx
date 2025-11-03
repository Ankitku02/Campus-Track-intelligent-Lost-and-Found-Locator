import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateUser } from "../../Services/LoginService";
import { User, Lock, ArrowRight } from "lucide-react";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  let navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((values) => ({ ...values, [name]: value }));
    // Clear field-specific error as the user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const checkLogin = () => {
    validateUser(formData.username, formData.password)
      .then((response) => {
        let role = String(response.data);
        if (role === "Admin") navigate("/AdminMenu");
        else if (role === "Student") navigate("/StudentMenu");
        else alert("Wrong Userid/Password");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleValidation = (event) => {
    event.preventDefault();
    let tempErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      tempErrors.username = "User Name is required";
      isValid = false;
    }

    if (!formData.password.trim()) {
      tempErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(tempErrors);

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    checkLogin();
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-black/40 backdrop-blur-2xl rounded-2xl shadow-2xl ">
      {/* // For Spotlight Effect :  */}
      {/* <div className="w-full max-w-md p-8 space-y-8 shadow-2xl "> */}
      {/* Header Section  */}
      <div className="text-center">
        <h1
          style={{ fontFamily: "Gilroy-Heavy" }}
          className="text-2xl font-extrabold text-yellow-400 tracking-widest uppercase mb-2"
        >
          Welcome To CampusConnect
        </h1>
        <p className="text-sm text-white/90 leading-relaxed tracking-wide">
          Sign in to Access the Lost & Found portal
        </p>
      </div>

      {/* main form  */}
      <form method="get" className="space-y-6" onSubmit={handleValidation}>
        {/* Username Input  */}
        <div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={onChangeHandler}
              // required
              className="w-full pl-10 pr-4 py-3 bg-black/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-center hover:border-gray-600"
            />
          </div>
          {errors.username && (
            <p className="text-red-400 text-sm mt-1 text-center">
              {errors.username}
            </p>
          )}
        </div>

        {/* Password input  */}
        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={onChangeHandler}
              // required
              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-center hover:border-gray-600"
            />
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm mt-1 text-center">
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit Button  */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              borderRadius: "0.7rem",
              border: "none",
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-yellow-500  text-gray-900 font-semibold hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500 transition-all duration-300 disabled:opacity-50 group shadow-lg "
          >
            <span className="flex items-center gap-2">
              {isSubmitting ? "SIGNING IN..." : "LOGIN"}
              <ArrowRight className="h-5 w-5 transition-all duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </form>

      {/* Footer section */}
      <div className="text-center text-white/90 text-sm pt-2">
        New user?{" "}
        <a
          href="/Register"
          style={{
            color: "#fbbf24",
            textDecoration: "none",
          }}
          className="font-medium transition-all duration-200"
          onMouseEnter={(e) => {
            e.target.style.color = "#bd8504";
            e.target.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#fbbf24";
            e.target.style.textDecoration = "none";
          }}
        >
          Sign up here
        </a>
      </div>
    </div>
  );
};

export default LoginForm;