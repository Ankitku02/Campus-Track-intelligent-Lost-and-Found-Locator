import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "../../LoginView.css";
import { registerNewUser } from "../../Services/LoginService";
const RegisterUser = () => {
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

  const saveUser = (event) => {
    event.preventDefault();
    if (campusUser.password === confirmPassword) {
      registerNewUser(campusUser).then((response) => {
        alert("User is registered successfully...Go For Login");
        navigate("/");
      });
    }
  };

  const onChangeHandler = (event) => {
    event.persist();
    const name = event.target.name;
    const value = event.target.value;
    setCampusUser((values) => ({ ...values, [name]: value }));
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
      campusUser.passwordlength > 10
    ) {
      tempErrors.password = "Password must be 5-10 characters long";
      isValid = false;
    } else if (campusUser.password !== confirmPassword) {
      tempErrors.password = "Both the passwords are not matched";
      isValid = false;
    }

    if (!campusUser.personName.trim()) {
      tempErrors.personName = "Personal Name is required";
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
    if (!confirmPassword.trim()) {
      tempErrors.confirmPassword = "Confirm Password is required";
      isValid = false;
    }
    setErrors(tempErrors);
    if (isValid) {
      saveUser(event);
    }
  };
  return (
    <div>
      <br />
      <div className=".container">
        <div className="row">
          <div className="card col-md-2 offset-md-3 offset-md-3">
            <div className="login-box">
              <h2 className="text-center">
                <u>New User Registration</u>{" "}
              </h2>
              <br />
              <form method="post">
                <div className="form-group">
                  <label>User Name: </label>
                  <input
                    placeholder="username"
                    name="username"
                    className="form-control"
                    value={campusUser.username}
                    onChange={(event) => onChangeHandler(event)}
                  />
                  {errors.username && (
                    <p style={{ color: "red" }}>{errors.username}</p>
                  )}
                </div>
                <div className="form-group">
                  <label>Password: </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={campusUser.password}
                    onChange={(event) => onChangeHandler(event)}
                  />
                  {errors.password && (
                    <p style={{ color: "red" }}>{errors.password}</p>
                  )}
                </div>
                <div className="form-group">
                  <label>Retype your Password: </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                  {errors.confirmPassword && (
                    <p style={{ color: "red" }}>{errors.confirmPassword}</p>
                  )}
                </div>
                <div className="form-group">
                  <label>User's Personal Name: </label>
                  <input
                    placeholder="personal name"
                    name="personName"
                    className="form-control"
                    value={campusUser.personName}
                    onChange={(event) => onChangeHandler(event)}
                  />
                  {errors.personName && (
                    <p style={{ color: "red" }}>{errors.personName}</p>
                  )}
                </div>
                <div className="form-group">
                  <label>User Email: </label>
                  <input
                    placeholder="email"
                    name="email"
                    className="form-control"
                    value={campusUser.email}
                    onChange={(event) => onChangeHandler(event)}
                  />
                  {errors.email && (
                    <p style={{ color: "red" }}>{errors.email}</p>
                  )}
                </div>
                <div className="form-group">
                  <label>Select Role : </label>
                  <input
                    list="types"
                    name="role"
                    className="form-control"
                    value={campusUser.role}
                    onChange={(event) => onChangeHandler(event)}
                  />
                  <datalist id="types">
                    <option value="Student" />
                    <option value="Admin" />
                  </datalist>
                  {errors.role && <p style={{ color: "red" }}>{errors.role}</p>}
                </div>
                <br />
                <button className="btn btn-primary" onClick={handleValidation}>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterUser;
