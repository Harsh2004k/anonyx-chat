import { Context } from "grammy";
import { getOrCreateUser, askNextProfileQuestion } from "../utils";

export async function handleProfile(ctx: Context) {
  const user = await getOrCreateUser(ctx);
  if (user.isProfileComplete) {
    const profileInfo = `
Name: ${user.name}
Age: ${user.age}
Gender: ${user.gender}
Location: ${user.location}
Bio: ${user.bio}
    `;
    await ctx.reply(
      `Your current profile:\n${profileInfo}\n\nTo update your profile, use /update`
    );
  } else {
    await ctx.reply("Your profile is not complete. Let's set it up!");
    await askNextProfileQuestion(ctx, user);
  }
}