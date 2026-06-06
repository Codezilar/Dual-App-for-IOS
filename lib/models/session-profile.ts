import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const sessionProfileSchema = new Schema(
  {
    profileKey: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    cookieStore: { type: String, required: true, unique: true },
    storageBucket: { type: String, required: true, unique: true },
    cacheNamespace: { type: String, required: true, unique: true },
    userAgent: { type: String },
    proxyConfig: { type: Schema.Types.Mixed },
    encryptedMeta: { type: Schema.Types.Mixed },
    storageBytes: { type: Number, default: 0 },
    lastSyncedAt: { type: Date }
  },
  { timestamps: true }
);

sessionProfileSchema.index({ userId: 1, updatedAt: -1 });

export type SessionProfileDocument = InferSchemaType<typeof sessionProfileSchema>;
export const SessionProfile: Model<SessionProfileDocument> =
  mongoose.models.SessionProfile ??
  mongoose.model<SessionProfileDocument>("SessionProfile", sessionProfileSchema);
