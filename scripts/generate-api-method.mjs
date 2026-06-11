import fs from "fs";
import path from "path";
import readline from "readline";

// --- Configuration Constants ---
const BASE_FEATURES_PATH = path.join(process.cwd(), "src", "features");

// --- CLI Helper Utilities ---
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

// Helper function to remove dashes and camelCase
const removeAnyDash = (str) => {
  return str
    .split("-")
    .map((word, index) => {
      const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
      return index === 0 ? word : capitalized;
    })
    .join("");
};

const toPascalCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Interactive directory picker to find api folders
 */
async function chooseApiDirectory(currentPath) {
  while (true) {
    if (!fs.existsSync(currentPath)) {
      console.error(`❌ Path does not exist: ${currentPath}`);
      return null;
    }

    const items = fs.readdirSync(currentPath, { withFileTypes: true });
    const subDirs = items
      .filter((item) => item.isDirectory())
      .map((item) => item.name);

    console.log(
      `\n📂 Current Path: ${path.relative(process.cwd(), currentPath) || "."}`,
    );
    console.log(`[0] 🎯 SELECT THIS FOLDER`);
    if (path.relative(BASE_FEATURES_PATH, currentPath) !== "") {
      console.log(`[1] ↩️ Go Back`);
    }

    subDirs.forEach((dir, idx) => {
      console.log(`[${idx + 2}] 📂 ${dir}/`);
    });

    const choice = await askQuestion("\nSelect an option index: ");
    const choiceIdx = parseInt(choice.trim(), 10);

    if (choiceIdx === 0) {
      return currentPath;
    } else if (
      choiceIdx === 1 &&
      path.relative(BASE_FEATURES_PATH, currentPath) !== ""
    ) {
      currentPath = path.dirname(currentPath);
    } else {
      const targetIdx = choiceIdx - 2;
      if (targetIdx >= 0 && targetIdx < subDirs.length) {
        currentPath = path.join(currentPath, subDirs[targetIdx]);
      } else {
        console.log("❌ Invalid selection. Try again.");
      }
    }
  }
}

/**
 * Detect feature name from existing api files
 */
function detectFeatureName(apiDir) {
  const files = fs.readdirSync(apiDir);
  const routesFile = files.find((f) => f.endsWith(".routes.ts"));

  if (routesFile) {
    return routesFile.replace(".routes.ts", "");
  }
  return null;
}

/**
 * Converts a standard mock JSON object (flat or deeply nested) into structured TS Interfaces
 */
function parseSwaggerToInterface(interfaceName, swaggerStr) {
  // Safe cleanup for the user input
  if (!swaggerStr || !swaggerStr.trim()) {
    return `export interface I${interfaceName} {\n  // TODO: Define properties\n}`;
  }

  try {
    // 1. Parse the string into a JavaScript Object
    const obj = JSON.parse(swaggerStr.trim());
    let subInterfaces = [];

    // 2. Recursive helper to extract properties and nested children
    function buildInterfaceBody(targetObj, currentIndent = "  ") {
      let body = "";

      for (const [key, value] of Object.entries(targetObj)) {
        let type = typeof value;

        if (value === null) {
          type = "any";
        } else if (Array.isArray(value)) {
          if (value.length > 0) {
            // Check if it's an array of nested objects
            if (typeof value[0] === "object" && value[0] !== null) {
              const subPascalName =
                key.charAt(0).toUpperCase() + key.slice(1).replace(/s$/, ""); // Singularize (e.g., tags -> Tag)
              const childBody = buildInterfaceBody(value[0], "  ");
              subInterfaces.push(
                `export interface I${subPascalName} {\n${childBody}}`,
              );
              type = `I${subPascalName}[]`;
            } else {
              type = `${typeof value[0]}[]`; // e.g., string[], number[]
            }
          } else {
            type = "any[]";
          }
        } else if (type === "object") {
          // CRITICAL FIX: Instead of generic 'object' or 'Record', create a dedicated nested interface
          const subPascalName = key.charAt(0).toUpperCase() + key.slice(1); // e.g., category -> Category
          const childBody = buildInterfaceBody(value, "  ");

          // Push it to our subInterfaces list to print later
          subInterfaces.push(
            `export interface I${subPascalName} {\n${childBody}}`,
          );
          type = `I${subPascalName}`;
        }

        body += `${currentIndent}${key}: ${type};\n`;
      }
      return body;
    }

    // Generate main interface body
    const mainBody = buildInterfaceBody(obj, "  ");
    const mainInterface = `export interface I${interfaceName} {\n${mainBody}}`;

    // 3. Combine sub-interfaces first, followed by the main interface
    return [...subInterfaces, mainInterface].join("\n\n");
  } catch (e) {
    console.error(
      "❌ Failed to parse JSON string. Ensure it has matching braces and proper double quotes.",
    );
    return `export interface I${interfaceName} {\n  // TODO: Check manual fallback layout\n}`;
  }
}

