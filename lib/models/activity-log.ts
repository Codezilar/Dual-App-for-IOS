import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const activityLogSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "INSTANCE_CREATED",
        "INSTANCE_OPENED",
        "INSTANCE_DUPLICATED",
        "INSTANCE_RENAMED",
        "INSTANCE_DELETED",
        "PROFILE_CREATED",
        "PROFILE_CLEARED",
        "WORKSPACE_UPDATED",
        "USER_INVITED",
        "STORAGE_WARNING"
      ],
      required: true,
      index: true
    },
    message: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    instanceId: { type: Schema.Types.ObjectId, ref: "AppInstance" }
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });

export type ActivityLogDocument = InferSchemaType<typeof activityLogSchema>;
export const ActivityLog: Model<ActivityLogDocument> =
  mongoose.models.ActivityLog ?? mongoose.model<ActivityLogDocument>("ActivityLog", activityLogSchema);
