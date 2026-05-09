// -----------------------------
// fzf を reload モードで起動
// -----------------------------
function makespawn(){
  const querypath = import.meta.dir + "/130_query_and_migemo.ts"
  const previewpath = import.meta.dir + "/130_preview.ts"
  return Bun.spawn([
    "fzf",
    "--layout=reverse",
    "--multi",
    "--delimiter=\t",
    //"--footer",
    //footertext,
    //"--ansi",
    "--bind",
    "start:reload(bun run " + querypath + ")",
    "--bind",
    "change:reload(bun run " + querypath + " {q})",
    "--with-nth=1",
    "--accept-nth=2",
    "--disabled",
    "--preview",
    //"echo {2}",
    "bun run " + previewpath + " {2}",
    //"bat {2} --color=always",
    "--preview-border=rounded",
  ], {
    stdin: "inherit",
    stdout: "pipe",
    stderr: "inherit",
  });
}
// -----------------------------
// fzf の結果を受け取る
// -----------------------------

const proc = makespawn();
const out = await proc.stdout.text();
const result = out.trim();

if(result === ""){

} else {
  //console.log(result);
  const cmd = result.split(",");
  //console.log(cmd);

  const p = Bun.spawn(cmd, {
    detached: true,
  });

  //p.exited;
  p.unref();
}