import { Router } from 'express';
import {
  getProject,
  getProjectById,
  getProjectMembers,
  createProject,
  updateProject,
  updateMemberRole,
  deleteMember,
  deleteProject,
  addMembersToProject,
} from '../controllers/project.controllers.js';
import { validate } from '../middlewares/validators.middleware.js';
import { addMemberToProjectValidaotr, createProjectValidaotr } from '../validators/index.js';
import { verifyJWT, validateProjectPermission } from '../middlewares/auth.middleware.js';
import { AvaulableUserRole, UserRoleEnum } from '../utils/Fixed.js';

const router = Router();

router.use(verifyJWT);

router.route('/').get(getProject).post(createProjectValidaotr(), validate, createProject);

router
  .route('/:projectId')
  .get(validateProjectPermission(AvaulableUserRole), getProjectById)
  .put(
    validateProjectPermission([UserRoleEnum.ADMIN]),
    createProjectValidaotr(),
    validate,
    updateProject,
  )

  .delete(validateProjectPermission([UserRoleEnum.ADMIN]), deleteProject);

router
  .route('/:projectId/members')
  .get(getProjectMembers)
  .post(
    validateProjectPermission([UserRoleEnum.ADMIN]),
    addMemberToProjectValidaotr(),
    validate,
    addMembersToProject,
  );

router
  .route('/:projectId/members/:userId')
  .put(validateProjectPermission([UserRoleEnum.ADMIN]), updateMemberRole)
  .delete(validateProjectPermission([UserRoleEnum.ADMIN]), deleteMember);
export default router;
