import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const darkHtml = readFileSync("legacy/index.html", "utf8");
const lightHtml = readFileSync("legacy/index-light.html", "utf8");

function extractStyle(html) {
  const match = html.match(/<style>([\s\S]*?)<\/style>/);
  if (!match) {
    throw new Error("Legacy style block not found");
  }
  return match[1].trim();
}

function extractRootBody(css) {
  const match = css.match(/:root\s*\{([\s\S]*?)\n\}/);
  if (!match) {
    throw new Error("Legacy :root block not found");
  }
  return match[1].trim();
}

function extractTranslations(html) {
  const start = html.indexOf("const T = {");
  const end = html.indexOf("\n\nlet curLang", start);
  if (start < 0 || end < 0) {
    throw new Error("Legacy translations block not found");
  }

  const sandbox = {};
  vm.runInNewContext(`${html.slice(start, end)}\nresult = T;`, sandbox);
  return sandbox.result;
}

const darkCss = extractStyle(darkHtml);
const darkVars = extractRootBody(darkCss);
const lightVars = extractRootBody(extractStyle(lightHtml));
const cssWithoutDarkRoot = darkCss.replace(/:root\s*\{[\s\S]*?\n\}/, "").trimStart();

const css = `:root,\nhtml[data-theme="dark"] {\n  color-scheme: dark;\n${darkVars}\n}\n\nhtml[data-theme="light"] {\n  color-scheme: light;\n${lightVars}\n}\n\n${cssWithoutDarkRoot}\n\n/* React migration overrides */\n.vsw button {\n  font-family: var(--f1);\n  font-size: 9px;\n  font-weight: 600;\n  letter-spacing: .15em;\n  text-transform: uppercase;\n  padding: 9px 14px;\n  border: 1px solid var(--line2);\n  background: var(--bg2);\n  color: var(--fg3);\n  transition: border-color .2s, color .2s, background .2s;\n  white-space: nowrap;\n}\n.vsw button.on { border-color: var(--a); color: var(--a); }\nbutton { font: inherit; }\n.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }\n`;

writeFileSync("app/globals.css", css);
writeFileSync("data/translations.generated.json", `${JSON.stringify(extractTranslations(darkHtml), null, 2)}\n`);