/**
 * Add route to routes file
 */
function addRouteToFile(filePath, routeKey, routePath, featureName) {
  let content = fs.readFileSync(filePath, "utf8");

  if (content.includes(routeKey)) {
    console.log(`⚠️ Route key ${routeKey} already exists.`);
    return content;
  }

  // Add route before closing bracket
  console.log(routeKey, routePath);
  // Targets the closing bracket right before the export default statement
  content = content.replace(
    /};\s*(export default)/,
    `  ${routeKey}: '${routePath}',\n};\n$1`,
  );
  return content;
}

/**
 * Add interface to types file
 */
function addInterfaceToFile(filePath, generatedInterface) {
  let content = fs.readFileSync(filePath, "utf8");

  // Append interface at the end
  content = `${content.trim()}\n\n${generatedInterface}`;
  return content;
}

function addApiMethodToFile(
  filePath,
  apiPayloadStructure,
  featureName,
  rawInterfaceName,
  combinedActionFuncName,
  actionNamePascal,
  isPaginated,
) {
  let content = fs.readFileSync(filePath, "utf8");

  const routesFileName = `${featureName}.routes`;
  const routeConstName = `${featureName.toUpperCase()}_ROUTES`;
  const typesFileName = `${featureName}.types`;

  // --- 2. Add Routes Import Safely ---
  if (!content.includes(routeConstName)) {
    const routesImport = `import ${routeConstName} from './${routesFileName}';`;
    const lines = content.split("\n");
    let insertLineIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (
        trimmed.startsWith("import") ||
        trimmed === "" ||
        trimmed.startsWith("}") ||
        trimmed.startsWith("{") ||
        trimmed.startsWith(",")
      ) {
        if (trimmed.includes("from")) {
          insertLineIndex = i + 1;
        }
      } else {
        break;
      }
    }
    lines.splice(insertLineIndex, 0, routesImport);
    content = lines.join("\n");
  }

  // --- 3. Add Interface Import into Multi-Line Block Safely ---
  const typesImportRegex = new RegExp(
    `import\\s+\\{([\\s\\S]*?)\\}\\s+from\\s+['"]\\.\\/${featureName}\\.types['"]\\s*;?`,
  );
  const importsMatch = content.match(typesImportRegex);

  if (importsMatch) {
    const rawInnerImports = importsMatch[1];
    const existingImportsArray = rawInnerImports
      .replace(/[\{\}]/g, "")
      .split(/[\s,]+/)
      .map((i) => i.trim())
      .filter(Boolean);

    if (!existingImportsArray.includes(rawInterfaceName)) {
      existingImportsArray.push(rawInterfaceName);

      const formattedImports = existingImportsArray.join(",\n  ");
      const newMultilineImport = `import {\n  ${formattedImports},\n} from "./${typesFileName}";`;

      content = content.replace(typesImportRegex, newMultilineImport);
    }
  } else {
    const newMultilineImport = `import {\n  ${rawInterfaceName},\n} from "./${typesFileName}";\n`;
    content = `${newMultilineImport}${content}`;
  }

  // --- 4. Extract and Map the API Object Dictionary ---
  const apiObjRegex = /const\s+(\w+Api)\s*=\s*\{([\s\S]*?)\};/;
  const apiObjMatch = content.match(apiObjRegex);

  if (apiObjMatch) {
    const apiObjName = apiObjMatch[1];
    let apiObjContent = apiObjMatch[2];

    if (content.includes(`const ${combinedActionFuncName}`)) {
      console.log(
        `⚠️ Method ${combinedActionFuncName} already exists in code implementation.`,
      );
      return content;
    }

    let keyName = combinedActionFuncName;
    const actionTypes = [
      "get",
      "create",
      "update",
      "delete",
      "fetch",
      "add",
      "remove",
      "change",
      "edit",
      "send",
    ];
    for (const action of actionTypes) {
      if (keyName.toLowerCase().startsWith(action)) {
        keyName = keyName.substring(action.length);
        keyName = keyName.charAt(0).toLowerCase() + keyName.slice(1);
        break;
      }
    }

    if (
      apiObjContent.includes(`${keyName}:`) ||
      apiObjContent
        .trim()
        .split(/[\s,]+/)
        .includes(keyName)
    ) {
      console.log(
        `⚠️ Mapping property reference "${keyName}" already present in ${apiObjName}.`,
      );
      return content;
    }

    const beforeApiObj = content.substring(0, apiObjMatch.index);
    const afterApiObj = content.substring(
      apiObjMatch.index + apiObjMatch[0].length,
    );

    const cleanedInnerContent = apiObjContent.trim();
    let updatedInnerEntries = "";

    if (cleanedInnerContent) {
      if (cleanedInnerContent.endsWith(",")) {
        updatedInnerEntries = `\n  ${cleanedInnerContent}\n  ${keyName}: ${combinedActionFuncName},\n`;
      } else {
        updatedInnerEntries = `\n  ${cleanedInnerContent},\n  ${keyName}: ${combinedActionFuncName},\n`;
      }
    } else {
      updatedInnerEntries = `\n  ${keyName}: ${combinedActionFuncName},\n`;
    }

    content = `${beforeApiObj.trim()}\n\n${apiPayloadStructure}\n\nconst ${apiObjName} = {${updatedInnerEntries}};\n${afterApiObj.trim()}\n`;
  } else {
    console.log(
      `❌ Critical Error: Could not find the export declaration block (e.g. const ${featureName}Api = {}) in the file.`,
    );
  }

  // --- 1. Handle Global Paginated Import Safely at the Start ---
  if (isPaginated) {
    const paginatedRegex =
      /import\s+\{\s*Paginated\s*\}\s+from\s+['"]@\/types['"]\s*;?/;
    if (!paginatedRegex.test(content)) {
      content = `import { Paginated } from "@/types";\n${content}`;
    }
  }

  console.log("=== UPDATED CONTENT ===");
  console.log(content);

  return content;
}

