import { Router } from 'express';
import {
  loginUser,
  registerUser,
  logoutUser,
  verifyEmail,
  refreshAccessToken,
  forgotPasswordRequest,
  reserForgotPassword,
  getCurrentUser,
  changeCurrentPassword,
  resendEmailVerification,
} from '../controllers/auth.controllers.js';
import { validate } from '../middlewares/validators.middleware.js';
import {
  userRegisterValidators,
  userLoginValidators,
  userChangeCurrentPasswordValidator,
  userForgotpasswordValidator,
  userResetForgotPasswordValidaotr,
} from '../validators/index.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

//Unsecured routes
router.route('/register').post(userRegisterValidators(), validate, registerUser);
router.route('/login').post(userLoginValidators(), validate, loginUser);
router.route('/verify-email:verificationToken').get(verifyEmail);
router.route('/refresh-token').post(refreshAccessToken);
router
  .route('/forgot-password')
  .post(userForgotpasswordValidator(), validate, forgotPasswordRequest);
router
  .route('/reset-password:resetToken')
  .post(userResetForgotPasswordValidaotr(), validate, reserForgotPassword);

//Secure routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/current-user').post(verifyJWT, getCurrentUser);
router
  .route('/change-password')
  .post(verifyJWT, userChangeCurrentPasswordValidator(), validate, changeCurrentPassword);
router.route('/resend-email-verification').post(verifyJWT, resendEmailVerification);

export default router;
