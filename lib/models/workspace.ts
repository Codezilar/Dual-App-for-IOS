import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const workspaceMemberSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: ["OWNER", "ADMIN", "MEMBER", "VIEWER"],
      default: "MEMBER"
    },
    joinedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const workspaceFolderSchema = new Schema(
  {
    name: { type: String, required: true },
    color: { type: String, default: "#64748b" }
  },
  { timestamps: true }
);

const workspaceSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    members: [workspaceMemberSchema],
    folders: [workspaceFolderSchema]
  },
  { timestamps: true }
);

export type WorkspaceDocument = InferSchemaType<typeof workspaceSchema>;
export const Workspace: Model<WorkspaceDocument> =
  mongoose.models.Workspace ?? mongoose.model<WorkspaceDocument>("Workspace", workspaceSchema);
