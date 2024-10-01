import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  age?: number;
  gender?: string;
  location?: string;
  bio?: string;
  isProfileComplete: boolean;
  currentPartner: number | null;
  isSearching: boolean;
  agreedToTerms: boolean;
  pendingUpdate?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  telegramId: { type: Number, unique: true },
  username: String,
  firstName: String,
  lastName: String,
  name: String,
  age: Number,
  gender: String,
  location: String,
  bio: String,
  isProfileComplete: { type: Boolean, default: false },
  currentPartner: { type: Number, default: null },
  isSearching: { type: Boolean, default: false },
  agreedToTerms: { type: Boolean, default: false },
  pendingUpdate: String,
});

export const User = mongoose.model<IUser>("User", userSchema);
