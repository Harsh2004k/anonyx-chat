import { Context } from "grammy";
import { getOrCreateUser, askNextProfileQuestion } from "../utils";
import { InlineKeyboard } from "grammy";
import { botRules, privacyPolicy } from "../../config";

export async function handleCallbackQuery(ctx: Context) {
  if (!ctx.callbackQuery?.data) return;

  const user = await getOrCreateUser(ctx);
  const data = ctx.callbackQuery.data;

  if (data.startsWith("update_")) {
    const field = data.split("_")[1];
    if (field === "gender") {
      const genderKeyboard = new InlineKeyboard()
        .text("Male", "gender_male")
        .text("Female", "gender_female");
      await ctx.reply("Select your gender:", { reply_markup: genderKeyboard });
    } else {
      await ctx.reply(`Please enter your new ${field}:`);
      user.pendingUpdate = field;
      await user.save();
    }
  } else if (data.startsWith("gender_")) {
    const gender = data.split("_")[1];
    user.gender = gender;
    await user.save();
    await ctx.answerCallbackQuery();
    await ctx.reply(`Gender set to: ${gender}`);
    await askNextProfileQuestion(ctx, user);
  } else if (data === "agree_terms") {
    user.agreedToTerms = true;
    await user.save();
    await ctx.answerCallbackQuery("Thank you for agreeing to our terms.");
    await ctx.reply("Great! Now let's set up your profile.");
    await askNextProfileQuestion(ctx, user);
  } else if (data === "view_rules") {
    await ctx.answerCallbackQuery();
    await ctx.reply(botRules);
  } else if (data === "view_privacy") {
    await ctx.answerCallbackQuery();
    await ctx.reply(privacyPolicy);
  }

  await ctx.answerCallbackQuery();
}
