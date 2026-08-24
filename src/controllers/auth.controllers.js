import { User } from '../models/user.models.js';
import { apiResponse } from '../utils/api-Response.js';
import { asyncHandlers } from '../utils/async-handlers.js';
import { apiError } from '../utils/api-Errors.js';
import { emailVerificationMailgenContent, sendEmail } from '../utils/mail.js';

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(500, 'Something went wrong while generating access token');
  }
};

const registerUser = asyncHandlers(async (req, res) => {
  const { fullname, email, username, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new apiError(409, 'User with email or username already registered', []);
  }
  const user = await User.create({
    fullname,
    email,
    password,
    username,
    isEmailVerified: false,
  });

  const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: 'Please verify your email',
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get('host')}/api/v1/users/verify-email/${unHashedToken}`,
    ),
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken -emailVerificationToken -emailVerificationExpiry',
  );

  if (!createdUser) {
    throw new apiError(500, 'Something went wrong while registering the user');
  }

  return res
    .status(201)
    .json(
      new apiResponse(
        201,
        { user: createdUser },
        'User has been registered successfully and verification email has been sent to your email',
      ),
    );
});

const loginUser = asyncHandlers(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new apiError(400, 'Username or Email is required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(400, 'User does not exists');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(400, 'Invalid credentials');
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken -emailVerificationToken -emailVerificationExpiry',
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        'User logged in successfully',
      ),
    );
});

const logoutUser = asyncHandlers(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: '',
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new apiResponse(200, {}, 'User logged out'));
});

const getCurrentUser = asyncHandlers(async (req, res) => {
  return res.status(200).json(new apiResponse(200, req.user, 'Current user fetched successfully'));
});

const verifyEmail = asyncHandlers(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    throw new apiError(400, 'Email verification token is missing ');
  }
  let hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new apiError(400, 'Token is invalid or expired');
  }

  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  user.isEmailVerified = true;
  user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new apiResponse(
      200,
      {
        isEmailVerified: true,
      },
      'Email verified successfully',
    ),
  );
});
//const getCurrentUser = asyncHandlers(async (req, res) => {});

export {
  registerUser,
  generateAccessTokenAndRefreshToken,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyEmail,
};
