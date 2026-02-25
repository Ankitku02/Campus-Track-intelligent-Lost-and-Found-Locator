import React from "react";
import SignupForm from "./SignupForm";

const SignUpPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-dark.jpg')" }} // ✅ dark background image
    >
      <div className="bg-black/60 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-yellow-400/30 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-yellow-400 drop-shadow-lg">
          Create Your Account
        </h2>

        {/* ✅ Your form will render here */}
        <SignupForm />
      </div>
    </div>
  );
};

export default SignUpPage;
