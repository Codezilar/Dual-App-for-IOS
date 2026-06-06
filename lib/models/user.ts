import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    image: { type: String },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["OWNER", "ADMIN", "MEMBER", "VIEWER"],
      default: "MEMBER",
      index: true
    }
  },
  { timestamps: true }
);

userSchema.pre("validate", function normalizeEmail(next) {
  if (this.email) this.email = this.email.toLowerCase().trim();
  next();
});

export type UserDocument = InferSchemaType<typeof userSchema>;
export const User: Model<UserDocument> =
  mongoose.models.User ?? mongoose.model<UserDocument>("User", userSchema);
