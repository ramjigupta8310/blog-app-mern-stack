import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import axios from "axios";
import GlobalContext from "../context/GlobalContext";
import { FaEdit, FaTrash, FaUpload } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const BlogDetail = () => {
    const { id } = useParams(); // Get blog ID from URL
    const navigate = useNavigate();
    const { user } = useContext(GlobalContext); // Get current user
    const [blog, setBlog] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ title: "", description: "", picture: null });

    // Fetch blog details
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/blog/${id}`); // Adjusted endpoint
                setBlog(response.data?.blog);
                setFormData({
                    title: response.data?.blog?.title,
                    description: response?.data?.blog?.description,
                });
            } catch (error) {
                console.error("Error fetching blog:", {
                    message: error.response?.data?.message || error.message,
                    status: error.response?.status || "unknown error",
                });
            }
        };
        fetchBlog();
    }, [id]);

    // Check if current user is the blog owner
    const isOwner = user && blog && user.userId === blog.userId.toString();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle image file change
    const handleImageChange = (e) => {
        setFormData({ ...formData, picture: e.target.files[0] });
    };

    // Update blog
    const handleUpdate = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        if (formData.picture) data.append("picture", formData.picture);

        try {
            const response = await axios.put(`${BASE_URL}/update-blog/${id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: localStorage.getItem("token"),
                },
            });
            alert(response?.data?.message);
            setBlog(response?.data?.blog);
            setIsEditing(false);
            navigate("/"); 
        } catch (error) {
            alert(error.response?.data?.message);
            console.error("Error fetching blog:", {
                message: error.response?.data?.message || error.message,
                status: error.response?.status || "unknown error",
            })
        }
    };

    // Delete blog
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                const response = await axios.delete(`${BASE_URL}/delete-blog/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    }
                });
                alert(response?.data?.message);
                navigate("/"); // Redirect to home after deletion
            } catch (error) {
                alert(error.response?.data?.message);
                console.error("Error fetching blog:", {
                    message: error.response?.data?.message || error.message,
                    status: error.response?.status || "unknown error",
                })
            }
        }
    };

    if (!blog) return <p>Loading...</p>;

    return (
        <div className="p-0 sm:p-4 mb-12">
            {/* Blog Image */}
            <img
                src={
                    blog.picture.startsWith("http")
                        ? blog.picture
                        : `data:image/jpeg;base64,${blog.picture}`
                }
                alt={blog.title}
                className="w-full h-[70vh] object-cover mb-4"
            />

            {/* Read-Only Mode */}
            {!isEditing && (
                <div className="px-2 sm:px-6 xl:px-12 2xl:px-20">
                    <h1 className="text-3xl font-bold text-center mb-2">{blog.title}</h1>
                    <p className="text-gray-700 mb-4">About Blog: {blog.description}</p>
                    <p className="text-sm text-gray-500">Created by: {blog.name}</p>
                </div>
            )}

            {/* Edit Mode (if owner) */}
            {isOwner && isEditing && (
                <form onSubmit={handleUpdate} className="space-y-4 px-2 sm:px-6 xl:px-12 2xl:px-20">
                    {/* Title */}

                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="title">
                            Title
                        </label>
                        <input
                            name="title"
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={handleChange}
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
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            placeholder="Write your blog content here"
                            required
                        />
                    </div>

                    {/* Image */}

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="image">
                            Upload Image
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                name="picture"
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="image"
                                className="cursor-pointer bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center gap-2"
                            >
                                <FaUpload /> Upload Image
                            </label>
                        </div>
                    </div>


                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-500 text-white p-2 rounded ml-2"
                    >
                        Cancel
                    </button>
                </form>
            )}

            {/* Edit/Delete Buttons (if owner) */}
            {isOwner && !isEditing && (
                <div className="mt-8 flex space-x-2 px-2 sm:px-6 xl:px-12 2xl:px-20">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-green-500 text-white p-2 rounded flex items-center space-x-1 hover:bg-green-600"
                    >
                        <FaEdit /> {/* Edit Icon */}
                        <span>Edit Blog</span>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white p-2 rounded flex items-center space-x-1 hover:bg-red-600"
                    >
                        <FaTrash /> {/* Delete Icon */}
                        <span>Delete Blog</span>
                    </button>
                </div>
            )}
        </div> 
    );
};

export default BlogDetail;