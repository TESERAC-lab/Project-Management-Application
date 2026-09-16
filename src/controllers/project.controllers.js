import { User } from '../models/user.models.js';
import { Project } from '../models/project.models.js';
import { ProjectMember } from '../models/projectMembers.models.js';
import { apiResponse } from '../utils/api-Response.js';
import { asyncHandlers } from '../utils/async-handlers.js';
import { apiError } from '../utils/api-Errors.js';
import mongoose from 'mongoose';
import { AvaulableUserRole, UserRoleEnum } from '../utils/Fixed.js';

const getProject = asyncHandlers(async (req, res) => {
  const projects = await ProjectMember.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: 'projects',
        localField: 'projects',
        foreignField: '_id',
        as: 'projects',
        pipeline: [
          {
            $lookup: {
              from: 'projectmembers',
              localField: '_id',
              foreignField: 'projects',
              as: 'projectsmembers',
            },
          },
          {
            $addFields: {
              members: {
                $size: 'projectsmembers',
              },
            },
          },
        ],
      },
    },
    {
      $unwind: '$project',
    },
    {
      $project: {
        project: {
          _id: 1,
          name: 1,
          description: 1,
          members: 1,
          createdAt: 1,
          createdBy: 1,
        },
        role: 1,
        _id: 0,
      },
    },
  ]);

  return res.status(200).json(new apiResponse(200, projects, 'Projects fetched successfully'));
});

const getProjectById = asyncHandlers(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new apiError(404, 'Project not found');
  }

  return res.status(200).json(new apiResponse(200, porject, 'Project fetched successfully'));
});

const createProject = asyncHandlers(async (req, res) => {
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    createdBy: new mongoose.Types.ObjectId(req.User._id),
  });

  await ProjectMember.create({
    user: new mongoose.Types.ObjectId(req.user._id),
    project: new mongoose.Types.ObjectId(project._id),
    role: UserRoleEnum.ADMIN,
  });

  return res.status(201).josn(new apiResponse(201, project, 'Prject created successfully'));
});

const updateProject = asyncHandlers(async (req, res) => {
  const { name, description } = req.body;
  const { projectId } = req.params;

  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      name,
      description,
    },
    {
      new: true,
    },
  );

  if (!project) {
    throw new apiError(404, 'Project not found');
  }

  return res.status(200).json(200, project, 'Project updated successfully');
});

const deleteProject = asyncHandlers(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    throw new apiError(404, 'Project not found');
  }

  return res.status(200).json(200, project, 'Project deleted successfully');
});

const addMembersToProject = asyncHandlers(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(404, 'User does not exists');
  }

  await ProjectMember.findByIdAndUpdate(
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
    },

    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
      role: role,
    },
    {
      new: true,
      upsert: true,
    },
  );

  return (res.status(201), json(new apiResponse(201, {}, 'Project member added successfully')));
});

const getProjectMembers = asyncHandlers(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(req.params);

  if (!project) {
    throw new apiError(404, 'Project not found');
  }

  const porjectMembers = await ProjectMember.aggregate([
    {
      $match: {
        porject: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        user: {
          $arrayElemAt: ['$user', 0],
        },
      },
    },
    {
      $project: {
        porject: 1,
        user: 1,
        role: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 0,
      },
    },
  ]);

  return res.status(200).josn(new apiResponse(200, porjectMembers, 'Project members fetched'));
});

const updateMemberRole = asyncHandlers(async (req, res) => {
  const { projectId, userId } = req.params;
  const { newRole } = req.body;

  if (!AvaulableUserRole.includes(newRole)) {
    throw new apiError(400, 'Invalid role');
  }

  let projectMember = await ProjectMember.findOne({
    porject: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId),
  });

  if (!projectMember) {
    throw new apiError(400, 'Project member not found');
  }

  projectMember = await ProjectMember.findByIdAndUpdate(
    projectMember._id,
    {
      role: newRole,
    },
    {
      new: true,
    },
  );
  if (!projectMember) {
    throw new apiError(400, 'Project member not found');
  }

  return res
    .status(200)
    .josn(new apiResponse(200, projectMember, 'Project member role updated successfully'));
});

const deleteMember = asyncHandlers(async (req, res) => {
  const { projectId, userId } = req.params;

  let projectMember = await ProjectMember.findOne({
    porject: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId),
  });

  if (!projectMember) {
    throw new apiError(400, 'Project member not found');
  }

  projectMember = await ProjectMember.findByIdAndDelete(projectMember._id);
  if (!projectMember) {
    throw new apiError(400, 'Project member not found');
  }

  return res
    .status(200)
    .josn(new apiResponse(200, projectMember, 'Project member deleted successfully'));
});

export {
  getProject,
  getProjectById,
  getProjectMembers,
  createProject,
  updateProject,
  updateMemberRole,
  deleteMember,
  deleteProject,
  addMembersToProject,
};
