import { Bot } from "gramio";
import { invariant } from "./helpers";

const token = invariant(process.env.BOT_TOKEN, "Bot token is required")

export const bot = new Bot(token)
  .onStart(({ plugins, updatesFrom, info }) => {
    console.log(`Plugins list ${plugins.join(", ")}`);
    console.log(`Bot username @${info.username}`);
    console.log(`Updates from ${updatesFrom}`);
    console.log("Bot is started!\n")
  })