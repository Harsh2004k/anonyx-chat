import { setupBot } from "./bot";
import { connectToDatabase } from "./database";
import "dotenv/config";

async function main() {
  await connectToDatabase();
  const bot = setupBot();
  bot.start();
}

main().catch(console.error);

// add report mechanism
// add premium and referral feature
