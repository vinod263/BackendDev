import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Chat must belong to a user'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a chat title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index to improve query performance
chatSchema.index({ user: 1, createdAt: -1 });

const chatModel = mongoose.model('Chat', chatSchema);
export default chatModel;
