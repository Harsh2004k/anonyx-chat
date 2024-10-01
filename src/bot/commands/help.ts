import { Context } from "grammy";

export async function handleHelp(ctx: Context) {
  const helpMessage = `
Here are the available commands:

/start - Start the bot
/chat - Start a new chat
/leave - Leave the current chat
/profile - View your profile
/update - Update your profile
/rules - View bot rules
/privacy - View privacy policy
/help - Show this help message

For any issues or concerns, please contact @harsh_693.
  `.trim();

  await ctx.reply(helpMessage);
}
