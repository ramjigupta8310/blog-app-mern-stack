import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  picture: { type: mongoose.Mixed, required: true }, // URL ya Buffer
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema, "blogs");
export default Blog;