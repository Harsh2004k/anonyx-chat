import { Context } from "grammy";
import { User, IUser } from "../../database/models/User";
import { InlineKeyboard } from "grammy";

export async function getOrCreateUser(ctx: Context): Promise<IUser> {
  const telegramUser = ctx.from!;
  let user = await User.findOne({ telegramId: telegramUser.id });

  if (!user) {
    user = new User({
      telegramId: telegramUser.id,
      username: telegramUser.username,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
    });
    await user.save();
  }

  return user;
}

export async function askNextProfileQuestion(ctx: Context, user: IUser) {
  if (!user.name) {
    await ctx.reply("What's your name?");
  } else if (!user.age) {
    await ctx.reply("What's your age?");
  } else if (!user.gender) {
    const keyboard = new InlineKeyboard()
      .text("Male", "gender_male")
      .text("Female", "gender_female");
    await ctx.reply("What's your gender?", { reply_markup: keyboard });
  } else if (!user.location) {
    await ctx.reply("What's your location?");
  } else if (!user.bio) {
    await ctx.reply("Please provide a short bio about yourself.");
  } else {
    user.isProfileComplete = true;
    await user.save();
    await ctx.reply(
      "Great! Your profile is complete. Use /chat to start chatting!"
    );
  }
}

export async function handleProfileUpdate(ctx: Context, user: IUser) {
  const text = ctx.message?.text;
  if (!text) return;

  switch (user.pendingUpdate) {
    case "name":
      user.name = text;
      break;
    case "age":
      const age = parseInt(text);
      if (isNaN(age)) {
        await ctx.reply("Please provide a valid number for your age.");
        return;
      }
      user.age = age;
      break;
    case "location":
      user.location = text;
      break;
    case "bio":
      user.bio = text;
      break;
  }

  user.pendingUpdate = undefined;
  await user.save();
  await ctx.reply(
    `Your ${user.pendingUpdate} has been updated. Use /profile to view your current profile.`
  );
}

export async function handleProfileInput(ctx: Context, user: IUser) {
  const text = ctx.message?.text;
  if (!text) return;

  if (!user.name) {
    user.name = text;
  } else if (!user.age) {
    const age = parseInt(text);
    if (isNaN(age)) {
      await ctx.reply("Please provide a valid number for your age.");
      return;
    }
    user.age = age;
  } else if (!user.location) {
    user.location = text;
  } else if (!user.bio) {
    user.bio = text;
  }

  await user.save();
  await askNextProfileQuestion(ctx, user);
}
