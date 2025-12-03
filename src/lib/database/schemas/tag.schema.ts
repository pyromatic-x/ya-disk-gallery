import mongoose, { Model, model, Schema } from "mongoose";

export interface TTag {
  _id: string;
  value: string;
  created_at: string;
  updated_at: string;
}

const tagSchema = new Schema<TTag>(
  {
    value: String,
    created_at: String,
    updated_at: String,
  },
  {
    timestamps: false,
    collection: "tags",
    toJSON: {
      virtuals: true,
      transform: (_doc, ret, _options) => {
        ret._id = ret._id.toString();
        ret.value = transformTag(ret.value);
      },
    },
  },
);

export const Tag: Model<TTag> = mongoose.models.Tag || model("Tag", tagSchema);

const transformTag = (sentence: string) => {
  if (typeof sentence !== "string" || sentence.length === 0) {
    return "";
  }

  const words = sentence.split("-");

  const capitalizedWords = words.map((word) => {
    if (word.length === 0) {
      return "";
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return capitalizedWords.join(" ");
};
