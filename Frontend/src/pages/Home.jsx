import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get-allBlogs`);
        setBlogs(response.data?.blogs);
      } catch (error) {
        console.error("Error while creating blog:", {
          message: error.response?.data?.message || error.message,
          status: error.response?.status || "unknown error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const getImageSrc = (picture) => {
    if (!picture) return ""; // Handle null/undefined case
    // Check if it looks like a Base64 string (starts with /9j/ or other Base64 patterns)
    if (picture.startsWith("/9j/") || /^[A-Za-z0-9+/=]+$/.test(picture)) {
      return `data:image/jpeg;base64,${picture}`;
    }
    // If it starts with http or https, treat it as a URL
    if (picture.startsWith("http://") || picture.startsWith("https://")) {
      return picture;
    }
 
  };

  return (
    <>
      <div>
        <img
          src="https://cdn.pixabay.com/photo/2019/04/23/21/04/notepad-4150612_1280.jpg"
          alt="Hero"
          className="w-full h-[70vh] object-cover"
        />
      </div>

      <div>
        <h1 className="text-xl md:text-3xl font-bold text-center mt-4">
          Welcome To Blogs
        </h1>
        {/* Show loading message while loading is true */}
        {loading && (
          <p className="text-center text-gray-500 mt-4 text-xl md:text-3xl">Loading...</p>
        )}
      </div>

      {/* Blogs Section - Only show when loading is false */}
      {!loading && (
        <div className="px-2 md:px-10 xl:px-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-6 pb-16">
          {blogs?.length > 0 ? (
            blogs.map((blog) => (
              <Link
                to={`/blog/${blog._id}`}
                key={blog._id}
                className="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-gray-200"
              >
                <img
                  src={getImageSrc(blog.picture)}
                  alt={blog.title}
                  className="w-full h-60 object-cover rounded-t-lg"
                />
                <div className="mt-2">
                  <h2 className="text-lg font-semibold truncate">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-2 break-words">
                    {blog.description}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Created by: {blog.name}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center col-span-full">No blogs found.</p>
          )}
        </div>
      )}
    </>
  );
};

export default Home;