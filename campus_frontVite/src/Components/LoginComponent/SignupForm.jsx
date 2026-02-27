import React, { useState } from "react";
import { User, Lock, Mail, UserCheck, Shield, ArrowRight } from "lucide-react";
import { registerNewUser } from "../../Services/LoginService";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [campusUser, setCampusUser] = useState({
    username: "",
    password: "",
    personName: "",
    email: "",
    role: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  let navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveUser = () => {
    return registerNewUser(campusUser).then(() => {
      alert("User is registered successfully...Go For Login");
      navigate("/");
    });
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCampusUser((values) => ({ ...values, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleValidation = (event) => {
    event.preventDefault();
    let tempErrors = {};
    let isValid = true;

    if (!campusUser.username.trim()) {
      tempErrors.username = "User Name is required";
      isValid = false;
    }
    if (!campusUser.password.trim()) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (
      campusUser.password.length < 5 ||
      campusUser.password.length > 10
    ) {
      tempErrors.password = "Password must be 5-10 characters long";
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      tempErrors.confirmPassword = "Confirm Password is required";
      isValid = false;
    } else if (campusUser.password && campusUser.password !== confirmPassword) {
      tempErrors.confirmPassword = "Both the passwords are not matched";
      isValid = false;
    }

    if (!campusUser.personName.trim()) {
      tempErrors.personName = "Full Name is required";
      isValid = false;
    }

    if (!campusUser.email.trim()) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!emailPattern.test(campusUser.email)) {
      tempErrors.email = "Invalid Email Format";
      isValid = false;
    }

    if (!campusUser.role.trim()) {
      tempErrors.role = "Role is required";
      isValid = false;
    }

    setErrors(tempErrors);
    if (!isValid) return;

    setIsSubmitting(true);
    saveUser().finally(() => setIsSubmitting(false));
  };

  return (
    <div className="bg-black/50 backdrop-blur-lg p-8 rounded-2xl shadow-4xl w-92">
      {/* Header */}
      {/*<h2 className="text-2xl font-bold text-center mb-4 text-yellow-400">
        Create Your Account
      </h2>*/}

      <form onSubmit={handleValidation} noValidate className="space-y-4">
        {/* Username */}
        <div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={campusUser.username}
              onChange={onChangeHandler}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          </div>
          {errors.username && (
            <p className="text-red-400 text-xs mt-1 text-center">{errors.username}</p>
          )}
        </div>

        {/* Full Name */}
        <div>
          <div className="relative">
            <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="personName"
              placeholder="Full Name"
              value={campusUser.personName}
              onChange={onChangeHandler}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          </div>
          {errors.personName && (
            <p className="text-red-400 text-xs mt-1 text-center">{errors.personName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={campusUser.email}
              onChange={onChangeHandler}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs mt-1 text-center">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={campusUser.password}
              onChange={onChangeHandler}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1 text-center">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1 text-center">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              name="role"
              value={campusUser.role}
              onChange={onChangeHandler}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/40 text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            >
              <option value="">Select Role</option>
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          {errors.role && (
            <p className="text-red-400 text-xs mt-1 text-center">{errors.role}</p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition disabled:opacity-60 flex items-center justify-center"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
          <ArrowRight className="h-5 w-5 ml-2" />
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-gray-300 mt-4">
        Already have an account?{" "}
        <a href="/" className="text-yellow-400 hover:underline">
          Sign in here
        </a>
      </p>
    </div>
  );
};

export default SignupForm;
