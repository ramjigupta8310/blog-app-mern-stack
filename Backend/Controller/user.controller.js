import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

// User Registration
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    // Convert Email To Lowercase
    const lowerCaseEmail = email?.toLowerCase();

    // Check All Fields Are Provided
    if (!email || !password || !confirmPassword || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate Email Format
    if (!validator.isEmail(lowerCaseEmail)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Validate Name Format (Only Alphabets, Minimum Length 3)
    const nameRegex = /^[a-zA-Z]{3,}[a-zA-Z\s]*$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({
        message:
          "Name must start with alphabets and be at least 3 characters long, and can contain spaces.",
      });
    }

    // Check If User Already Exists
    const existingUser = await User.findOne({ email: lowerCaseEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already registered.Please login" });
    }

    // Check Password and Confirm Password Match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password do not match" });
    }

    // Check Password Strength
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain 1 letter, 1 number, and 1 special character !@#$%^&*",
      });
    }

    // Hash The Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save The User In The Database
    const newUser = new User({
      name,
      email: lowerCaseEmail,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later",
    });
  }
};

// User Login
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Convert Email To Lowercase
    const lowerCaseEmail = email?.toLowerCase();

    // Check If Email And Password Are Provided
    if (!lowerCaseEmail || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Validate Email Format
    if (!validator.isEmail(lowerCaseEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Find User By Email
    const user = await User.findOne({ email: lowerCaseEmail });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Compare Password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, name: user.name }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiry time
    );

    // Send success response with token
    res.status(200).json({
      message: "Login successful!",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later",
    });
  }
};

// Varify Email For Password Reset
export const varifyEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Convert Email To Lowercase
    const lowerCaseEmail = email?.toLowerCase();

    // Check Email Provided Or Not
    if (!email) {
      return res.status(400).json({ message: "Email field cannot be empty" });
    }

    // Validate Email Format
    if (!validator.isEmail(lowerCaseEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check If User Exists
    const user = await User.findOne({ email: lowerCaseEmail });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });
    }

    // Send Varify Email Response
    res.status(202).json({
      message: "Email varified successfully, Please reset your password",
    });

  } catch (error) {
    console.error("Error during varify email:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later",
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    // Convert Email To Lowercase
    const lowerCaseEmail = email?.toLowerCase();

    // Check If Email, New Password, And Confirm Password Are Provided
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check If New Password And Confirm Password Match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password do not match" });
    }

    // Check Password Strength
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain 1 letter, 1 number, and 1 special character !@#$%^&*",
      });
    }

    // Hash The New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update The User's Password In The Database
    await User.updateOne(
      { email: lowerCaseEmail },
      { password: hashedPassword }
    );

    return res.status(200).json({
      message:
        "Password reset successful!",
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later"
    });
  }
};
