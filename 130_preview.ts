
const argtext = Bun.argv[2] ?? "";
const args = argtext.split(",");

for(const arg of args){
  console.log(arg);
}