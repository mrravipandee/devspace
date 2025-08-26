// import mongoose from "mongoose";

// const SocialHandleSchema = new mongoose.Schema({
//   platform: { type: String, required: true },
//   url: { type: String, required: true },
// }, { _id: false });

// const UsefulLinkSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   url: { type: String, required: true },
// }, { _id: false });

// const UserSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   username: { type: String, required: true, unique: true },
//   email:    { type: String, required: true, unique: true },
//   password: { type: String, required: true },

//   profileImage: { type: String, default: "" },
//   profileImagePublicId: { type: String, default: "" },
//   location: { type: String, default: "" },
//   bio: { type: String, default: "" },
//   availableForWork: { type: Boolean, default: false },

//   socialHandles: {
//     type: [SocialHandleSchema],
//     default: [],
//     validate: [(val: any[]) => val.length <= 15, '{PATH} exceeds 15 handles']
//   },

//   usefulLinks: {
//     type: [UsefulLinkSchema],
//     default: [],
//     validate: [(val: any[]) => val.length <= 50, '{PATH} exceeds 50 links']
//   },

//   profileCompleted: { type: Boolean, default: false }
// }, { timestamps: true });

// export default mongoose.models.User || mongoose.model("User", UserSchema);


import mongoose, { Schema, Document } from "mongoose";

interface ISocialHandle {
  platform: string;
  url: string;
}

interface IUsefulLink {
  title: string;
  url: string;
}

export interface IUser extends Document {
  fullName: string;
  username: string;
  email: string;
  password: string;
  profileImage: string;
  profileImagePublicId: string;
  location: string;
  bio: string;
  availableForWork: boolean;
  socialHandles: ISocialHandle[];
  usefulLinks: IUsefulLink[];
  profileCompleted: boolean;
}

const SocialHandleSchema = new Schema<ISocialHandle>(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const UsefulLinkSchema = new Schema<IUsefulLink>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    profileImage: { type: String, default: "" },
    profileImagePublicId: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
    availableForWork: { type: Boolean, default: false },

    socialHandles: {
      type: [SocialHandleSchema],
      default: [],
      validate: [
        (val: ISocialHandle[]) => val.length <= 15,
        "{PATH} exceeds 15 handles",
      ],
    },

    usefulLinks: {
      type: [UsefulLinkSchema],
      default: [],
      validate: [
        (val: IUsefulLink[]) => val.length <= 50,
        "{PATH} exceeds 50 links",
      ],
    },

    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.User<IUser> ||
  mongoose.model<IUser>("User", UserSchema);
