const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register
const registerUser = async (req, res) => {
  let { userName, email, password } = req.body;

  // ✅ Trim here
  userName = userName?.trim();
  email = email?.trim();

  if (!userName || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username is already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res
        .status(400)
        .json({ success: false, message: `${field} is already taken` });
    }
    res
      .status(500)
      .json({ success: false, message: "Failed to register user" });
  }
};

// login
const Userlogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Does not exist! Please register first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password! Please try again",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 3600000,
      })
      .json({
        success: true,
        message: "Logged in successfully",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          userName: user.userName,
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

//logout
const logoutUser = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    })
    .json({ success: true, message: "Logged out successfully" });
};

//auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized User!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      userName: decoded.userName,
    };
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized User!" });
  }
};

module.exports = {
  registerUser,
  Userlogin,
  logoutUser,
  authMiddleware,
};
