import fs from "fs";
import path from "path";

function getLegacyHtml() {
  const filePath = path.join(process.cwd(), "index_legacy.html");
  let raw = "";
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.error("Failed to read legacy HTML", err);
    return "";
  }
  const bodyMatch = raw.match(/<body[\s\S]*?>([\s\S]*?)<\/body>/i);
  return bodyMatch ? bodyMatch[1] : raw;
}

export default function Home() {
  const html = getLegacyHtml();
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
