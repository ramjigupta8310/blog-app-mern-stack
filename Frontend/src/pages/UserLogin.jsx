import React, { useState, useContext } from "react";
import styles from "./User.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";

const UserLogin = () => {
  const { loginUser } = useContext(GlobalContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [notification, setNotification] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const response = await loginUser(formData);

    // If Login IS Successful Then Display Success Message And Redirect To Home Page
    if (response.success) {
      setSuccessMessage(response.success);
      setNotification(true);
      setTimeout(() => {
        navigate("/");
        setNotification(false);
      }, 2000);
    }

    // If Login Fails Then Display Error Message
    if (response.error) {
      setErrorMessage(response.error);
    }
  };

  return (
    <>
      <section
        className={`${styles.container} w-[85%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:w-[25%] mx-auto border-2 border-[#ddd] rounded-lg px-4 py-6 mt-[13vh]`}
      >
        <form onSubmit={handleSubmit}>
          <h1 className="text-center font-semibold text-xl mb-6">Login</h1>
          <div className="mb-3">
            <label htmlFor="email" className="block font-semibold mb-1">
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
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="block font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                aria-required="true"
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
          </div>

          <div className="flex justify-between gap-6">
            <div>
              {errorMessage && (
                <p className="text-[red] font-semibold">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-[green] font-semibold">{successMessage}</p>
              )}
            </div>
            <div>
              <Link
                to="/forget-password"
                className="text-base font-semibold hover:underline text-[blue] text-nowrap"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="py-2 text-base bg-gray-800 text-white rounded-[4px] w-full mt-4"
          >
            Login
          </button>
          <div className="flex sm:flex-row flex-col gap-1 justify-end items-end mt-2">
            <h2>New to Blogger?</h2>
            <Link
              to="/register"
              className="text-base font-semibold hover:underline text-[blue]"
            >
              Create your account
            </Link>
          </div>
        </form>
      </section>

      {/* Custom Notification */}
      {notification && (
        <div
          className={`${styles.notification} fixed top-[30vh] md:top-[20vh] right-0 bg-[#4CAF50] text-white font-semibold p-2 px-2 rounded-tl-[4px] rounded-bl-[4px]`}
        >
          <p>{successMessage}</p>
        </div>
      )}
    </>
  );
};

export default UserLogin;
