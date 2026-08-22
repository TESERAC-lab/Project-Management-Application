import { Router } from 'express';
import { login, registerUser } from '../controllers/auth.controllers.js';
import { validate } from '../middlewares/validators.middleware.js';
import { userRegisterValidators ,userLoginValidators } from '../validators/index.js';

const router = Router();

router.route('/register').post(userRegisterValidators(), validate, registerUser);
router.route('/login').post(userLoginValidators(),validate,login);

export default router;
