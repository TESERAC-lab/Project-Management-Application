import mongoose, { Schema } from 'mongoose';
import { AvaulableUserRole, UserRoleEnum } from '../utils/Fixed.js';

const projectMemberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    role: {
      type: String,
      enum: AvaulableUserRole,
      default: UserRoleEnum,
    },
  },
  { timestamps: true },
);

export const ProjectMember = mongoose.model('ProjectMember', projectMemberSchema);
