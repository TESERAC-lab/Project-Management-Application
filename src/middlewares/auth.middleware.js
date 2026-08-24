import { User } from '../models/user.models.js';
import { asyncHandlers } from '../utils/async-handlers.js';
import { apiError } from '../utils/api-Errors.js';
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandlers(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new apiError(401, 'Unauthorizzed request ');
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken -emailVerificationToken -emailVerificationExpiry',
    );
    if (!user) {
      throw new apiError(401, 'Invalid access token');
    }
    req.user = user;
    next();
  } catch (error) {
    throw new apiError(401, 'Invalid access token');
  }
});
