import { User } from '../models/user.models.js';
import { ProjectMember } from '../models/projectMembers.models.js';
import { asyncHandlers } from '../utils/async-handlers.js';
import { apiError } from '../utils/api-Errors.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const verifyJWT = asyncHandlers(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new apiError(401, 'Unauthorized request');
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

export const validateProjectPermission = (roles = []) => {
  asyncHandlers(async (req, res, next) => {
    const { projectId } = req.params;

    if (!projectId) {
      throw new apiError(400, 'Project id is missing');
    }

    const project = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!project) {
      throw new apiError(400, 'Project not found');
    }

    const givenRole = project?.role;

    req.user.role = givenRole;

    if (!roles.includes(givenRole)) {
      throw new apiError(403, 'You do not have permission to perform this action ');
    }
  });
};
