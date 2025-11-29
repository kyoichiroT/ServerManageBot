// rcon.ts
import { Rcon } from "rcon-client";

export async function withRcon<T>(fn: (rcon: Rcon) => Promise<T>): Promise<T> {
  const rcon = await Rcon.connect({
    host: "127.0.0.1", // コンテナを同居させている前提
    port: Number(process.env.RCON_PORT || "25575"),
    password: process.env.RCON_PASSWORD!,
  });

  try {
    return await fn(rcon);
  } finally {
    rcon.end();
  }
}

// プレイヤー一覧（未整形）
export async function listRaw() {
  return withRcon(async (r) => {
    return await r.send("list");
  });
}

// アナウンス（say）
export async function announceRaw(msg: string) {
  return withRcon(async (r) => {
    return await r.send(`say ${msg}`);
  });
}

// 任意コマンド
export async function runRaw(cmd: string) {
  return withRcon(async (r) => {
    return await r.send(cmd);
  });
}
