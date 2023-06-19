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

for (const dependency in packageJson.dependencies) {
  const version = packageJson.dependencies[dependency];
  const upstreamVersion = upstreamPackageJson.dependencies[dependency];

  if (!upstreamVersion) {
    console.log(`Dependency no longer used: ${dependency}`);
    process.exit(1);
  }

  if (version !== upstreamVersion) {
    console.log(`Dependency version changed: ${dependency} ${packageJson.dependencies[dependency]} → ${upstreamVersion}`);
    process.exit(1);
  }
}
