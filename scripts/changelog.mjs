import { readFile, writeFile } from "node:fs/promises";

import { stripIndents } from "common-tags";

import packageJson from "../package.json" assert { type: "json" };

const filePath = "./CHANGELOG.md";

function parseEntryVersion(entry) {
  const [title] = entry.split("\n")
  const [version] = title.match(/[0-9.]+/)

  return version;
}

function buildNewEntry(newVersion, oldVersion) {
  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 10);

  const entry = stripIndents`
    [${newVersion}](https://github.com/xt0rted/stylelint-actions-formatters/compare/v${oldVersion}...v${newVersion}) - ${formattedDate}

    - Synced code with [stylelint ${newVersion}](https://github.com/stylelint/stylelint/releases/tag/${newVersion})
  `;

  return `${entry}\n`;
}

const changelog = await readFile(filePath, "utf-8");
const [header, currentEntry, ...entries] = changelog.split("\n## ");
const currentVersion = parseEntryVersion(currentEntry);

if (currentVersion === packageJson.version) {
  console.log("No changes to changelog needed");
  process.exit(0);
}

const newEntry = buildNewEntry(packageJson.version, currentVersion);
const body = [newEntry, currentEntry, ...entries].map(entry => `## ${entry}`);

const newChangelog = [
  header,
  ...body,
].join("\n");

await writeFile(filePath, newChangelog, "utf-8");
