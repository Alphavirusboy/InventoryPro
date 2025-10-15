import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin access required" });
  }
};

export const isCustomer = (req, res, next) => {
  if (req.user && (req.user.role === "customer" || req.user.role === "admin")) {
    next();
  } else {
    return res.status(403).json({ message: "Customer access required" });
  }
};
