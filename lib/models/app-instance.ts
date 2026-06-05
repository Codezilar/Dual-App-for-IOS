import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const appInstanceSchema = new Schema(
  {
    name: { type: String, required: true },
    appType: { type: String, required: true, index: true },
    launchUrl: { type: String, required: true },
    logoUrl: { type: String },
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    folderId: { type: Schema.Types.ObjectId },
    profileId: { type: Schema.Types.ObjectId, ref: "SessionProfile", required: true, index: true },
    cookieStore: { type: String, required: true },
    status: {
      type: String,
      enum: ["ONLINE", "OFFLINE", "SUSPENDED", "ERROR"],
      default: "OFFLINE",
      index: true
    },
    favorite: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0 },
    lastActivity: { type: Date }
  },
  { timestamps: true }
);

appInstanceSchema.index({ workspaceId: 1, appType: 1 });

export type AppInstanceDocument = InferSchemaType<typeof appInstanceSchema>;
export const AppInstance: Model<AppInstanceDocument> =
  mongoose.models.AppInstance ?? mongoose.model<AppInstanceDocument>("AppInstance", appInstanceSchema);
