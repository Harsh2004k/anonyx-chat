import { Context } from "grammy";
import { User, IUser } from "../../database/models/User";
import { bot } from "../botInstance";

export async function findPartner(user: IUser) {
  // const oppositeGender = user.gender === "male" ? "female" : "male";
  return await User.findOne({
    // gender: oppositeGender,
    isSearching: true,
    currentPartner: null,
    telegramId: { $ne: user.telegramId },
  });
}

export async function connectUsers(user1: IUser, user2: IUser) {
  user1.currentPartner = user2.telegramId;
  user2.currentPartner = user1.telegramId;
  user1.isSearching = false;
  user2.isSearching = false;
  await user1.save();
  await user2.save();

  await sendMessage(
    user1.telegramId,
    `You've been connected with ${user2.name}!`
  );
  await sendMessage(
    user2.telegramId,
    `You've been connected with ${user1.name}!`
  );
}

export async function forwardMessageToPartner(ctx: Context, user: IUser) {
  const partner = await User.findOne({ telegramId: user.currentPartner });
  if (partner) {
    await ctx.api.copyMessage(
      partner.telegramId,
      ctx.chat!.id,
      ctx.message!.message_id
    );
  }
}

export async function sendMessage(chatId: number, text: string) {
  try {
    await bot.api.sendMessage(chatId, text);
  } catch (error) {
    console.error(`Error sending message to ${chatId}: ${error}`);
  }
}
