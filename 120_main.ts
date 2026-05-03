// -----------------------------
// fzf を reload モードで起動
// -----------------------------
//const querypath = import.meta.dir + "/120_query.ts"
//const querypath = import.meta.dir + "/120_query_rg.ts"
const querypath = import.meta.dir + "/120_query_and_migemo.ts"
const proc = Bun.spawn([
  "fzf",
  "--layout=reverse",
  //"--ansi",
  "--bind",
  "start:reload(bun run " + querypath + ")",
  "--bind",
  "change:reload(bun run " + querypath + " {q})",
  "--with-nth=1",
  "--accept-nth=2",
  "--disabled",
  "--preview",
  "bat {2} --color=always",
  "--preview-border=rounded",
], {
  stdin: "inherit",
  stdout: "pipe",
  stderr: "inherit",
});

// -----------------------------
// fzf の結果を受け取る
// -----------------------------
const out = await new Response(proc.stdout).text();
console.log(out.trim());