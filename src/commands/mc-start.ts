import { SlashCommandBuilder } from "discord.js";

export const mcStart = new SlashCommandBuilder()
  .setName("mc-start")
  .setDescription("Minecraftサーバーを起動します。");
