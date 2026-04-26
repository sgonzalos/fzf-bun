// bun run main.ts

import { Glob } from "bun";
import { CompactDictionary, Migemo } from 'jsmigemo';
import fs from 'fs';

const buffer = fs.readFileSync("./migemo-compact-dict");
const dict = new CompactDictionary(buffer.buffer);

const migemo = new Migemo();
await migemo.setDict(dict);

//console.log("jsmigemo loaded");

// -----------------------------
// 状態保持 + migemo フィルタリングサーバー
// -----------------------------
let items: string[] = [];

const server = Bun.serve({
  port: 3001,
  async fetch(req) {
    const url = new URL(req.url);

    // POST: 候補を追加
    if (req.method === "POST") {
      const text = await req.text();
      items.push(text);
      return new Response("ok");
    }

    // GET: query に応じて migemo でフィルタリング
    const q = url.searchParams.get("q") ?? "";
    let pattern = ".*";

    if (q == ""){
      pattern = ".*";
    }else{
      pattern = migemo.query(q);
    }
    const regex = new RegExp(pattern);
    const filtered = items.filter((item) => regex.test(item));

    return new Response(filtered.join("\n"));
  }
});

//console.log("provider-server started on :3001");

// -----------------------------
// 非同期で候補を push
// -----------------------------
const home = process.env.HOME || process.env.USERPROFILE;
const desktop = `${home}/Desktop`;

//const files = await readdir(import.meta.dir);
//const files = await fs.readdir(desktop);

async function pushData() {
  const glob = new Glob("*");

  //for await (const file of glob.scan(".")){
  for await (const file of glob.scan(desktop)){
    await fetch("http://localhost:3001", {
      method: "POST",
      body: `${file}`
    });
  }
}
/*
async function pushData() {
  for (let i = 1; i <= 10; i++) {
    await fetch("http://localhost:3001", {
      method: "POST",
      body: `item-${i}`
    });
    //await Bun.sleep(300);
  }
}
*/

pushData();

// -----------------------------
// fzf を reload モードで起動
// -----------------------------
const proc = Bun.spawn([
  "fzf",
  "--bind",
  "start:reload(bun run 108_query.ts)",
  "--bind",
  "change:reload(bun run 108_query.ts {q})",
  "--disabled",
  //"--phony",
  //"--query",
], {
  stdin: "inherit",
  stdout: "pipe",
  stderr: "inherit",
});

// -----------------------------
// fzf の結果を受け取る
// -----------------------------
const out = await new Response(proc.stdout).text();
//console.log("selected:", out.trim());
console.log(out.trim());

// fzf 終了後にサーバーを停止
server.stop();
