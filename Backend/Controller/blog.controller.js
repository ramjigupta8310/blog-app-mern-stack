import Blog from "../Models/blog.js";
import multer from "multer";

// Multer setup
export const upload = multer({ storage: multer.memoryStorage() }).single("image");

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
    res.status(500).json({ message: "Error creating blog", error });
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
   
    res.status(200).json({message: "Blogs fetched successfully", blogs: blogsWithImages});
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
};