import { SlashCommandBuilder } from "discord.js";

export const mcStop = new SlashCommandBuilder()
  .setName("mc-stop")
  .setDescription("Minecraftサーバーを停止します。");
