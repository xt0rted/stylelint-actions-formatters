import { writeFile } from "node:fs/promises";
import {
  basename,
  join,
} from "node:path";

import packageJson from "../package.json" assert { type: "json" };

const source = {
  org: "stylelint",
  repo: "stylelint",
  version: packageJson.version,
};

const files = [
  {
    source: "lib/formatters/calcSeverityCounts.mjs",
  },
  {
    source: "lib/formatters/preprocessWarnings.mjs",
  },
  {
    source: "lib/formatters/stringFormatter.mjs",
  },
  {
    source: "lib/formatters/terminalLink.mjs",
  },
  {
    source: "lib/formatters/verboseFormatter.mjs",
  },
  {
    source: "lib/utils/pluralize.mjs",
  },
  {
    source: "lib/utils/validateTypes.mjs",
  },
  {
    source: "lib/testUtils/getCleanOutput.mjs",
    location: "__tests__",
  },
  {
    source: "lib/formatters/__tests__/stringFormatter.test.mjs",
    location: "__tests__",
    indent: "  ",
    useSnapshots: true,
  },
  {
    source: "lib/formatters/__tests__/verboseFormatter.test.mjs",
    location: "__tests__",
    indent: "  ",
    useSnapshots: true,
  },
];

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function formatCode({ file, raw }) {
  // Normalize spacing
  raw = raw.replace(/\t/g, "  ");

  // Normalize imports
  raw = raw.replace(/\.\/utils/gm, "");
  raw = raw.replace(/\.\/\.\.\/testUtils/gm, "");

  // We use snapshots for all of these files
  if (file.useSnapshots) {
    raw = raw.replace(/\.toBe\((stripIndent.*$)?$[^;]*\);/gm, ".toMatchSnapshot();");
  }

  // To verify our changes we need to move the paths to a sub-folder
  if (file.source.match(`_tests_`)) {
    raw = raw.replace(/source: 'path\//gm, "source: '/test-project/path/");
  }

  // Tests that verify sub-folders run against multiple configurations
  if (file.indent) {
    raw = raw
      .split("\n")
      .map(line => {
        if (line === ""){
          return line;
        }

        if (
          line.startsWith("import")
          || line.startsWith("describe('string")
          || line.startsWith("describe('verbose")
          || line.startsWith("  let")
          || line.startsWith("})")
        ) {
          return line;
        }

        return file.indent + line;
      })
      .join("\n");
  }

  return raw;
}

await asyncForEach(files, async (file) => {
  const response = await fetch(`https://raw.githubusercontent.com/${source.org}/${source.repo}/${source.version}/${file.source}`);

  if (response.status >= 400) {
    throw new Error(`Bad response from server: ${response.status} ${file.source}`);
  }

  const raw = await response.text();

  const fileContents = [
    "/**",
    ` ${file.indent ? "* Based on": "*"} https://github.com/${source.org}/${source.repo}/blob/${source.version}/${file.source}`,
    " */",
    formatCode({file, raw}),
  ].join("\n");

  await writeFile(
    join(
      "src",
      file.location ?? "",
      basename(file.source)
    ),
    fileContents);
});
