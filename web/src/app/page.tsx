import fs from "fs";
import path from "path";

function getLegacyHtml() {
  // Try multiple possible paths for the legacy HTML file
  const possiblePaths = [
    path.join(process.cwd(), "index_legacy.html"),
    path.join(process.cwd(), "..", "index_legacy.html"),
    path.join(__dirname, "..", "..", "..", "index_legacy.html")
  ];
  
  let raw = "";
  for (const filePath of possiblePaths) {
    try {
      raw = fs.readFileSync(filePath, "utf8");
      break;
    } catch {
      console.log(`Tried ${filePath}, not found`);
    }
  }
  
  if (!raw) {
    console.error("Failed to read legacy HTML from any path");
    return "";
  }
  
  const bodyMatch = raw.match(/<body[\s\S]*?>([\s\S]*?)<\/body>/i);
  return bodyMatch ? bodyMatch[1] : raw;
}

export default function Home() {
  const html = getLegacyHtml();
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
