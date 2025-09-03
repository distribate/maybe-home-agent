import "./lib"
import "./handlers"

import { exec } from "child_process";
import { bot } from "./bot";
import { promisify } from "util";
import { gracefulExit, notify } from "./utils";

async function validate() {
  const execAsync = promisify(exec);

  try {
    await execAsync("net session");
  } catch {
    console.error("This agent must be run as Administrator");
    process.exit(1);
  }
}

async function start() {
  await validate();
  await bot.start();
  notify("Home agent started!")
}

process.on("SIGINT", () => gracefulExit("SIGINT"));
process.on("SIGTERM", () => gracefulExit("SIGTERM"));
process.on("uncaughtException", (err) => gracefulExit(`uncaughtException: ${err}`, 1));
process.on("unhandledRejection", (reason) => gracefulExit(`unhandledRejection: ${reason}`, 1));

start()