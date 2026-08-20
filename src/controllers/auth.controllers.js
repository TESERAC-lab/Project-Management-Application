import { User } from '../models/user.models.js';
import { apiResponse } from '../utils/api-Response.js';
import { asyncHandlers } from '../utils/async-handlers.js';
import { apiError } from '../utils/api-Errors.js';

const registerUser = asyncHandlers(async (req, res) => {
  const { email, username, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new apiError(409, 'User with email or username already registered', []);
  }
  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });
});
