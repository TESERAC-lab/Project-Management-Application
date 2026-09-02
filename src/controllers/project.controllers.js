import { User } from '../models/user.models.js';
import { Project } from '../models/project.models.js';
import { ProjectMember } from '../models/projectMembers.models.js';
import { apiResponse } from '../utils/api-Response.js';
import { asyncHandlers } from '../utils/async-handlers.js';
import { apiError } from '../utils/api-Errors.js';

const getProject = asyncHandlers(async (req, res) => {
  //test
});

const getProjectById = asyncHandlers(async (req, res) => {
  //test
});

const createProject = asyncHandlers(async (req, res) => {
  //test
});

const updateProject = asyncHandlers(async (req, res) => {
  //test
});

const deleteProject = asyncHandlers(async (req, res) => {
  //test
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
