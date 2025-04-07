import React, { useContext, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { FaCheck, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./User.module.css";
import { Link, useNavigate } from "react-router-dom";

const UserRegister = () => {
  const { registerUser } = useContext(GlobalContext);
  const [warnings, setWarnings] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState(false);
  const [serverMessage, setServerMessage] = useState(""); // Server response message
  const navigate = useNavigate();

  // Form Data For User Registration
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Password Criteria For Password Strength Meter
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    specialChar: false,
    number: false,
    letter: false,
  });

  // Handle Input Change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validate Form Data
  const validate = () => {
    const newWarnings = {};
    if (!formData.name) newWarnings.name = "Enter your name";
    if (!formData.email) newWarnings.email = "Enter your email";
    if (!formData.password) newWarnings.password = "Enter your password";
    if (!formData.confirmPassword) newWarnings.confirmPassword = "Confirm your password";
    if (formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword)
        newWarnings.passwordMatch = "Passwords do not match";
    }
    setWarnings(newWarnings);
    return Object.keys(newWarnings).length === 0;
  };

  // Check Password Strength
  const checkPasswordStrength = (password) => {
    const criteria = {
      length: password.length >= 8,
      specialChar: /[!@#$%^&*]/.test(password),
      number: /\d/.test(password),
      letter: /[A-Za-z]/.test(password),
    };
    setPasswordCriteria(criteria);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");

    // Return if form data is invalid
    if (!validate()) return;

    const isPasswordStrongEnough =
      Object.values(passwordCriteria).every(Boolean);

    if (!isPasswordStrongEnough) {
      setServerMessage("Please ensure the password meets all the criteria");
      return;
    }

    // Send Request To Backend
    const result = await registerUser(formData);

    // Handle Response Success
    if (result.success) {
      setServerMessage(result.success);

      setNotification(true);
      setTimeout(() => {
        setNotification(false);
        navigate("/login");
      }, 2000);
    }
    // Handle Response Error
    if (result.error) {
      setServerMessage(result.error);
    }
  };

  return (
    <>
      <section
        className={`${styles.container} w-[85%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:w-[25%]
         mx-auto border-2 border-[#ddd] rounded-lg px-4 py-6 mt-[13vh]`}
      >

        <form onSubmit={handleSubmit}>
          <h1 className="text-center font-semibold text-xl mb-6">
            Create Account
          </h1>

          {/*User Name  */}
          <div className="mb-3">
            <label htmlFor="name" className="block font-semibold mb-1">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              aria-required="true"
              className="border-[1px] border-[#ccc] w-full rounded-[4px] text-base py-[0.2rem] px-[0.2rem]"
            />
            {/* Warning Message For User Name From Fron-End*/}
            {warnings.name && (
              <span className="text-[red] text-sm">{warnings.name}</span>
            )}
          </div>

          {/*User Email */}
          <div className="mb-3">
            <label htmlFor="email" className="block mb-1 font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              aria-required="true"
              className="border-[1px] border-[#ccc] w-full rounded-[4px] text-base py-[0.2rem] px-[0.2rem]"
            />
            {/* Warning Message For Email From Fron-End */}
            {warnings.email && (
              <span className="text-[red] text-sm">{warnings.email}</span>
            )}
          </div>

          {/*User Password */}
          <div className="mb-3">
            <label htmlFor="password" className="block mb-1 font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                aria-required="true"
                onChange={(e) => {
                  handleInputChange(e);
                  checkPasswordStrength(e.target.value);
                }}
                className="border-[1px] border-[#ccc] w-full rounded-[4px] text-base py-[0.2rem] px-[0.2rem]"
              />
              <span
                className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer hover:text-[#555] transition-colors duration-200 ease-in-out"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {/* Warning Message For User Password From Fron-End */}
            {warnings.password && (
              <span className="text-[red] text-sm">{warnings.password}</span>
            )}
          </div>

          {/*User Confirm Password */}
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

            {/* Warning Message For User Confirm Password From Fron-End */}
            {warnings.confirmPassword && (
              <span className="text-[red] text-sm">
                {warnings.confirmPassword}
              </span>
            )}

            {/* Warning Message For Password Match From Fron-End */}
            {warnings.passwordMatch && (
              <span className="text-[red] text-sm">
                {warnings.passwordMatch}
              </span>
            )}
          </div>

          {/* Password Strength Meter */}
          <section>
            <ul>
              <li
                className={`flex items-center gap-1 text-[13.5px] sm:text-sm ${passwordCriteria.length ? "text-[green]" : "text-[red]"
                  }`}
              >
                {passwordCriteria.length ? (
                  <FaCheck className="text-xs" />
                ) : (
                  <FaTimes className="text-xs" />
                )}{" "}
                At least 8 characters
              </li>

              <li
                className={`flex items-center gap-1 text-[13.5px] sm:text-sm ${passwordCriteria.specialChar ? "text-[green]" : "text-[red]"
                  }`}
              >
                {passwordCriteria.specialChar ? (
                  <FaCheck className="text-xs" />
                ) : (
                  <FaTimes className="text-xs" />
                )}{" "}
                At least 1 special character (!@#$%^&*)
              </li>

              <li
                className={`flex items-center gap-1 text-[13.5px] sm:text-sm ${passwordCriteria.number ? "text-[green]" : "text-[red]"
                  }`}
              >
                {passwordCriteria.number ? (
                  <FaCheck className="text-xs" />
                ) : (
                  <FaTimes className="text-xs" />
                )}{" "}
                At least 1 number
              </li>

              <li
                className={`flex items-center gap-1 text-[13.5px] sm:text-sm ${passwordCriteria.letter ? "text-[green]" : "text-[red]"
                  }`}
              >
                {passwordCriteria.letter ? (
                  <FaCheck className="text-xs" />
                ) : (
                  <FaTimes className="text-xs" />
                )}{" "}
                At least 1 letter (A-Z or a-z)
              </li>
            </ul>
          </section>

          {serverMessage && (
            <div className="text-[red] text-center pt-1">{serverMessage}</div>
          )}
          <button
            type="submit"
            className="py-2 text-base bg-gray-800 text-white rounded-[4px] w-full mt-4"
          >
            Create Account
          </button>
          <div className="flex gap-2 mt-2">
            <h2 className="text-black font-medium text-base">
              Already have an account?
            </h2>
            <Link
              to="/login"
              className="text-base font-semibold hover:underline text-[blue]"
            >
              Login
            </Link>
          </div>
        </form>

        {/* Custom Notification */}
        {notification && (
          <div
            className={`${styles.notification} fixed top-[30vh] md:top-[20vh] right-0 bg-[#4CAF50] text-white font-semibold p-2 px-2 rounded-tl-[4px] rounded-bl-[4px]`}
          >
            <p>{serverMessage}</p>
          </div>
        )}
      </section>
    </>
  );
};

export default UserRegister;
