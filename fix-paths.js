import fs from "node:fs";
import path from "node:path";

function fixPaths() {
  const root = process.cwd();
  
  // Fix .output/server/wrangler.json
  const wranglerJsonPath = path.join(root, ".output", "server", "wrangler.json");
  if (fs.existsSync(wranglerJsonPath)) {
    try {
      const content = fs.readFileSync(wranglerJsonPath, "utf8");
      const data = JSON.parse(content);
      let changed = false;
      
      if (data.assets && typeof data.assets.directory === "string") {
        const original = data.assets.directory;
        data.assets.directory = original.replace(/\\/g, "/");
        if (data.assets.directory !== original) {
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(wranglerJsonPath, JSON.stringify(data, null, 2), "utf8");
        console.log(`[fix-paths] Successfully fixed backslashes in ${wranglerJsonPath}`);
      }
    } catch (error) {
      console.error("[fix-paths] Error fixing wrangler.json:", error);
    }
  } else {
    console.log(`[fix-paths] wrangler.json not found at ${wranglerJsonPath}`);
  }

  // Fix .wrangler/deploy/config.json
  const deployConfigPath = path.join(root, ".wrangler", "deploy", "config.json");
  if (fs.existsSync(deployConfigPath)) {
    try {
      const content = fs.readFileSync(deployConfigPath, "utf8");
      const data = JSON.parse(content);
      let changed = false;
      
      if (typeof data.configPath === "string") {
        const original = data.configPath;
        data.configPath = original.replace(/\\/g, "/");
        if (data.configPath !== original) {
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(deployConfigPath, JSON.stringify(data, null, 2), "utf8");
        console.log(`[fix-paths] Successfully fixed backslashes in ${deployConfigPath}`);
      }
    } catch (error) {
      console.error("[fix-paths] Error fixing deploy config.json:", error);
    }
  } else {
    console.log(`[fix-paths] deploy config.json not found at ${deployConfigPath}`);
  }
}

fixPaths();
