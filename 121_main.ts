// -----------------------------
// fzf を reload モードで起動
// -----------------------------
//const querypath = import.meta.dir + "/120_query.ts"
//const querypath = import.meta.dir + "/120_query_rg.ts"

function makespawn(footertext: string){
  const querypath = import.meta.dir + "/120_query_and_migemo.ts"
  return Bun.spawn([
    "fzf",
    "--layout=reverse",
    "--multi",
    "--footer",
    footertext,
    //"--ansi",
    "--bind",
    "start:reload(bun run " + querypath + ")",
    "--bind",
    "change:reload(bun run " + querypath + " {q})",
    "--with-nth=1",
    "--accept-nth=3",
    "--disabled",
    "--preview",
    "bat {2} --color=always",
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

const results: string[] = [];
while(true){
  const proc = makespawn(results.join("\n"));
  const out = await proc.stdout.text();
  const result = out.trim();
  
  if(result === ""){
    break;
  }else{
    results.push(result);
  }
}

const p = Bun.spawn(["clip"], {
  stdin: "pipe",
});

p.stdin.write(";" + results.join(";") + ";");
p.stdin.end();