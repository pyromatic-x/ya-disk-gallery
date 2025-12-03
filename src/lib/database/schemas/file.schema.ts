import mongoose, { Model, model, Schema } from "mongoose";

export interface TFile {
  _id: string;
  folder: mongoose.Types.ObjectId;
  name: string;
  file: string;
  media_type: string;
  mime_type: string;
  path: string;
  size: number;
  preview_url: string;
  views: number;
  md5: string;
  uploaded_by: string;
  created_at: string;
  seen_update: boolean;
  index: number;
  dimensions?: {
    width: number;
    height: number;
    orientation: "horizontal" | "vertical";
  };
}

const dimensionsSchema = new mongoose.Schema(
  {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    orientation: {
      type: String,
      enum: ["horizontal", "vertical"],
      required: true,
    },
  },
  {
    _id: false,
  },
);

const fileSchema = new Schema<TFile>(
  {
    folder: mongoose.Types.ObjectId,
    name: String,
    file: String,
    media_type: String,
    mime_type: String,
    path: String,
    size: Number,
    preview_url: String,
    md5: String,
    views: { type: Number, default: 0 },
    seen_update: { type: Boolean, default: true },
    created_at: Date,
    uploaded_by: mongoose.Types.ObjectId,
    dimensions: dimensionsSchema,
    index: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: false,
    collection: "files",
    toJSON: {
      virtuals: true,
      transform: (_doc, ret, _options) => {
        ret._id = ret._id.toString();
        ret.uploaded_by = ret.uploaded_by ? ret.uploaded_by.toString() : "";
      },
    },
  },
);

export const File: Model<TFile> = mongoose.models.File || model("File", fileSchema);
