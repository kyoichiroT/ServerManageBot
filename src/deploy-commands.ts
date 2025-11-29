import "dotenv/config";
import { REST, Routes } from "discord.js";
import { mcStart } from "./commands/mc-start";
import { mcStop } from "./commands/mc-stop";
import { mcCmd } from "./commands/mc-cmd";
import { mcOnline } from "./commands/mc-online";
import { mcSay } from "./commands/mc-say";
import { mcStatus } from "./commands/mc-status";
import { mcStopForce } from "./commands/mc-stop-force";

async function main() {
  const commands = [
    mcStart,
    mcStop,
    mcStatus,
    mcOnline,
    mcSay,
    mcCmd,
    mcStopForce,
  ].map((c) => c.toJSON());

  const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
    body: commands,
  });

  console.log("Slash commands registered.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
