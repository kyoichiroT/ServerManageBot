import { SlashCommandBuilder } from "discord.js";

export const mcStatus = new SlashCommandBuilder()
  .setName("mc-status")
  .setDescription("サーバー状態を確認します。");
