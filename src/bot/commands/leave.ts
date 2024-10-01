import { Context } from "grammy";
import { getOrCreateUser } from "../utils";
import { User } from "../../database";

export async function handleLeave(ctx: Context) {
  const user = await getOrCreateUser(ctx);
  if (user.currentPartner) {
    const partner = await User.findOne({ telegramId: user.currentPartner });
    if (partner) {
      partner.currentPartner = null;
      await partner.save();
      await ctx.api.sendMessage(
        partner.telegramId,
        "Your chat partner has left the conversation."
      );
    }
    user.currentPartner = null;
    await user.save();
    await ctx.reply(
      "You've left the chat. Use /chat to start a new conversation."
    );
  } else {
    await ctx.reply("You're not in a chat.");
  }
}