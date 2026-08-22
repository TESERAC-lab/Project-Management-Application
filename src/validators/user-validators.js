import { body } from 'express-validator';

const userRegisterValidator = () => {
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

export { userRegisterValidator };
