import { CompactDictionary, Migemo } from 'jsmigemo';
import fs from 'fs';
import { YAML } from "bun";

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


const filetxt = fs.readFileSync(import.meta.dir + "/130_setting.yaml");
const yamls = Bun.YAML.parse(filetxt);

for (const yaml of yamls){

  let regexpflag = true;
  for(const migemoquery of migemoquerys){
    const regex = new RegExp(migemoquery,"i");
    const regexpresult = regex.test(yaml.name);
    if(regexpresult === false){
      regexpflag = false;
      break;
    }
  }

  if(regexpflag === false){
    continue;
  }

  const outlog = yaml.name + "\t" + yaml.cmd;
  console.log(outlog);
}
