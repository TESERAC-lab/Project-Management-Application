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
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new apiError(404, 'Project not found');
  }

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate('assignedTo', 'avatar username fullname');
  return res.status(201).json(new apiResponse(201, tasks, 'Task fetched successfully'));
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
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });
  const task = await Task.create({
    title,
    description,
    attachments,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.User._id),
  });
  return res.status(201).json(new apiResponse(201, task, 'Task created successfully'));
});
const getTaskById = asyncHandlers(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'assignedTo',
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'subtasks',
        localField: '_id',
        foreignField: 'task',
        as: 'subtasks',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'createdBy',
              foreignField: '_id',
              as: 'createdBy',
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ['$createdBy', 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ['$assignedTo', 0],
        },
      },
    },
  ]);

  if (!task || task.length === 0) {
    throw new apiError(404, 'Task not found');
  }

  return res.status(200).json(new apiResponse(200, task[0], 'Task fetched successfully'));
});
const updateTask = asyncHandlers(async (req, res) => {
  const { taskId } = req.params;

  const { title, description, assignedTo, status } = req.body;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new apiError(404, 'Task not found');
  }

  const updateData = {};

  if (title !== undefined) {
    updateData.title = title;
  }

  if (description !== undefined) {
    updateData.description = description;
  }

  if (status !== undefined) {
    updateData.status = status;
  }

  if (assignedTo !== undefined) {
    updateData.assignedTo = new mongoose.Types.ObjectId(assignedTo);
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json(new apiResponse(200, updatedTask, 'Task updated successfully'));
});
const deleteTask = asyncHandlers(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findByIdAndDelete(taskId);

  if (!task) {
    throw new apiError(404, 'Task not found');
  }

  return res.status(200).json(new apiResponse(200, task, 'Task deleted successfully'));
});
const createSubTask = asyncHandlers(async (req, res) => {
  const { taskId } = req.params;

  const { title } = req.body;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new apiError(404, 'Task not found');
  }

  const subtask = await subTask.create({
    title,
    task: new mongoose.Types.ObjectId(taskId),
    createdBy: new mongoose.Types.ObjectId(req.User._id),
  });

  return res.status(201).json(new apiResponse(201, subtask, 'Subtask created successfully'));
});
const deleteSubTask = asyncHandlers(async (req, res) => {
  const { subTaskId } = req.params;

  const deletedSubTask = await subTask.findByIdAndDelete(subTaskId);

  if (!deletedSubTask) {
    throw new apiError(404, 'Subtask not found');
  }

  return res.status(200).json(new apiResponse(200, deletedSubTask, 'Subtask deleted successfully'));
});
const updateSubTask = asyncHandlers(async (req, res) => {
  const { subTaskId } = req.params;

  const { title, isCompleted } = req.body;

  const updateData = {};

  if (title !== undefined) {
    updateData.title = title;
  }

  if (isCompleted !== undefined) {
    updateData.isCompleted = isCompleted;
  }

  const updatedSubTask = await subTask.findByIdAndUpdate(subTaskId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedSubTask) {
    throw new apiError(404, 'Subtask not found');
  }

  return res.status(200).json(new apiResponse(200, updatedSubTask, 'Subtask updated successfully'));
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
