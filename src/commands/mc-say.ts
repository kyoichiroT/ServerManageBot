import { SlashCommandBuilder } from "discord.js";

export const mcSay = new SlashCommandBuilder()
  .setName("mc-say")
  .setDescription("Minecraftサーバーにメッセージを送信します。")
  .addStringOption((o) =>
    o.setName("message").setDescription("送信するメッセージ").setRequired(true)
  );
