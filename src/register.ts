import { REST, Routes } from "discord.js";
import { mcStart } from "./commands/mc-start.js";
import { mcStop } from "./commands/mc-stop.js";
import { mcStatus } from "./commands/mc-status.js";
import "dotenv/config";

async function main() {
  const commands = [mcStart, mcStop, mcStatus].map((cmd) => cmd.toJSON());

  const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);

  try {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: commands,
    });
    console.log("Slash commands registered.");
  } catch (error) {
    console.error("Error registering slash commands:", error);
    process.exit(1);
  }
}

main();
