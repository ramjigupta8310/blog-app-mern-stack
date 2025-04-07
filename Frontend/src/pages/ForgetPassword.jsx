import React, { useState, useContext, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./User.module.css";
import GlobalContext from "../context/GlobalContext";

const ForgetPassword = () => {
  const {
    varifyEmail,
    resetPassword,
  } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [emailSection, setEmailSection] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle Input Change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Email Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Varify Email And Send Request To Backend
    const response = await varifyEmail(formData.email);

    // If Success Then Show Password Reset Section
    if (response.success) {
      setServerMessage(response.success);
      setErrorMessage("");
      setEmailSection(false);
    }
    // If Error Then Show Error Message
    if (response.error) {
      setErrorMessage(response.error);
    }
  };

  // Handle Password Submit For Reset Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Send Reset Password Request To Backend
    const response = await resetPassword(
      formData.email,
      formData.newPassword,
      formData.confirmPassword
    );

    // If Success Then Show Success Message And Redirect To Login And Show Notification
    if (response.success) {
      setServerMessage(response.success);
      setErrorMessage("");
      setNotification(true);
      setTimeout(() => {
        setNotification(false);
        navigate("/login");
      }, 3000); // Redirect to login after 2 seconds
    }

    // If Error Then Show Error Message
    if (response.error) {
      setErrorMessage(response.error);
    }
  };

  return (
    <section
      className={`${styles.container} w-[85%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:w-[25%] mx-auto border-2 border-[#ddd] rounded-lg px-4 py-6 mt-[13vh]`}
    >
      {/* Show Email Section First */}
      {emailSection ? (
        <form onSubmit={handleSubmit}>
          <h1 className="text-center font-semibold text-xl mb-6">
            Reset Password
          </h1>

          {/* User Email Section */}
          <div className="mb-3">
            <label htmlFor="email" className="block font-semibold mb-1">
              Enter your email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              aria-required="true"
              onChange={handleInputChange}
              className="border-[1px] border-[#ccc] w-full rounded-[4px] text-base py-[0.2rem] px-[0.2rem]"
            />
          </div>

          {/* Show Error Message If Some Error Occur */}
          {errorMessage && <p className="text-[red] text-sm">{errorMessage}</p>}

          {/* Submit Email Button */}
          <button className="py-2 text-base bg-gray-800 text-white rounded-[4px] w-full mt-4">
            Continue
          </button>
        </form>
      ) : (
        // Show Password Reset Section 
        <form onSubmit={handlePasswordSubmit}>
          <h2 className="text-center font-semibold text-xl ">Reset Password</h2>

          {/* Show Server Message After OTP Varificaion */}
          {serverMessage && (
            <div className="text-center text-[green] mb-6">{serverMessage}</div>
          )}

          {/* New Password Section */}
          <div className="mb-3">
            <label htmlFor="password" className="block mb-1 font-semibold">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="newPassword"
                aria-required="true"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="border-[1px] border-[#ccc] w-full rounded-[4px] text-base py-[0.2rem] px-[0.2rem]"
              />

              {/* Show Or Hide New Password */}
              <span
                className="toggle-password absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer hover:text-[#555] transition-colors duration-200 ease-in-out"
                aria-label={
                  showPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          {/* Confirm New Password Section */}
          <div className="mb-3">
            <label
              htmlFor="confirmPassword"
              className="block mb-1 font-semibold"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                aria-required="true"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="border-[1px] border-[#ccc] w-full rounded-[4px] text-base py-[0.2rem] px-[0.2rem]"
              />
              {/* Show Or Hide Confirm New Password */}
              <span
                className="toggle-password absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer hover:text-[#555] transition-colors duration-200 ease-in-out"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          {errorMessage && <p className="text-[red] text-sm">{errorMessage}</p>}

          <button className="py-2 text-base bg-gray-800 text-white rounded-[4px] w-full mt-4">
            Reset Password
          </button>
        </form>
      )}
      {/* Custom Notification */}
      {notification && (
        <div
          className={`${styles.notification} fixed top-[30vh] md:top-[20vh] right-0 bg-[#4CAF50] text-white font-semibold p-2 px-2 rounded-tl-[4px] rounded-bl-[4px]`}
        >
          <p>{serverMessage}</p>
        </div>
      )}
    </section>
  );
};

export default ForgetPassword;
