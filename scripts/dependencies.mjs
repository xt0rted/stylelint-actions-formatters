import packageJson from "../package.json" assert { type: "json" };

const source = {
  org: "stylelint",
  repo: "stylelint",
  version: packageJson.version,
};

const response = await fetch(`https://raw.githubusercontent.com/${source.org}/${source.repo}/${source.version}/package.json`);

if (response.status >= 400) {
  throw new Error(`Bad response from server: ${response.status}`);
}

const json = await response.text();
const upstreamPackageJson = JSON.parse(json);

let hasError = false;

for (const dependency in packageJson.dependencies) {
  const version = packageJson.dependencies[dependency];
  const upstreamVersion = upstreamPackageJson.dependencies[dependency];

  if (!upstreamVersion) {
    console.log(`Dependency no longer used: ${dependency}`);
    hasError = true;
    continue;
  }

  if (version !== upstreamVersion) {
    console.log(`Dependency version changed: ${dependency} ${packageJson.dependencies[dependency]} → ${upstreamVersion}`);
    hasError = true;
    continue;
  }
}

process.exit(hasError ? 1 : 0);
