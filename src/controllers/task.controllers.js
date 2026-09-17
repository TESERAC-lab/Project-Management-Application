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
  //chacha
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
