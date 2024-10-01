import { Context } from "grammy";
import { getOrCreateUser, askNextProfileQuestion } from "../utils";
import { InlineKeyboard } from "grammy";

export async function handleStart(ctx: Context) {
  const user = await getOrCreateUser(ctx);
  if (!user.agreedToTerms) {
    const keyboard = new InlineKeyboard()
      .text("I Agree", "agree_terms")
      .text("View Rules", "view_rules")
      .text("View Privacy Policy", "view_privacy");

    await ctx.reply(
      "Welcome! Before we begin, please agree to our rules and privacy policy.",
      { reply_markup: keyboard }
    );
  } else if (user.isProfileComplete) {
    await ctx.reply(`Welcome back, ${user.name}! Use /chat to start chatting.`);
  } else {
    await ctx.reply("Welcome! Let's set up your profile for anonymous chat.");
    await askNextProfileQuestion(ctx, user);
  }
}
