import { REST, Routes } from "discord.js";
import { mcStart } from "./commands/mc-start.js";
import { mcStop } from "./commands/mc-stop.js";
import { mcStatus } from "./commands/mc-status.js";
import "dotenv/config";

const commands = [mcStart, mcStop, mcStatus].map((cmd) => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);

await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
  body: commands,
});

console.log("Slash commands registered.");
