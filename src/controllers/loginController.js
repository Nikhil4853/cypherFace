const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const userActivityController = require('./userActivityContoller');
const { generateToken } = require('./userActivityContoller');
const { generateJwtToken } = require('../utils/authUtils');


async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      await userActivityController.logUserActivity(user?._id, 'Login', '/login', 404);
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    await userActivityController.logUserActivity(user._id, 'Login', '/login', 200);

    const refreshToken = generateJwtToken({ userId: user._id });

    user.token = refreshToken;
    await user.save();

    res.json({ success: true, user: user.toObject(), message: "Login successful", refreshToken: refreshToken });
  } catch (error) {
    await userActivityController.logUserActivity(null, 'Login', '/login', 500);
    console.error('Error logging in:', error);// TODO: Check with Rmya
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}


async function logoutUser(req, res) {
    const userId = req.body.userId; 
  try {
    const user = await UserModel.findById(userId);
    user.token = undefined;
    await user.save();

    res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function getUser(req, res) {
  try {
    const users = await UserModel.find({});
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

 
async function makePayment(req, res) {
  try {
      const { userId, amount } = req.body;
      const user = await UserModel.findById(userId);
      if (!amount || amount <= 0) {
          return res.status(400).json({ error: 'Please enter a valid amount' });
      }
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      // Update user balance and add payment to the payments array
      user.balance += amount;
      user.payments.push({ amount: amount, PaymentDate: new Date() });
      await user.save();
      res.status(200).json({ message: 'Payment successful', user });
  } catch (error) {
      console.error('Error making payment:', error);
      res.status(500).json({ error: 'Failed to make payment' });
  }
}


module.exports = { loginUser, logoutUser, getUser, makePayment };
