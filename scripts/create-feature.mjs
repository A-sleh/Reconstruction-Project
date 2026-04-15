import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { createInterface } from "readline/promises";
import { stdin, stdout } from "process";

const projectRoot = process.cwd();
const pathsFile = join(projectRoot, "src", "config", "paths.ts");
const routerFile = join(projectRoot, "src", "app", "routes", "router.tsx");
const featuresDir = join(projectRoot, "src", "features");

const apiFiles = ["create.ts", "read.ts", "update.ts", "delete.ts"];

const rl = createInterface({ input: stdin, output: stdout });

const ask = async (message, validate) => {
  while (true) {
    const value = (await rl.question(message)).trim();
    if (!validate || validate(value)) {
      return value;
    }
    console.log("Invalid input, please try again.");
  }
};

const askWithDefault = async (message, defaultValue) => {
  const value = await rl.question(message);
  return value.trim() || defaultValue;
};

const confirm = async (message, defaultValue = false) => {
  const yesNo = defaultValue ? "Y/n" : "y/N";
  while (true) {
    const value = (await rl.question(`${message} (${yesNo}): `)).trim().toLowerCase();
    if (!value) return defaultValue;
    if (["y", "yes"].includes(value)) return true;
    if (["n", "no"].includes(value)) return false;
    console.log("Please answer y or n.");
  }
};

const select = async (message, choices, defaultIndex = 0) => {
  console.log(message);
  choices.forEach((choice, index) => console.log(`  ${index + 1}. ${choice.name}`));
  const defaultChoice = defaultIndex + 1;
  while (true) {
    const value = (await rl.question(`Select an option [${defaultChoice}]: `)).trim();
    const index = value ? Number(value) - 1 : defaultIndex;
    if (!Number.isNaN(index) && index >= 0 && index < choices.length) {
      return choices[index].value;
    }
    console.log("Please enter a valid number.");
  }
};

const checkbox = async (message, choices) => {
  console.log(message);
  choices.forEach((choice, index) => console.log(`  ${index + 1}. ${choice.name}`));
  console.log("Enter comma-separated numbers for the items you want.");
  while (true) {
    const value = (await rl.question("Select options [all]: ")).trim();
    if (!value) return choices.map((choice) => choice.value);
    const selected = value
      .split(/\s*,\s*/)
      .filter(Boolean)
      .map((item) => Number(item) - 1)
      .filter((index) => Number.isFinite(index) && index >= 0 && index < choices.length);
    if (selected.length) {
      return Array.from(new Set(selected)).map((index) => choices[index].value);
    }
    console.log("Please enter at least one valid number.");
  }
};

const toPascalCase = (value) =>
  value
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join("");

