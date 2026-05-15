import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const failures = [];

const packages = [
  { name: "@your-org/forms-core", path: "packages/core", kind: "core" },
  { name: "@your-org/forms-react-renderer", path: "packages/react-renderer", kind: "react" },
  { name: "@your-org/forms-react-builder", path: "packages/react-builder", kind: "builder" },
  { name: "@your-org/forms-validators", path: "packages/validators", kind: "validators" },
  { name: "@your-org/forms-adapters", path: "packages/adapters", kind: "adapters" },
  { name: "@your-org/forms-themes", path: "packages/themes", kind: "themes" }
];

for (const pkg of packages) {
  const manifest = readJson(join(pkg.path, "package.json"));
  expect(manifest.name === pkg.name, `${pkg.path}/package.json has expected package name`);
  expect(manifest.type === "module", `${pkg.name} is ESM`);
  expect(manifest.sideEffects === false, `${pkg.name} declares sideEffects false`);
  expect(manifest.exports?.["."]?.types === "./dist/index.d.ts", `${pkg.name} exports root types`);
  expect(manifest.exports?.["."]?.default === "./dist/index.js", `${pkg.name} exports root JavaScript`);

  for (const script of ["build", "clean", "lint", "test", "typecheck"]) {
    expect(typeof manifest.scripts?.[script] === "string", `${pkg.name} exposes ${script} script`);
  }
}

const rootManifest = readJson("package.json");
for (const script of ["audit:release", "build", "clean", "format:check", "lint", "test", "typecheck"]) {
  expect(typeof rootManifest.scripts?.[script] === "string", `root exposes ${script} script`);
}

const builderManifest = readJson("packages/react-builder/package.json");
expect(typeof builderManifest.scripts?.e2e === "string", "builder exposes e2e script");

const exampleManifest = readJson("examples/vite-react/package.json");
expect(typeof exampleManifest.scripts?.["test:e2e"] === "string", "Vite example exposes test:e2e script");

const forbiddenCorePackages = [
  "react",
  "react-dom",
  "react-hook-form",
  "@tanstack/react-query",
  "@dnd-kit/core",
  "@dnd-kit/sortable",
  "@dnd-kit/utilities",
  "ajv",
  "zod"
];
const coreManifest = readJson("packages/core/package.json");
for (const section of ["dependencies", "devDependencies", "peerDependencies"]) {
  const deps = coreManifest[section] ?? {};
  for (const dep of forbiddenCorePackages) {
    expect(!Object.hasOwn(deps, dep), `core does not declare forbidden ${section} dependency ${dep}`);
  }
}

const importChecks = [
  {
    path: "packages/core/src",
    forbidden: [
      /^react$/,
      /^react-dom/,
      /^react-hook-form$/,
      /^@tanstack\/react-query$/,
      /^@dnd-kit\//,
      /^ajv$/,
      /^zod$/,
      /^@your-org\/forms-react-/,
      /^@your-org\/forms-adapters$/,
      /^@your-org\/forms-themes$/,
      /^@your-org\/forms-validators$/
    ],
    label: "core source"
  },
  {
    path: "packages/validators/src",
    forbidden: [/^react$/, /^react-dom/, /^@your-org\/forms-react-/, /^@tanstack\/react-query$/, /^@dnd-kit\//],
    label: "validators source"
  },
  {
    path: "packages/adapters/src",
    forbidden: [/^react$/, /^react-dom/, /^@tanstack\/react-query$/, /^@dnd-kit\//, /^@your-org\/forms-react-/],
    label: "adapters source"
  },
  {
    path: "packages/themes/src",
    forbidden: [/^react$/, /^react-dom/, /^@tanstack\/react-query$/, /^@dnd-kit\//, /^@your-org\/forms-react-/],
    label: "themes source"
  },
  {
    path: "packages/react-renderer/src",
    forbidden: [/^react-hook-form$/, /^@tanstack\/react-query$/, /^@dnd-kit\//],
    label: "renderer source"
  }
];

for (const check of importChecks) {
  for (const file of sourceFiles(check.path)) {
    const source = read(file);
    for (const specifier of importSpecifiers(source)) {
      expect(!check.forbidden.some((pattern) => pattern.test(specifier)), `${check.label} avoids forbidden import ${specifier} in ${file}`);
    }
  }
}

const publicTypeLeakChecks = [
  {
    path: "packages/react-renderer/dist",
    forbidden: ["react-hook-form", "@tanstack/react-query", "@dnd-kit", "UseMutationResult", "QueryObserverResult"],
    label: "renderer public types"
  },
  {
    path: "packages/react-builder/dist",
    forbidden: ["react-hook-form", "UseMutationResult", "QueryObserverResult", "DragEndEvent", "DragStartEvent", "DragOverEvent"],
    label: "builder public types"
  }
];

for (const check of publicTypeLeakChecks) {
  if (!existsSync(join(root, check.path))) {
    continue;
  }
  for (const file of sourceFiles(check.path, [".d.ts"])) {
    const source = read(file);
    for (const forbidden of check.forbidden) {
      expect(!source.includes(forbidden), `${check.label} do not leak ${forbidden} in ${file}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Release-candidate audit failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Release-candidate audit passed.");

function readJson(path) {
  return JSON.parse(read(path));
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function expect(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

function sourceFiles(path, extensions = [".ts", ".tsx", ".js", ".mjs", ".d.ts"]) {
  const fullPath = join(root, path);
  if (!existsSync(fullPath)) {
    return [];
  }
  const output = [];
  for (const entry of readdirSync(fullPath)) {
    const child = join(fullPath, entry);
    const childRelative = relative(root, child);
    if (entry === "node_modules" || entry === "dist" || entry === "test-results") {
      continue;
    }
    if (statSync(child).isDirectory()) {
      output.push(...sourceFiles(childRelative, extensions));
      continue;
    }
    if (extensions.some((extension) => entry.endsWith(extension))) {
      output.push(childRelative);
    }
  }
  return output;
}

function importSpecifiers(source) {
  const specifiers = [];
  const importExportPattern = /(?:import|export)\s+(?:type\s+)?(?:[^'"()]*?\s+from\s+)?["']([^"']+)["']/g;
  const dynamicImportPattern = /import\(\s*["']([^"']+)["']\s*\)/g;
  for (const match of source.matchAll(importExportPattern)) {
    specifiers.push(match[1]);
  }
  for (const match of source.matchAll(dynamicImportPattern)) {
    specifiers.push(match[1]);
  }
  return specifiers;
}
