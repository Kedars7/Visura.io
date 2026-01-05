const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //if anything is empty
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const tokenData = {
      userId: newUser._id,
    };  

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });


      return res
      .status(200)
      .cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        secure: process.env.NODE_ENV === "production"
      })
      .json({
        message: "User registered successfully",
        newUser
      });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Wrong email",
      });
    }

    const passMatch = await bcrypt.compare(password, user.password);

    if (!passMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        secure: process.env.NODE_ENV === "production"
      })
      .json({
        user
      });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const logout = (req, res) => {
  try {
    return res.status(200).cookie("token", "", { 
      maxAge: 0,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production"
    }).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const checkLogin = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ loggedIn: false });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(payload.userId).select("-password");
    if (!user) return res.json({ loggedIn: false });
    return res.json({ loggedIn: true, user });
  }
  catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
}

const updateCredits = async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || amount === undefined) {
    return res.status(400).json({ message: "User ID and amount are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.credits += amount;
    await user.save();

    return res.status(200).json({ message: "Credits updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updatePlan = async (req, res) => {
  const { userId} = req.body;

  if (!userId ) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.plan = 'premium';
    await user.save();

    return res.status(200).json({ message: "Plan updated successfully", user });

  }
  catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { register, login, logout, checkLogin, updateCredits, updatePlan };