import { Router } from 'express';
import { loginUser, registerUser, logoutUser } from '../controllers/auth.controllers.js';
import { validate } from '../middlewares/validators.middleware.js';
import { userRegisterValidators, userLoginValidators } from '../validators/index.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(userRegisterValidators(), validate, registerUser);
router.route('/login').post(userLoginValidators(), validate, loginUser);

//Secure routes
router.route('/logout').post(verifyJWT, logoutUser);

export default router;
