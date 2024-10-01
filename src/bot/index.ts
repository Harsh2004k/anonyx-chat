import { bot } from "./botInstance";
import { commands } from "../config/commands";
import {
  handleStart,
  handleChat,
  handleLeave,
  handleProfile,
  handleUpdateProfile,
  handleHelp,
  handleReport,
  handleRules,
  handlePrivacy,
} from "./commands";
import { handleMessage, handleCallbackQuery } from "./handlers";
import { GrammyError, HttpError } from "grammy";

async function setCommands() {
  try {
    await bot.api.setMyCommands(commands);
    console.log("Bot commands have been set successfully");
  } catch (error) {
    console.error("Error setting bot commands:", error);
  }
}

export function setupBot() {
  // Set up command handlers
  bot.command("start", handleStart);
  bot.command("chat", handleChat);
  bot.command("leave", handleLeave);
  bot.command("profile", handleProfile);
  bot.command("update", handleUpdateProfile);
  bot.command("help", handleHelp);
  bot.command("report", handleReport);
  bot.command("rules", handleRules);
  bot.command("privacy", handlePrivacy);

  // Set up message and callback query handlers
  bot.on("message", handleMessage);
  bot.on("callback_query:data", handleCallbackQuery);

  // Set the commands for the bot
  setCommands();

  bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
    } else {
      console.error("Unknown error:", e);
    }
  });

  return bot;
}
