import { body } from 'express-validator';

const userRegisterValidators = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Emial is invalid '),
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3 })
      .withMessage('Minimum character length required is 3')
      .isLowercase()
      .withMessage('Username must be in lower case'),
    body('password').trim().notEmpty().withMessage('Password is required'),
    body('fullname').trim().notEmpty().withMessage('Fullname is required'),
  ];
};

const userLoginValidators = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email is invalid'),

    body('password').trim().notEmpty().withMessage('Password is required'),
  ];
};

const userChangeCurrentPassword = () => {
  return [
    body('oldPassword').notEmpty().withMessage('Old password is required'),
    body('newPassword').notEmpty().withMessage('New password is required'),
  ];
};



export { userRegisterValidators, userLoginValidators, userChangeCurrentPassword };
