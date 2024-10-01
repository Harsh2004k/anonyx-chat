import { Bot } from "grammy";
import "dotenv/config";

export const bot = new Bot(process.env.TELEGRAM_TOKEN!);
