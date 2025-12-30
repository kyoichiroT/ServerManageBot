import { SlashCommandBuilder } from "discord.js";

export const mcStopForce = new SlashCommandBuilder()
  .setName("mc-stop-force")
  .setDescription("ec2インスタンスを停止します。");
