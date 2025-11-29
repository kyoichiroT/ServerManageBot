import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import { startServer, stopServer, getStatus } from "./ec2.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "mc-start") {
    await interaction.reply("インスタンスを起動しています…");
    await startServer();
    await interaction.editReply(
      "起動コマンドを送信しました。しばらくお待ちください。"
    );
  }

  if (interaction.commandName === "mc-stop") {
    await interaction.reply("サーバーを停止しています…");
    await stopServer();
    await interaction.editReply("停止コマンドを送信しました。");
  }

  if (interaction.commandName === "mc-status") {
    const status = await getStatus();
    await interaction.reply(`現在の状態： **${status}**`);
  }
});

client.login(process.env.BOT_TOKEN);
