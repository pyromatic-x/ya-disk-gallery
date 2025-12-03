import mongoose, { Model, model, Schema } from "mongoose";

export interface TFolder {
  _id: string;
  first_name: string;
  names: Array<string>;
  path: string;
  preview_url: string;
  tags: Array<string>;
  links: Array<string>;
  views: number;
  created_at: string;
  created_by: string;
  last_scanned_at: string;
  last_updated_at: string;
}

const folderSchema = new Schema<TFolder>(
  {
    names: Array,
    path: String,
    preview_url: String,
    tags: Array,
    links: Array,
    views: { type: Number, default: 0 },
    created_at: Date,
    created_by: mongoose.Types.ObjectId,
    last_scanned_at: Date,
    last_updated_at: Date,
  },
  {
    timestamps: false,
    collection: "folders",
    toJSON: {
      virtuals: true,
      transform: (_doc, ret, _options) => {
        ret._id = ret._id.toString();
        ret.created_by = ret.created_by ? ret.created_by.toString() : "";
        ret.tags = ret.tags.map((t) => t.toString());
        ret.first_name = ret.names && ret.names.length > 0 ? ret.names[0] : "";
      },
    },
    toObject: {
      virtuals: true,
    },
  },
);

folderSchema.virtual("first_name").get(function () {
  return this.names && this.names.length > 0 ? this.names[0] : "";
});

export const Folder: Model<TFolder> = mongoose.models.Folder || model("Folder", folderSchema);
