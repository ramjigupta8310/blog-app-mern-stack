import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const verifyToken = (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Token ko verify karte hain
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }

      // Agar token valid hai, user ka data bheje
      res.status(200).json({ message: "Token is valid", user: decoded });
    });
  } catch (error) {
    console.error('Error while verifying token:', error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default verifyToken;
