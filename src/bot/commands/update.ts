import { Context } from "grammy";
import { getOrCreateUser } from "../utils";
import { InlineKeyboard } from "grammy";

export async function handleUpdateProfile(ctx: Context) {
  const user = await getOrCreateUser(ctx);
  const keyboard = new InlineKeyboard()
    .text("Name", "update_name")
    .text("Age", "update_age")
    .row()
    .text("Gender", "update_gender")
    .text("Location", "update_location")
    .row()
    .text("Bio", "update_bio");

  await ctx.reply("What would you like to update?", { reply_markup: keyboard });
}