import { User } from '../models/user.models.js';
import { Project } from '../models/project.models.js';
import { Task } from '../models/task.models.js';
import { subTask } from '../models/subTask.models.js';
import { apiResponse } from '../utils/api-Response.js';
import { asyncHandlers } from '../utils/async-handlers.js';
import { apiError } from '../utils/api-Errors.js';
import mongoose from 'mongoose';
import { AvaulableUserRole, UserRoleEnum } from '../utils/Fixed.js';

const getTask = asyncHandlers(async (req, res) => {
  //chacha
});
const createTask = asyncHandlers(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new apiError(404, 'Project not found');
  }
  const files = req.files || [];
  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${files.originalname}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });
  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.User._id),
  });
  return res.status(201).json(new apiResponse(201, task, 'Task created successfully'));
});
const getTaskById = asyncHandlers(async (req, res) => {
  //chacha
});
const updateTask = asyncHandlers(async (req, res) => {
  //chacha
});
const deleteTask = asyncHandlers(async (req, res) => {
  //chacha
});
const createSubTask = asyncHandlers(async (req, res) => {
  //chacha
});
const deleteSubTask = asyncHandlers(async (req, res) => {
  //chacha
});
const updateSubTask = asyncHandlers(async (req, res) => {
  //chacha
});

export {
  getTask,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  deleteSubTask,
  updateSubTask,
};
