import { bot } from "./bot";
import { ALLOWED_USERS } from "./handlers";

export async function notify(
  message: string
) {
  for (const userId of ALLOWED_USERS) {
    await bot.api.sendMessage({ chat_id: userId, text: message });
  }
}

export async function gracefulExit(reason: string, code = 0) {
  await notify(`Home agent exited: ${reason}`);
  process.exit(code);
}