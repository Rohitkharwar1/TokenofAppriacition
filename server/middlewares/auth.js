import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "./../model/user.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = await User.findById(decoded.userId).select("-password");
      console.log(req.user);
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not Authorized, Token Failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not Authorized, No Token");
  }
});

const admin = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = await User.findById(decoded.userId).select("-password");
      console.log(req.user);
      if (req.user.userType === "admin") {
        next();
      } else {
        res.status(401);
        throw new Error("Not Authorized, No Access");
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not Authorized, Token Failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not Authorized, No Token");
  }
});
export { protect, admin };
