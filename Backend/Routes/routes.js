import express from 'express';
import { registerUser, resetPassword, userLogin, varifyEmail } from '../Controller/user.controller.js';
import varifyToken from '../Middlewares/varifyToken.middleware.js';
import authenticateUser from '../Middlewares/auth.Middleware.js';
import { createBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog, upload } from '../Controller/blog.controller.js';

const router = express.Router();

// User 
router.post('/user-register', registerUser);
router.post('/user-login', userLogin);
router.post('/varify-email', varifyEmail);
router.post('/reset-password', resetPassword)

// Verify Token 
router.get('/verify-token', varifyToken)

// Blogs
router.post("/create-blog", authenticateUser, upload.single("image"), createBlog);
router.get("/get-allBlogs", getAllBlogs);
router.get("/blog/:id", getBlogById);
router.delete("/delete-blog/:id", authenticateUser, deleteBlog);
router.put("/update-blog/:id", authenticateUser, upload.single("picture"), updateBlog);

export default router;
