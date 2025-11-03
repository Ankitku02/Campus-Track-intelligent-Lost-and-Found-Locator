import React from "react";
import LoginForm from "./LoginForm.jsx";

const LoginPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-96">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
