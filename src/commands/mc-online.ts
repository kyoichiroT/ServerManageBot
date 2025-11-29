import { SlashCommandBuilder } from "discord.js";

export const mcOnline = new SlashCommandBuilder()
  .setName("mc-online")
  .setDescription(
    "Minecraftサーバーのオンラインプレイヤーリストを表示します。"
  );