/**
 * Adds a React Query hook to the queries file, cleans up default imports,
 * handles parameter generation, and updates the query wrapper export collection.
 */
function addQueryToFile(
  filePath,
  hookTemplateStructure, // This will be dynamically generated outside or used as base
  combinedActionFuncName, // e.g., "getUser"
  featureName, // e.g., "orderDetails"
  queryParams = [], // Array of { key: string, type: string, optional: boolean }
) {
  let content = fs.readFileSync(filePath, "utf8");

  const apiName = `${featureName}Api`;
  const queriesObjName = `${featureName}Queries`;

  // --- 1. Fix TanStack useQuery Import ---
  if (
    !content.includes("useQuery") &&
    !content.includes("@tanstack/react-query")
  ) {
    content = `import { useQuery } from "@tanstack/react-query";\n${content}`;
  }

  // --- 2. Fix Feature API Default Import (Avoid Duplicates) ---
  // Matches "import orderDetailsApi from './orderDetails.api'" with various spaces/quotes
  const apiImportRegex = new RegExp(
    `import\\s+${apiName}\\s+from\\s+['"]\\.\\/${featureName}\\.api['"]\\s*;?`,
  );

  if (!apiImportRegex.test(content)) {
    const cleanApiImport = `import ${apiName} from "./${featureName}.api";`;
    // Prepend or add below react-query import
    if (content.startsWith("import")) {
      const lines = content.split("\n");
      lines.splice(1, 0, cleanApiImport);
      content = lines.join("\n");
    } else {
      content = `${cleanApiImport}\n${content}`;
    }
  }

  // --- 3. Extract Function Action Key Name ---
  // Converts "getUser" -> "user" or "getCollectionProducts" -> "collectionProducts"
  let actionKeyName = combinedActionFuncName;
  const actionTypes = [
    "get",
    "create",
    "update",
    "delete",
    "fetch",
    "add",
    "remove",
    "change",
    "edit",
    "send",
  ];
  for (const action of actionTypes) {
    if (actionKeyName.toLowerCase().startsWith(action)) {
      actionKeyName = actionKeyName.substring(action.length);
      actionKeyName =
        actionKeyName.charAt(0).toLowerCase() + actionKeyName.slice(1);
      break;
    }
  }

  // --- 4. Dynamic Parameter Extraction Mapping (Params Fix) ---
  const hookName = `${actionKeyName}Query`;

  // Create function parameters: "userId: string, status?: boolean"
  const functionSignatureParams = queryParams
    .map((p) => `${p.key}${p.optional ? "?" : ""}: ${p.type}`)
    .join(", ");

  // Create query array keys: "userId, status"
  const queryKeyDeps =
    queryParams.length > 0
      ? `, ${queryParams.map((p) => p.key).join(", ")}`
      : "";

  // Create callback call params: "userId, status"
  const apiCallArgs = queryParams.map((p) => p.key).join(", ");

  // Build the complete dynamic template structure
  const updatedHookTemplate = `export const ${hookName} = (${functionSignatureParams}) => {
  return useQuery({
    queryKey: ["${actionKeyName}-data"${queryKeyDeps}],
    queryFn: () => ${apiName}.${actionKeyName}(${apiCallArgs}),
  });
};`;

  // Skip generation if the hook function structure is already declared
  if (content.includes(`export const ${hookName}`)) {
    console.log(`⚠️ Query hook ${hookName} already exists in target file.`);
    return content;
  }

  // --- 5. Mount Hook and register it inside Queries Object mapping wrapper ---
  const queriesObjRegex = new RegExp(
    `const\\s+(${queriesObjName})\\s*=\\s*\\{([\\s\\S]*?)\\};`,
  );
  const queriesObjMatch = content.match(queriesObjRegex);

  if (queriesObjMatch) {
    let innerContent = queriesObjMatch[2].trim();
    const beforeObj = content.substring(0, queriesObjMatch.index);
    const afterObj = content.substring(
      queriesObjMatch.index + queriesObjMatch[0].length,
    );

    // Format registration keys inside export object cleanly
    let updatedInnerContent = "";
    let updatedInnerEntries = "";

    if (innerContent) {
      const endsWithComma = innerContent.endsWith(",");
      updatedInnerContent = `\n  ${innerContent}${endsWithComma ? "" : ",\n"}  ${hookName},\n`;
    } else {
      updatedInnerEntries = `\n  ${hookName},\n`;
    }

    // Insert new hook code immediately above the mapping collection object declaration
    content = `${beforeObj.trim()}\n\n${updatedHookTemplate}\n\nconst ${queriesObjName} = {${updatedInnerContent}};\n${afterObj.trim()}\n`;
  } else {
    // Fallback if the collection object is entirely missing
    content = `${content.trim()}\n\n${updatedHookTemplate}\n`;
  }

  console.log("=== UPDATED QUERIES FILE ===");
  console.log(content);
  return content;
}

