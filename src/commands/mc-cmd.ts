import { SlashCommandBuilder } from "discord.js";

export const mcCmd = new SlashCommandBuilder()
  .setName("mc-cmd")
  .setDescription("コマンド入れます。")
  .addStringOption((opt) =>
    opt
      .setName("command")
      .setDescription("実行するコマンドを入力")
      .setRequired(true)
  );
