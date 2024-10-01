import { Context } from "grammy";
import {
  getOrCreateUser,
  findPartner,
  connectUsers,
  askNextProfileQuestion,
} from "../utils";

export async function handleChat(ctx: Context) {
  const user = await getOrCreateUser(ctx);
  if (!user.isProfileComplete) {
    await ctx.reply("Please complete your profile first.");
    await askNextProfileQuestion(ctx, user);
    return;
  }

  if (user.currentPartner) {
    await ctx.reply(
      "You're already in a chat. Use /leave to end the current chat."
    );
    return;
  }

  user.isSearching = true;
  await user.save();
  await ctx.reply("Searching for a chat partner...");

  const partner = await findPartner(user);
  if (partner) {
    await connectUsers(user, partner);
  }
}
