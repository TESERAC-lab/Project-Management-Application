import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: string,
      },
      default: {
        url: `https://placehold.co/400x400`,
        localPath: '',
      },
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    fogotPasswrodToken: {
      type: String,
    },
    forgotPawssrodExpiry: {
      type: Date,
    },
    emailVerficationToken: {
      type: String,
    },
    emailVerficationExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);
