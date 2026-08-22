import { Router } from 'express';
import { login, registerUser } from '../controllers/auth.controllers.js';
import { validate } from '../middlewares/validators.middleware.js';
import { userRegisterValidator } from '../validators/user-validators.js';

const router = Router();

router.route('/register').post(userRegisterValidator(), validate, registerUser);
router.route('/login').post(login);

export default router;
