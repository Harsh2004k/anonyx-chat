import { Context } from "grammy";
import { privacyPolicy } from "../../config";

export async function handlePrivacy(ctx: Context) {
  await ctx.reply(privacyPolicy);
}
