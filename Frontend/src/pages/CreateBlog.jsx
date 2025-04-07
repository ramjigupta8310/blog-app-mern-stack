import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";
import axios from "axios";
import styles from "./User.module.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const CreateBlog = () => {
  const defaultImg = "https://images.pexels.com/photos/4549414/pexels-photo-4549414.jpeg";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(defaultImg); // Default image
  const [serverSuccessMessage, setServerSuccessMessage] = useState("");
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [notification, setNotification] = useState(false);
  const navigate = useNavigate();

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    } else {
      setImage(defaultImg);
    }
  };

  // Handle form submission for creating a blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErrorMessage("");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", e.target.image.files[0] ? e.target.image.files[0] : defaultImg); // Image file

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${BASE_URL}/create-blog`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });
      setServerSuccessMessage(response?.data?.message);
      setNotification(true);
      setTimeout(() => {
        setNotification(false);
        setServerSuccessMessage("");
      }, 2000);
      setTitle("");
      setDescription("");
      setImage(defaultImg); // Reset form
    } catch (error) {
      setServerErrorMessage(error.response?.data?.message);
      console.error("Error while creating blog:", {
        message: error.response?.data?.message || error.message,
        status: error.response?.status || "unknown error"
      });

      setTimeout(() => {
        if (error.response?.status === 401) navigate("/login");
      }, 5000);
    }
  };


  return (
    <div className="bg-gray-100 flex justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Create Blog</h2>

        {serverErrorMessage && <div className="text-center text-[red] mb-4">{serverErrorMessage}</div>}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter blog title"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Write your blog content here"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="image">
              Upload Image
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="cursor-pointer bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center gap-2"
              >
                <FaUpload /> Upload Image
              </label>
            </div>
            {/* Preview Image */}
            <div className="mt-4">
              <img
                src={image}
                alt="Blog Preview"
                className="w-full h-48 object-cover rounded"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Create Blog
          </button>
        </form>

        {/* Custom Notification */}
        {notification && (
          <div
            className={`${styles.notification} fixed top-[30vh] md:top-[20vh] right-0 bg-[#4CAF50] text-white font-semibold p-2 px-2 rounded-tl-[4px] rounded-bl-[4px]`}
          >
            <p>{serverSuccessMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBlog;