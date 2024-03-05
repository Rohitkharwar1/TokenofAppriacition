import asyncHandler from "express-async-handler";
import User from "../model/user.js";
import generateToken from "./../utils/generateToken.js";

// @route    -  POST /api/users/login
// @desc     -  Authenticate a user and generate an access token
const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      status: res.statusCode,
      message: "Logged In.",
      meta: "",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        wallet: user.wallet,
        token: generateToken(res, user._id),
      },
    });
  } else {
    res.status(401).json({
      status: res.statusCode,
      message: "Invalid Email or Password",
      meta: "",
      data: null,
    });
    throw new Error("Invalid Email or Password");
  }
});

// @route   -  POST /api/users/
// @desc    -  Create a new user
const createUser = asyncHandler(async (req, res, next) => {
  const { name, email, userType, wallet, password } = req.body;

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    res.status(403);
    throw new Error("User Already Exists");
  }

  //   if (password?.length < 6) {
  //     res.status(403);
  //     throw new Error("Password must be at least 6 characters long.");
  //   }

  const user = await User.create({ name, email, userType, wallet, password });

  if (user) {
    res.json({
      status: res.statusCode,
      message: "User Created.",
      meta: "",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        wallet: user.wallet,
        token: generateToken(res, user._id),
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

// @route   -  POST /api/users/logout
const logoutUser = asyncHandler(async (req, res, next) => {
  res.json({
    message: "Logout User",
  });
});

// @route   -  GET /api/users/profile
const userProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      status: res.statusCode,
      message: "Fetch Profile Successfully",
      meta: "",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        wallet: user.wallet,
        createdAt: user.createdAt,
      },
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @route   -  PUT /api/users/profile
const updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, userType, password } = req.body;
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    if (req.body.userType) {
      user.userType = userType;
    }
    if (req.body.password) {
      user.password = password;
    }
    const updatedUser = await user.save();
    res.json({
      status: res.statusCode,
      message: "Profile Update Successfully",
      meta: "",
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        userType: updatedUser.userType,
        token: generateToken(res, updatedUser._id),
      },
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @route   -  GET /api/users/:id
const getUser = asyncHandler(async (req, res, next) => {
  res.json({
    message: "Get A User",
  });
});

// @route   -  GET /api/users/
// @desc    -  Get All users based on query
const getAllUser = asyncHandler(async (req, res, next) => {
  const { page = 1, perPage = 10 } = req.query;
  const loggedInUser = req.user;

  try {
    let query = {};

    if (loggedInUser.userType === "manager") {
      query = { userType: "member" };
    } else if (loggedInUser.userType === "supermanager") {
      // For super managers, show all users except other super managers
      query = { userType: { $ne: "supermanager" } };
    } else {
      return res.status(400).json({
        message: "Invalid user type",
        status: "error",
      });
    }

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / perPage);

    if (page > totalPages) {
      return res.status(400).json({
        message: "Invalid page number",
        status: "error",
      });
    }

    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    res.status(200).json({
      message: "Users fetched successfully",
      status: res.statusCode,
      meta: null,
      data: {
        total: totalUsers,
        perPage: perPage,
        page: Number(page),
        totalPages: totalPages,
        users: users,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching users",
      status: "error",
    });
  }
});

export {
  authUser,
  createUser,
  logoutUser,
  userProfile,
  updateUser,
  getUser,
  getAllUser,
};
