import mongoose, { Schema } from 'mongoose';
import { AvailableTaskStatus, TaskStatusEnum } from '../utils/Fixed.js';

const taskschema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    project: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: AvailableTaskStatus,
      default: TaskStatusEnum.TODO,
    },
    attachments: {
      type: [
        {
          url: String,
          MimeType: String,
          size: Number,
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export const Task = mongoose.model('Task', taskschema);