// --- Main Pipeline Execution ---
async function main() {
  try {
    console.log("====================================================");
    console.log("🚀 API METHOD GENERATOR - EXISTING STRUCTURE MODE");
    console.log("====================================================");

    // 1. Directory Navigation to find api folder
    console.log("\nStep 1: Navigate to your Feature Directory...");
    const selectedFeaturePath = await chooseApiDirectory(BASE_FEATURES_PATH);
    if (!selectedFeaturePath) {
      rl.close();
      return;
    }

    // Check if we're in the api directory or need to navigate to it
    const apiDirectory = selectedFeaturePath.endsWith("api")
      ? selectedFeaturePath
      : path.join(selectedFeaturePath, "api");

    if (!fs.existsSync(apiDirectory)) {
      console.error(
        "❌ No api folder found. Please run the main generate-api script first.",
      );
      rl.close();
      return;
    }

    // Detect feature name from existing files
    const featureName = detectFeatureName(apiDirectory);
    if (!featureName) {
      console.error("❌ Could not detect feature name from existing files.");
      rl.close();
      return;
    }

    console.log(`✅ Detected feature: ${featureName}`);

    // 2. Metadata Information Gathering
    console.log("\nStep 2: Collect Action & Method Meta Data...");
    const actionType = (
      await askQuestion(
        "Enter action type (e.g., get, create, update, delete): ",
      )
    )
      .trim()
      .toLowerCase();
    const actionNameRaw = (
      await askQuestion("Enter action name (e.g., work site, collection): ")
    ).trim();
    const httpMethod = (
      await askQuestion("Enter HTTP method (GET, POST, PUT, PATCH, DELETE): ")
    )
      .trim()
      .toUpperCase();
    const routePath = (
      await askQuestion("Enter route path (e.g., /provider/worksite): ")
    )
      .trim()
      .replace(/^\//, "");

    // Transform Casing Contexts
    const actionNameCamel = removeAnyDash(
      actionNameRaw.toLowerCase().replace(/[\s-]+/g, "-"),
    );
    const actionNamePascal = toPascalCase(actionNameCamel);
    const actionNameSnake = actionNameRaw.toUpperCase().replace(/[\s-]+/g, "_");

    const combinedActionFuncName = `${actionType}${actionNamePascal}`;
    const routeKey = `${httpMethod}_${actionNameSnake}`;
    const interfaceName = `I${actionNamePascal}`;

    // 3. Query Parameter Collection Loop
    console.log("\nStep 3: Collect Query Parameters...");
    let queryParams = [];
    while (true) {
      const paramKey = (
        await askQuestion("Enter query param key (or press Enter to finish): ")
      ).trim();
      if (!paramKey) break;
      const paramType =
        (
          await askQuestion(
            `Enter type for "${paramKey}" (string, number, boolean): `,
          )
        ).trim() || "string";
      const isOptional =
        (await askQuestion(`Is "${paramKey}" optional? (y/N): `))
          .trim()
          .toLowerCase() === "y";
      queryParams.push({
        key: paramKey,
        type: paramType,
        optional: isOptional,
      });
    }
    queryParams = [...queryParams].sort((a, b) => {
      if (a.optional && !b.optional) return 1; // Move optional items down
      if (!a.optional && b.optional) return -1; // Keep required items up
      return 0;
    });

    // 4. Pagination Context
    const isPaginatedInput = (
      await askQuestion("\nIs the response data paginated? (y/N): ")
    )
      .trim()
      .toLowerCase();
    const isPaginated = isPaginatedInput === "y";

    // 5. Schema Data Typing Pipeline
    console.log("\nStep 5: Process Swagger Contract Schema Data...");
    console.log(
      "Paste the JSON response schema block from Swagger, then press Enter:",
    );
    const swaggerPayload = await askQuestion("> ");

    rl.close();

    // Generate TypeScript typings
    const generatedInterface = parseSwaggerToInterface(
      actionNamePascal,
      `"${swaggerPayload}`,
    );
    const typedTargetResponse = isPaginated
      ? `Paginated<${interfaceName}>`
      : interfaceName;

    // --- Update Existing Files ---

    // A. Update Routes File
    const routesFilePath = path.join(apiDirectory, `${featureName}.routes.ts`);
    let routesContent = addRouteToFile(
      routesFilePath,
      routeKey,
      routePath,
      featureName,
    );
    fs.writeFileSync(routesFilePath, routesContent, "utf8");

    // B. Update Types File
    const typesFilePath = path.join(apiDirectory, `${featureName}.types.ts`);
    let typesContent = fs.readFileSync(typesFilePath, "utf8");
    typesContent = addInterfaceToFile(typesFilePath, generatedInterface);
    fs.writeFileSync(typesFilePath, typesContent, "utf8");

    // C. Update API File
    const apiFilePath = path.join(apiDirectory, `${featureName}.api.ts`);
    const functionSignatureParams = queryParams
      .map((p) => `${p.key}${p.optional ? "?" : ""}: ${p.type}`)
      .join(", ");
    const paramMappingBody = queryParams
      .map((p) => `\t\t\t\t${p.key}: ${p.key},`)
      .join("\n");

    const routeConstName = `${featureName.toUpperCase()}_ROUTES`;
    const apiPayloadStructure = `const ${combinedActionFuncName} = async (${functionSignatureParams}) => {
  const { data } = await ApiInstance<${typedTargetResponse}>(${routeConstName}.${routeKey}${httpMethod !== "GET" ? ", {}" : ""}${queryParams.length > 0 ? `, {\n\t\tparams: {\n${paramMappingBody}\n\t\t}\n\t}` : ""});
  return data;
};`;

    let apiContent = addApiMethodToFile(
      apiFilePath,
      apiPayloadStructure,
      featureName,
      interfaceName,
      combinedActionFuncName,
      actionNamePascal,
      isPaginated,
    );
    fs.writeFileSync(apiFilePath, apiContent, "utf8");

    // D. Update Queries File
    const queriesFilePath = path.join(
      apiDirectory,
      `${featureName}.queries.ts`,
    );
    const hookQueryName = `${actionNameCamel}Query`;

    const hookTemplateStructure = `export const ${hookQueryName} = (${functionSignatureParams}) => {
  return useQuery({
    queryKey: ['${actionNameCamel}-data'${queryParams.length > 0 ? `, ${queryParams.map((p) => p.key).join(", ")}` : ""}],
    queryFn: () => ${featureName}Api.${combinedActionFuncName}(${queryParams.map((p) => p.key).join(", ")}),
  });
};`;

    let queriesContent = addQueryToFile(
      queriesFilePath,
      hookTemplateStructure,
      combinedActionFuncName,
      featureName,
      queryParams,
    );
    fs.writeFileSync(queriesFilePath, queriesContent, "utf8");

    console.log("\n====================================================");
    console.log("✅ API METHOD SUCCESSFULLY ADDED!");
    console.log("====================================================");
    console.log(`📁 Target Directory: ${apiDirectory}`);
    console.log(`📄 Updated: ${featureName}.routes.ts (Route added)`);
    console.log(`📄 Updated: ${featureName}.types.ts (Interface added)`);
    console.log(`📄 Updated: ${featureName}.api.ts (Method added)`);
    console.log(`📄 Updated: ${featureName}.queries.ts (Hook added)`);
    console.log("====================================================\n");
  } catch (error) {
    console.error("❌ An error occurred:", error);
    rl.close();
  }
}

main();
