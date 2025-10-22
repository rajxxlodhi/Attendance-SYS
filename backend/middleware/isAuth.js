import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(400).json({ message: "User does not have a token" });

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) return res.status(400).json({ message: "User does not have a valid token" });

    req.userId = verifyToken.userId; 
    req.user = { id: verifyToken.userId };// match JWT payload
    next();
  } catch (error) {
    return res.status(400).json({ message: `isAuth middleware error: ${error.message}` });
  }
};

export default isAuth;
