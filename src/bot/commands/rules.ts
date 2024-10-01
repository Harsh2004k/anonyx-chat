import { Context } from "grammy";
import { botRules } from "../../config";

export async function handleRules(ctx: Context) {
  await ctx.reply(botRules);
}
