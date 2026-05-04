import { CompactDictionary, Migemo } from 'jsmigemo';
import fs from 'fs';
import { readdir, stat } from 'fs/promises';
import { join , parse } from "path";

const querytext = Bun.argv[2] ?? "";
const querys = querytext.split(/\s+/);

const buffer = fs.readFileSync(import.meta.dir + "/migemo-compact-dict");
const dict = new CompactDictionary(buffer.buffer);
const migemo = new Migemo();
await migemo.setDict(dict);

let pattern = ".*";
const migemoquerys: string[] = [];

for(const query of querys){
  if (query === ""){
    pattern = ".*";
  }else{
    pattern = migemo.query(query);
  }
  migemoquerys.push(pattern);
}


const filepath = "";
const files = await readdir(filepath, { recursive: true });

for (const file of files){
  const filefullpath = join(filepath, file)
  const s = await stat(filefullpath);
  if (s.isDirectory()){
    continue;
  }
  const fileload = Bun.file(filefullpath);
  const text = await fileload.text();

  let regexpflag = true;
  for(const migemoquery of migemoquerys){
    const regex = new RegExp(migemoquery);
    const regexpresult = regex.test(text);
    if(regexpresult === false){
      regexpflag = false;
      break;
    }
  }

  if(regexpflag === false){
    continue;
  }

  //const outlog = file + "\t" + filefullpath;
  const outlog = file + "\t" + filefullpath + "\t" + parse(file).name;
  console.log(outlog);
}
