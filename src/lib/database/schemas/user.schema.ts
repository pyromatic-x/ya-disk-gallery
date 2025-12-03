import mongoose, { Model, model, Schema } from "mongoose";

export interface TUser {
  _id: string;
  auth_date: number;
  first_name: string;
  hash: string;
  id: number;
  photo_url: string;
  username: string;
  approved?: boolean;
}

const userSchema = new Schema<TUser>(
  {
    auth_date: Number,
    first_name: String,
    hash: String,
    id: Number,
    photo_url: String,
    username: String,
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: false,
    collection: "users",
  },
);

export const User: Model<TUser> = mongoose.models.User || model("User", userSchema);
