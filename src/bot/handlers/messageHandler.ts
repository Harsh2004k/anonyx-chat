import { Context } from "grammy";
import {
  getOrCreateUser,
  handleProfileUpdate,
  handleProfileInput,
  forwardMessageToPartner,
} from "../utils";

export async function handleMessage(ctx: Context) {
  if (!ctx.message || !ctx.message.text) return;

  const user = await getOrCreateUser(ctx);
  if (user.pendingUpdate) {
    await handleProfileUpdate(ctx, user);
  } else if (!user.isProfileComplete) {
    await handleProfileInput(ctx, user);
  } else if (user.currentPartner) {
    await forwardMessageToPartner(ctx, user);
  } else {
    await ctx.reply(
      "You're not in a chat. Use /chat to start a new conversation or /update to modify your profile."
    );
  }
}
