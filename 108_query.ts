// bun run provider-client.ts <query>

const query = Bun.argv[2] ?? "";

const res = await fetch("http://localhost:3001?q=" + encodeURIComponent(query));
const text = await res.text();

console.log(text);
