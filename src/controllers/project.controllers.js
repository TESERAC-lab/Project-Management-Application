import { User } from '../models/user.models.js';
import { Project } from '../models/project.models.js';
import { ProjectMember } from '../models/projectMembers.models.js';
import { apiResponse } from '../utils/api-Response.js';
import { asyncHandlers } from '../utils/async-handlers.js';
import { apiError } from '../utils/api-Errors.js';
import mongoose from 'mongoose';
import { UserRoleEnum } from '../utils/Fixed.js';

const getProject = asyncHandlers(async (req, res) => {
  //test
});

const getProjectById = asyncHandlers(async (req, res) => {
  //test
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
  const {projectId} = req.params
  const project = await Project.findByIdAndDelete(projectId)

  if (!project) {
    throw new apiError(404, 'Project not found');
  }

  return res.status(200).json(200, project , 'Project deleted successfully');
});

const addMembersToProject = asyncHandlers(async (req, res) => {
  //test
});

const getProjectMembers = asyncHandlers(async (req, res) => {
  //test
});

const updateMemberRole = asyncHandlers(async (req, res) => {
  //test
});

const deleteMember = asyncHandlers(async (req, res) => {
  //test
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
