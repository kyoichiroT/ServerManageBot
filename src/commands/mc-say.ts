import { SlashCommandBuilder } from "discord.js";

export const mcSay = new SlashCommandBuilder()
  .setName("mc-say")
  .setDescription("Minecraftサーバーにメッセージを送信します。");