const toCamelCase = (value) => {
  const pascal = toPascalCase(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

const toKebabCase = (value) =>
  value
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/-+/g, "-")
    .toLowerCase();

const ensureFolder = async (folderPath) => {
  await mkdir(folderPath, { recursive: true });
};

const promptConfig = async () => {
  const featureName = await ask("Feature name (folder and component name): ", (value) => value.trim() !== "");
  const routePathDefault = `/${toKebabCase(featureName)}`;
  const routePath = await askWithDefault(
    `Route path for this feature [${routePathDefault}]: `,
    routePathDefault
  );

  const pathSection = await select("Which paths section should this feature be added to?", [
    { name: "app", value: "app" },
    { name: "auth", value: "auth" },
    { name: "landingPage", value: "landingPage" },
    { name: "custom top-level key", value: "custom" },
  ]);

  let customSection;
  if (pathSection === "custom") {
    customSection = await ask("Custom top-level key name for paths.ts: ", (value) => value.trim() !== "");
  }

  const withRedirect = await confirm(
    "Should the generated path include an optional redirectTo query parameter?",
    false
  );

  const asAuthChild = await confirm(
    "Should the new route be inserted as a child route under the existing '/auth' parent route?",
    false
  );

  const createComponentsFolder = await confirm("Create a components folder inside the feature?", true);
  const createApiFolder = await confirm("Create an api folder inside the feature?", true);

  let apiFilesToCreate = [];
  if (createApiFolder) {
    apiFilesToCreate = await checkbox("Which backend api files should be created?", apiFiles.map((file) => ({ name: file, value: file })));
  }

  return {
    featureName,
    routePath,
    pathSection,
    customSection,
    withRedirect,
    asAuthChild,
    createComponentsFolder,
    createApiFolder,
    apiFilesToCreate,
  };
};

const insertIntoPaths = async ({ featureKey, routePath, sectionKey, withRedirect, customSection }) => {
  const raw = await readFile(pathsFile, "utf-8");
  const key = sectionKey === "custom" ? customSection : sectionKey;
  const indent = "  ";
  const pathEntry = `${indent}${featureKey}: {
${indent.repeat(2)}path: "${routePath}",
${indent.repeat(2)}getHref: (${withRedirect ? "redirectTo?: string | null | undefined" : ""}) =>
${indent.repeat(3)}\`${routePath}${withRedirect ? `\${redirectTo ? \`?redirectTo=\${encodeURIComponent(redirectTo)}\` : ""}` : ""}\`,
${indent}},\n`;

  if (!raw.includes(`${key}: {`)) {
    const insertBefore = "landingPage: {";
    if (raw.includes(insertBefore)) {
      return raw.replace(
        insertBefore,
        `${key}: {
${pathEntry}} ,\n  ${insertBefore}`
      );
    }

    throw new Error(`Unable to insert new paths section; '${key}' not found and fallback failed.`);
  }

  const sectionRegex = new RegExp(`(${key}: \{)([\s\S]*?)(\n  \},)`, "m");
  if (sectionRegex.test(raw)) {
    return raw.replace(sectionRegex, (_, open, contents, close) => {
      if (contents.trim() === "") {
        return `${open}\n${pathEntry}${close}`;
      }
      return `${open}${contents}${pathEntry}${close}`;
    });
  }

  throw new Error(`Could not update paths.ts for section '${key}'.`);
};

const insertIntoRouter = async ({ featureNamePascal, routePath, featureKey, asAuthChild }) => {
  const raw = await readFile(routerFile, "utf-8");
  const importLine = `const ${featureNamePascal} = lazy(() => import("@/features/${featureNamePascal}/${featureNamePascal}.view"));\n`;
  const importMarker = `// Landing page`;
  const updatedImports = raw.includes(importLine) ? raw : raw.replace(importMarker, `${importLine}\n${importMarker}`);

  const routeObject = `      {
        path: paths.${featureKey}.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <${featureNamePascal} />
          </Suspense>
        ),
      },\n`;

  let final = updatedImports;
  if (asAuthChild) {
    const authChildrenRegex = /(\{\s*path:\s*"auth",[\s\S]*?children:\s*\[)([\s\S]*?)(\n\s*\],)/m;
    if (!authChildrenRegex.test(final)) {
      throw new Error("Unable to find '/auth' child route section in router.tsx.");
    }
    final = final.replace(authChildrenRegex, (_, open, children, close) => `${open}${children}${routeObject}${close}`);
  } else {
    const arrayEnd = /const router: RouteObject\[\] = \[([\s\S]*?)\n\];/m;
    if (!arrayEnd.test(final)) {
      throw new Error("Unable to find router array in router.tsx.");
    }
    final = final.replace(/\n\];\n$/, `${routeObject}\n];\n`);
  }

  return final;
};

const createFeatureFiles = async ({ featureNamePascal, featureFolder, createComponentsFolder, createApiFolder, apiFilesToCreate }) => {
  const featurePath = join(featuresDir, featureFolder);
  await ensureFolder(featurePath);
  const viewContent = `import React from \"react\";\n\nconst ${featureNamePascal} = () => {\n  return (\n    <div>\n      <h1>${featureNamePascal} Page</h1>\n      <p>This is the autogenerated feature page.</p>\n    </div>\n  );\n};\n\nexport default ${featureNamePascal};\n`;
  await writeFile(join(featurePath, `${featureNamePascal}.view.tsx`), viewContent, "utf-8");

  if (createComponentsFolder) {
    await ensureFolder(join(featurePath, "components"));
    const componentIndex = `export { default as ${featureNamePascal}Component } from \"./${featureNamePascal}Component\";\n`;
    const sampleComponent = `import React from \"react\";\n\nconst ${featureNamePascal}Component = () => <div>${featureNamePascal} component</div>;\n\nexport default ${featureNamePascal}Component;\n`;
    await writeFile(join(featurePath, "components", `${featureNamePascal}Component.tsx`), sampleComponent, "utf-8");
    await writeFile(join(featurePath, "components", "index.ts"), componentIndex, "utf-8");
  }

  if (createApiFolder) {
    const apiPath = join(featurePath, "api");
    await ensureFolder(apiPath);
    for (const file of apiFilesToCreate) {
      const name = file.replace(/\.ts$/, "");
      const exportName = `${name}${featureNamePascal}`;
      const content = `import axios from \"axios\";\n\nexport const ${exportName} = async (payload: unknown) => {\n  return axios.${name === "read" ? "get" : name}(\"/api/${toKebabCase(featureNamePascal)}\"${name === "read" ? "" : ", payload"});\n};\n`;
      await writeFile(join(apiPath, file), content, "utf-8");
    }
  }
};

const run = async () => {
  try {
    const answers = await promptConfig();
    const featureNamePascal = toPascalCase(answers.featureName);
    const featureKey = toCamelCase(answers.featureName);
    const sectionKey = answers.pathSection;
    const customSection = answers.customSection;

    const updatedPaths = await insertIntoPaths({
      featureKey,
      routePath: answers.routePath,
      sectionKey,
      withRedirect: answers.withRedirect,
      customSection,
    });

    await writeFile(pathsFile, updatedPaths, "utf-8");

    const updatedRouter = await insertIntoRouter({
      featureNamePascal,
      routePath: answers.routePath,
      featureKey,
      asAuthChild: answers.asAuthChild,
    });

    await writeFile(routerFile, updatedRouter, "utf-8");

    await createFeatureFiles({
      featureNamePascal,
      featureFolder: featureNamePascal,
      createComponentsFolder: answers.createComponentsFolder,
      createApiFolder: answers.createApiFolder,
      apiFilesToCreate: answers.apiFilesToCreate ?? [],
    });

    console.log("\n✅ Feature scaffold created successfully.");
    console.log(`- Feature folder: src/features/${featureNamePascal}`);
    console.log(`- Paths updated: src/config/paths.ts`);
    console.log(`- Router updated: src/app/routes/router.tsx`);
  } catch (error) {
    console.error("\n❌ Error creating feature:", error.message || error);
    process.exit(1);
  } finally {
    await rl.close();
  }
};

run();
