const { ESLint } = require("eslint");
const fs = require('fs');

(async function main() {
  const eslint = new ESLint();
  const results = await eslint.lintFiles(["app/**/*.tsx", "app/**/*.ts"]);
  
  let out = "";
  results.forEach(r => {
    if (r.errorCount > 0 || r.warningCount > 0) {
      out += r.filePath + "\n";
      r.messages.forEach(m => {
        out += `  Line ${m.line}: ${m.message} (${m.ruleId})\n`;
      });
    }
  });
  fs.writeFileSync('lint_report.txt', out);
})().catch(console.error);
