import Blog from "../Models/blog.js";
import multer from "multer";

// Multer setup
export const upload = multer({ storage: multer.memoryStorage() });

export const createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId;
    const name = req.user.name;

    // Check if title and description are provided
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    // Picture logic: Frontend se jo image aaya, woh save karo
    const picture = req.file ? req.file.buffer : req.body.image; // Buffer ya URL

    const newBlog = new Blog({
      userId,
      name,
      title,
      description,
      picture,
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.error("Error during create blog:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later"
    });
  }
};

// Get All Blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    const blogsWithImages = blogs.map((blog) => {
      let pictureData;
      if (Buffer.isBuffer(blog.picture)) {
        pictureData = `data:image/jpeg;base64,${blog.picture.toString("base64")}`;
      } else {
        pictureData = blog.picture; // URL
      }
      return { ...blog._doc, picture: pictureData };
    });

    res.status(200).json({ message: "Blogs fetched successfully", blogs: blogsWithImages });
  } catch (error) {
    console.error("Error during getting all blogs:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later"
    });
  }
}

// Get blog by id
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog fetched successfully", blog });
  } catch (error) {
    console.error("Error during getting blog by id:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later"
    });
  }
};

// Delete blog by id
export const deleteBlog = async (req, res) => {
  try {
    const userId = req.user.userId;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Verify user ownership
    if (blog.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: You can only delete your own blog" });
    }

    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error while deleting blog:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later"
    });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  const userId = req.user.userId;
  const { title, description } = req.body;
  const picture = req.file ? req.file.buffer : undefined;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Verify user ownership
    if (blog.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own blog" });
    }

    // Update fields
    blog.title = title || blog.title;
    blog.description = description || blog.description;
    if (picture) blog.picture = picture; // Save Base64 string

    await blog.save();
    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("Error while updating blog:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later",
    });
  }
};