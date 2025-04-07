import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Home = () => {
  const [blogs, setBlogs] = useState([]);

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
      }
    };
    fetchBlogs();
  }, []);

  console.log(blogs);

  return (
    <>
      <div>
        <img
          src="https://cdn.pixabay.com/photo/2019/04/23/21/04/notepad-4150612_1280.jpg"
          alt="Hero"
          className="w-full h-64 object-cover"
        />
      </div>

      <div>
        <h1 className="text-xl md:text-3xl font-bold text-center mt-4">
          Welcome To Blogs
        </h1>
      </div>

      {/* Blogs Section */}
      <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {blogs?.length > 0 ? (
          blogs.map((blog) => (
            <Link
              to={`/blog/${blog._id}`}
              key={blog._id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={`data:image/jpeg;base64,${blog.picture}`} // Base64 prefix added
                alt={blog.title}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="mt-2">
                <h2 className="text-lg font-semibold truncate">
                  {blog.title}
                </h2>
                <p className="text-gray-600 line-clamp-2">
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
    </>
  );
};

export default Home;