import { Client, Events, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import { startServer, stopServer, getStatus } from "./ec2.js";
import { announceRaw, listRaw, runRaw } from "./rcon.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

let serverStartedAt: number | null = null;

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }
  if (interaction.commandName === "mc-start") {
    try {
      await interaction.reply("インスタンスを起動しています…");
      await startServer();
      let status = await getStatus();
      while (status !== "running") {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        status = await getStatus();
      }
      serverStartedAt = Date.now();
      await interaction.followUp("サーバーが起動しました。");
    } catch (error) {
      console.error("Error starting server:", error);
      await interaction.followUp("サーバーの起動中にエラーが発生しました。");
    }
  }

  if (interaction.commandName === "mc-stop-force") {
    try {
      await interaction.reply("サーバーを強制停止しています…");
      await stopServer();
      let status = await getStatus();
      while (status !== "stopped") {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        status = await getStatus();
      }
      await interaction.followUp("サーバーが停止しました。");
    } catch (error) {
      console.error("Error stopping server:", error);
      await interaction.followUp("サーバーの停止中にエラーが発生しました。");
    }
  }

  if (interaction.commandName === "mc-stop") {
    try {
      await interaction.reply("サーバーを停止しています…");
      await runRaw("save-all");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await runRaw("stop");
      await new Promise((r) => setTimeout(r, 5000));

      await stopServer();
      let status = await getStatus();
      while (status !== "stopped") {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        status = await getStatus();
      }
      await interaction.followUp("サーバーが停止しました。");
    } catch (error) {
      console.error("Error stopping server:", error);
      await interaction.followUp("サーバーの停止中にエラーが発生しました。");
    }
  }

  if (interaction.commandName === "mc-status") {
    await interaction.deferReply();
    try {
      const status = await getStatus();
      await interaction.editReply(`現在の状態： **${status}**`);
    } catch (error) {
      console.error("Error getting status:", error);
      await interaction.editReply(
        "サーバーの状態取得中にエラーが発生しました。"
      );
    }
  }
  if (interaction.commandName === "mc-online") {
    await interaction.deferReply();
    try {
      const res = await listRaw();
      await interaction.editReply(`Raw output:\n${res}`);
    } catch (error) {
      console.error("Error getting online players:", error);
      await interaction.editReply(
        "プレイヤー一覧の取得中にエラーが発生しました。"
      );
    }
  }

  if (interaction.commandName === "mc-say") {
    await interaction.deferReply();
    try {
      const msg = interaction.options.getString("message", true);
      const res = await announceRaw(msg);
      await interaction.editReply(`Raw output:\n${res}`);
    } catch (error) {
      console.error("Error sending announcement:", error);
      await interaction.editReply("アナウンスの送信中にエラーが発生しました。");
    }
  }

  if (interaction.commandName === "mc-cmd") {
    await interaction.deferReply();
    try {
      const cmd = interaction.options.getString("command", true);
      const res = await runRaw(cmd);
      await interaction.editReply(`> ${cmd}\n\`\`\`\n${res}\n\`\`\``);
    } catch (error) {
      console.error("Error running command:", error);
      await interaction.editReply("コマンドの実行中にエラーが発生しました。");
    }
  }
});

let emptyChecks = 0;
const SIX_HOURS = 6 * 60 * 60 * 1000;

setInterval(async () => {
  try {
    // RCON list
    const raw = await listRaw();
    const m = raw.match(/There are (\d+)/);
    const count = m ? Number(m[1]) : 0;

    // 無人判定
    if (count === 0) {
      emptyChecks++;
    } else {
      emptyChecks = 0;
    }

    // 30分無人 → 自動停止
    if (emptyChecks >= 2) {
      await announceRaw("無人状態が20分続いたためサーバーを停止します。");
      await runRaw("save-all");
      await new Promise((r) => setTimeout(r, 3000));
      await runRaw("stop");
      await stopServer();
      emptyChecks = 0;
      serverStartedAt = null;
      return;
    }

    // 6時間超えたら問答無用停止
    if (serverStartedAt && Date.now() - serverStartedAt >= SIX_HOURS) {
      await announceRaw("起動から6時間経過したためサーバーを停止します。");
      await runRaw("save-all");
      await new Promise((r) => setTimeout(r, 3000));
      await runRaw("stop");
      await stopServer();
      emptyChecks = 0;
      serverStartedAt = null;
      return;
    }
  } catch {
    // サーバーが落ちている / RCON繋がらないときなど
    // 特に何もしない
  }
}, 10 * 60 * 1000);

client.login(process.env.BOT_TOKEN);
