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

function detectFeatureName(apiDir) {
  const files = fs.readdirSync(apiDir);
  const routesFile = files.find((f) => f.endsWith(".routes.ts"));
  if (routesFile) return routesFile.replace(".routes.ts", "");
  return null;
}

function extractExistingSchemas(typesFilePath) {
  if (!fs.existsSync(typesFilePath)) return [];
  const content = fs.readFileSync(typesFilePath, "utf8");
  const regex = /export\s+const\s+(\w+Schema)\s*=/g;
  const schemas = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    schemas.push(match[1]);
  }
  return schemas;
}

function extractMainVariables(routesFilePath, prefix) {
  if (!fs.existsSync(routesFilePath)) return [];
  const content = fs.readFileSync(routesFilePath, "utf8");
  const regex = new RegExp(`const\\s+(${prefix.toUpperCase()}_\\w+)\\s*=`, "g");
  const variables = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    variables.push(match[1]);
  }
  return variables;
}

/**
 * ---------------------------------------------------------------------------
 * Response-interface generation (rewritten)
 * ---------------------------------------------------------------------------
 * The previous implementation had two separate, divergent code paths (one for
 * OpenAPI-style `{ type, properties }` schemas, one for raw example JSON), a
 * fragile `isSwaggerSchema` heuristic that could misclassify input, and a
 * `findSchema()` walker that returned `null` for very common real-world
 * pastes (e.g. `{ "schema": { "$ref": "..." } }`, or a `responses.200...`
 * envelope whose innermost node is only a `$ref`). Any of those cases used to
 * silently fall through to a bare `// TODO` placeholder, i.e. an "empty"
 * interface, with no indication of *why* nothing was generated.
 *
 * This version:
 *  - accepts strict JSON, JS-object-literal syntax, AND common "almost JSON"
 *    pastes (single quotes, unquoted keys, trailing commas, // comments)
 *    via a tolerant multi-strategy parser;
 *  - uses one recursive builder that understands both OpenAPI schema nodes
 *    (`type`/`properties`/`items`/`allOf`/`$ref`) and plain example JSON,
 *    so there's a single code path instead of two that can disagree;
 *  - always produces a real interface when there is ANY usable object/array
 *    data, and only falls back to a `// TODO` comment (with a clear reason)
 *    when the input truly has nothing to build from (e.g. empty paste, or a
 *    bare unresolved `$ref` with no properties alongside it).
 */

function tryParseFlexibleJson(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // 1. Strict JSON
  try {
    return JSON.parse(trimmed);
  } catch (_) {
    /* fall through */
  }

  // 2. JS object/array literal (unquoted keys, single quotes, trailing commas
  //    are all valid JS syntax, just not valid JSON)
  try {
    return Function(`"use strict"; return (${trimmed});`)();
  } catch (_) {
    /* fall through */
  }

  // 3. Loose repair pass for near-JSON text (strip comments, normalize quotes,
  //    quote bare keys, drop trailing commas) then retry JSON.parse
  try {
    const repaired = trimmed
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_m, p1) => `"${p1.replace(/"/g, '\\"')}"`)
      .replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":')
      .replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(repaired);
  } catch (_) {
    /* fall through */
  }

  return null;
}

function looksLikeOpenApiSchema(node) {
  return (
    node &&
    typeof node === "object" &&
    !Array.isArray(node) &&
    (typeof node.properties === "object" ||
      node.type === "object" ||
      node.type === "array" ||
      Array.isArray(node.allOf) ||
      typeof node.items === "object")
  );
}

// Walks a Swagger/OpenAPI document fragment (paths, responses, content,
// schema wrappers, etc.) looking for the innermost usable schema node.
function findSchemaRoot(node, depth = 0) {
  if (!node || typeof node !== "object" || Array.isArray(node) || depth > 12) {
    return null;
  }

  if (looksLikeOpenApiSchema(node)) return node;

  if (node.schema && typeof node.schema === "object") {
    const found = findSchemaRoot(node.schema, depth + 1);
    if (found) return found;
  }

  if (node.content && typeof node.content === "object") {
    for (const val of Object.values(node.content)) {
      const found = findSchemaRoot(val, depth + 1);
      if (found) return found;
    }
  }

  if (node.responses && typeof node.responses === "object") {
    const preferredOrder = ["200", "201", "204", "default"];
    const codes = Object.keys(node.responses).sort((a, b) => {
      const ai = preferredOrder.indexOf(a);
      const bi = preferredOrder.indexOf(b);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    for (const code of codes) {
      const found = findSchemaRoot(node.responses[code], depth + 1);
      if (found) return found;
    }
  }

  for (const method of ["get", "post", "put", "patch", "delete"]) {
    if (node[method]) {
      const found = findSchemaRoot(node[method], depth + 1);
      if (found) return found;
    }
  }

  for (const [key, val] of Object.entries(node)) {
    if (["schema", "content", "responses", "get", "post", "put", "patch", "delete"].includes(key)) {
      continue;
    }
    if (val && typeof val === "object") {
      const found = findSchemaRoot(val, depth + 1);
      if (found) return found;
    }
  }

  return null;
}

// Builds one or more `export interface`/`export type` blocks from either an
// OpenAPI schema node or a plain example-JSON value.
function buildInterfacesFromNode(rootName, rootNode) {
  const subInterfaces = [];
  const usedNames = new Set();

  function uniqueName(base) {
    let name = base || "Item";
    // Avoid a sub-interface reusing the exact same name as the root type
    // (this happens for array-root responses, e.g. `I{Name}` as both the
    // `export type I{Name} = I{Name}Item[]` wrapper and the item shape).
    if (name === rootName) name = `${name}Item`;
    let i = 2;
    while (usedNames.has(name)) {
      name = `${base}${i}`;
      i += 1;
    }
    usedNames.add(name);
    return name;
  }

  function pascalSingular(name) {
    const pascal = (name || "Item").charAt(0).toUpperCase() + (name || "Item").slice(1);
    return pascal.length > 1 && pascal.endsWith("s") ? pascal.slice(0, -1) : pascal;
  }

  function mergeAllOf(node) {
    const refs = [];
    let merged = { properties: {}, required: [] };
    for (const branch of node.allOf || []) {
      if (branch && branch.$ref) {
        refs.push(`I${branch.$ref.split("/").pop()}`);
        continue;
      }
      if (branch && typeof branch === "object") {
        if (branch.properties) {
          merged.properties = { ...merged.properties, ...branch.properties };
        }
        if (Array.isArray(branch.required)) {
          merged.required = [...merged.required, ...branch.required];
        }
      }
    }
    if (node.properties) {
      merged.properties = { ...merged.properties, ...node.properties };
    }
    if (Array.isArray(node.required)) {
      merged.required = [...merged.required, ...node.required];
    }
    return { refs, merged };
  }

  function resolveSchemaType(node, propName) {
    if (!node || typeof node !== "object") return "any";

    if (node.$ref) {
      return `I${node.$ref.split("/").pop()}`;
    }

    if (Array.isArray(node.allOf)) {
      const { refs, merged } = mergeAllOf(node);
      const subName = uniqueName(pascalSingular(propName));
      const body = buildSchemaBody(merged.properties, merged.required);
      if (refs.length > 0) {
        subInterfaces.push(
          `export type I${subName} = ${refs.join(" & ")}${body.trim() ? ` & {\n${body}}` : ""};`,
        );
      } else {
        subInterfaces.push(`export interface I${subName} {\n${body}}`);
      }
      return `I${subName}`;
    }

    if (node.type === "array") {
      const itemType = resolveSchemaType(node.items, propName);
      return `${itemType}[]`;
    }

    if (node.type === "object" || (node.properties && typeof node.properties === "object")) {
      const subName = uniqueName(pascalSingular(propName));
      const body = buildSchemaBody(node.properties || {}, node.required || []);
      subInterfaces.push(`export interface I${subName} {\n${body}}`);
      return `I${subName}`;
    }

    if (Array.isArray(node.enum)) {
      return node.enum.map((v) => (typeof v === "string" ? `"${v}"` : v)).join(" | ") || "any";
    }

    switch (node.type) {
      case "string":
        return "string";
      case "integer":
      case "number":
        return "number";
      case "boolean":
        return "boolean";
      default:
        return "any";
    }
  }

  function buildSchemaBody(properties, required, indent = "  ") {
    let body = "";
    const req = Array.isArray(required) ? required : [];
    for (const [key, val] of Object.entries(properties || {})) {
      const typeStr = resolveSchemaType(val, key);
      const optional = !req.includes(key);
      body += `${indent}${key}${optional ? "?" : ""}: ${typeStr};\n`;
    }
    return body;
  }

  function resolveExampleType(value, propName) {
    if (value === null || value === undefined) return "any";
    if (Array.isArray(value)) {
      if (value.length === 0) return "any[]";
      const first = value[0];
      if (first && typeof first === "object" && !Array.isArray(first)) {
        const subName = uniqueName(pascalSingular(propName));
        subInterfaces.push(`export interface I${subName} {\n${buildExampleBody(first)}}`);
        return `I${subName}[]`;
      }
      return `${typeof first}[]`;
    }
    if (typeof value === "object") {
      const subName = uniqueName(pascalSingular(propName));
      subInterfaces.push(`export interface I${subName} {\n${buildExampleBody(value)}}`);
      return `I${subName}`;
    }
    return typeof value; // "string" | "number" | "boolean"
  }

  function buildExampleBody(obj, indent = "  ") {
    let body = "";
    for (const [key, val] of Object.entries(obj)) {
      const typeStr = resolveExampleType(val, key);
      body += `${indent}${key}: ${typeStr};\n`;
    }
    return body;
  }

  // --- OpenAPI-style schema node ---
  if (looksLikeOpenApiSchema(rootNode)) {
    if (Array.isArray(rootNode.allOf)) {
      const { refs, merged } = mergeAllOf(rootNode);
      const body = buildSchemaBody(merged.properties, merged.required);
      const main =
        refs.length > 0
          ? `export type I${rootName} = ${refs.join(" & ")}${body.trim() ? ` & {\n${body}}` : ""};`
          : `export interface I${rootName} {\n${body}}`;
      return [...subInterfaces, main].join("\n\n");
    }
    if (rootNode.type === "array" && rootNode.items) {
      const itemType = resolveSchemaType(rootNode.items, rootName);
      return [...subInterfaces, `export type I${rootName} = ${itemType}[];`].join("\n\n");
    }
    const body = buildSchemaBody(rootNode.properties || {}, rootNode.required || []);
    return [...subInterfaces, `export interface I${rootName} {\n${body}}`].join("\n\n");
  }

  // --- Plain example JSON ---
  if (Array.isArray(rootNode)) {
    if (rootNode.length === 0) {
      return `export type I${rootName} = any[];`;
    }
    const itemType = resolveExampleType(rootNode[0], rootName);
    return [...subInterfaces, `export type I${rootName} = ${itemType}[];`].join("\n\n");
  }
  if (rootNode && typeof rootNode === "object") {
    const body = buildExampleBody(rootNode);
    return [...subInterfaces, `export interface I${rootName} {\n${body}}`].join("\n\n");
  }

  return `export interface I${rootName} {\n  // TODO: Define properties\n}`;
}

function parseSwaggerToInterface(interfaceName, swaggerStr) {
  if (!swaggerStr || !swaggerStr.trim()) {
    return `export interface I${interfaceName} {\n  // TODO: Define properties (no schema was pasted)\n}`;
  }

  const parsed = tryParseFlexibleJson(swaggerStr);
  if (parsed === null) {
    return (
      `export interface I${interfaceName} {\n` +
      `  // TODO: Could not parse the pasted content as JSON.\n` +
      `  // Paste a valid JSON object (Swagger "Example Value" tab output, or a\n` +
      `  // resolved schema with "properties"), not the pseudo-code "Schema" view.\n` +
      `}`
    );
  }

  // A bare, unresolved $ref with nothing else useful alongside it can't be
  // turned into real fields — say so explicitly instead of emitting a
  // meaningless `{ $ref: string }` interface.
  if (
    parsed &&
    typeof parsed === "object" &&
    !Array.isArray(parsed) &&
    Object.keys(parsed).length === 1 &&
    typeof parsed.$ref === "string"
  ) {
    return (
      `export interface I${interfaceName} {\n` +
      `  // TODO: Unresolved reference "${parsed.$ref}".\n` +
      `  // Paste the referenced schema's own "properties" block instead.\n` +
      `}`
    );
  }

  const root = Array.isArray(parsed) ? parsed : findSchemaRoot(parsed) || parsed;

  try {
    return buildInterfacesFromNode(interfaceName, root);
  } catch (e) {
    return (
      `export interface I${interfaceName} {\n` +
      `  // TODO: Failed to generate interface automatically (${e.message}).\n` +
      `  // Please define properties manually.\n` +
      `}`
    );
  }
}

function addRouteToFile(
  filePath,
  routeKey,
  finalRouteValue,
  featureName,
  newVariableBlock = "",
) {
  let content = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf8")
    : "";
  const routesObjName = `${featureName.toUpperCase()}_ROUTES`;

  if (newVariableBlock) {
    const varName = newVariableBlock
      .split("=")[0]
      .replace(/const\s+/, "")
      .trim();
    if (!content.includes(varName)) {
      content = `${newVariableBlock}\n${content.trim()}\n`;
    }
  }

  const routesObjRegex = new RegExp(
    `const\\s+${routesObjName}\\s*=\\s*\\{([\\s\\S]*?)\\};`,
  );
  const match = content.match(routesObjRegex);
  let routesMap = new Map();

  if (match) {
    const innerContent = match[1];
    const lines = innerContent.split(/\r?\n|,/);

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith("//")) return;

      const index = trimmedLine.indexOf(":");
      if (index !== -1) {
        const key = trimmedLine.substring(0, index).trim();
        let value = trimmedLine.substring(index + 1).trim();

        if (value.endsWith(",")) {
          value = value.slice(0, -1).trim();
        }

        routesMap.set(key, value);
      }
    });
  }

  routesMap.set(routeKey, finalRouteValue);

  const groups = {
    GET: [],
    POST: [],
    PUT: [],
    PATCH: [],
    DELETE: [],
    OTHER: [],
  };

  for (const [key, val] of routesMap.entries()) {
    if (key.startsWith("GET_")) groups.GET.push(`  ${key}: ${val},`);
    else if (key.startsWith("POST_")) groups.POST.push(`  ${key}: ${val},`);
    else if (key.startsWith("PUT_")) groups.PUT.push(`  ${key}: ${val},`);
    else if (key.startsWith("PATCH_")) groups.PATCH.push(`  ${key}: ${val},`);
    else if (key.startsWith("DELETE_")) groups.DELETE.push(`  ${key}: ${val},`);
    else groups.OTHER.push(`  ${key}: ${val},`);
  }

  Object.keys(groups).forEach((method) => groups[method].sort());

  let generatedInner = "";
  if (groups.GET.length > 0)
    generatedInner += `  // ========================= GET ROUTES =========================\n${groups.GET.join("\n")}\n\n`;
  if (groups.POST.length > 0)
    generatedInner += `  // ========================= POST ROUTES =========================\n${groups.POST.join("\n")}\n\n`;
  if (groups.PUT.length > 0)
    generatedInner += `  // ========================= PUT ROUTES =========================\n${groups.PUT.join("\n")}\n\n`;
  if (groups.PATCH.length > 0)
    generatedInner += `  // ========================= PATCH ROUTES =========================\n${groups.PATCH.join("\n")}\n\n`;
  if (groups.DELETE.length > 0)
    generatedInner += `  // ========================= DELETE ROUTES =========================\n${groups.DELETE.join("\n")}\n\n`;
  if (groups.OTHER.length > 0)
    generatedInner += `  // ========================= OTHER ROUTES =========================\n${groups.OTHER.join("\n")}\n\n`;

  generatedInner = generatedInner.trimEnd();
  const freshRoutesBlock = `const ${routesObjName} = {\n${generatedInner}\n};`;

  if (match) {
    content = content.replace(routesObjRegex, freshRoutesBlock);
  } else {
    content = `${content.trim()}\n\n${freshRoutesBlock}\n\nexport default ${routesObjName};`;
  }

  return content;
}

function addInterfaceToFile(content, generatedInterface) {
  content = `${content.trim()}\n\n${generatedInterface}`;
  return content;
}

function addApiMethodToFile(
  filePath,
  apiPayloadStructure,
  featureName,
  typesToImport,
  combinedActionFuncName,
  httpMethod,
  isPaginated,
) {
  let content = fs.readFileSync(filePath, "utf8");
  const routeConstName = `${featureName.toUpperCase()}_ROUTES`;
  const typesFileName = `${featureName}.types`;

  if (!content.includes(routeConstName)) {
    content = `import ${routeConstName} from './${featureName}.routes';\n${content}`;
  }

  const typesImportRegex = new RegExp(
    `import\\s+\\{([^{}]+?)\\}\\s+from\\s+['"]\\.\\/${featureName}\\.types['"]\\s*;?`,
  );
  const importsMatch = content.match(typesImportRegex);
  
  const blacklistedTokens = ["from", "import", "Paginated", "@/types", '"@/types"', "'@/types'", ""];
  const neededTypes = (typesToImport || []).filter(Boolean);

  if (importsMatch) {
    const cleanImports = importsMatch[1]
      .replace(/[\{\};,]/g, " ")
      .split(/\s+/)
      .map((item) => item.trim().replace(/['"]/g, ""))
      .filter((item) => !blacklistedTokens.includes(item) && !item.includes("@") && !item.includes("/"));

    neededTypes.forEach((t) => {
      if (!cleanImports.includes(t)) {
        cleanImports.push(t);
      }
    });
    cleanImports.sort();

    const formattedImportBlock = `import {\n  ${cleanImports.join(",\n  ")},\n} from "./${typesFileName}";`;
    content = content.replace(typesImportRegex, formattedImportBlock);
  } else if (neededTypes.length > 0) {
    content = `import {\n  ${neededTypes.sort().join(",\n  ")},\n} from "./${typesFileName}";\n${content}`;
  }

  if (content.includes(`const ${combinedActionFuncName}`)) {
    console.log(`⚠️ Method ${combinedActionFuncName} already exists.`);
    return content;
  }

  const sectionComments = {
    GET: "// ========================= GET METHODS =========================\n",
    POST: "// ========================= POST METHODS ========================\n",
    PUT: "// ========================= PUT METHODS =========================\n",
    PATCH: "// ========================= PATCH METHODS =======================\n",
    DELETE: "// ========================= DELETE METHODS ======================\n",
  };

  const targetComment = sectionComments[httpMethod] || sectionComments.GET;
  const apiObjRegex = /const\s+(\w+Api)\s*=\s*\{([\s\S]*?)\};/;
  const apiObjMatch = content.match(apiObjRegex);

  if (apiObjMatch) {
    const apiObjName = apiObjMatch[1];
    let apiObjContent = apiObjMatch[2].trim();

    let methodKey = combinedActionFuncName.replace(
      /^(get|create|update|delete|post|patch)/i,
      (m) => m.toLowerCase(),
    );
    methodKey = methodKey.charAt(0).toLowerCase() + methodKey.slice(1);

    let fileBeforeApiObj = content.substring(0, apiObjMatch.index).trim();
    const fileAfterApiObj = content
      .substring(apiObjMatch.index + apiObjMatch[0].length)
      .trim();

    if (fileBeforeApiObj.includes(targetComment)) {
      fileBeforeApiObj = fileBeforeApiObj.replace(
        targetComment,
        `${targetComment}${apiPayloadStructure}\n\n`,
      );
    } else {
      fileBeforeApiObj = `${fileBeforeApiObj}\n\n${targetComment}${apiPayloadStructure}\n`;
    }

    const explicitKeys = apiObjContent
      .split(",")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.split(":")[0].trim());

    if (!explicitKeys.includes(methodKey)) {
      explicitKeys.push(methodKey);
    }

    explicitKeys.sort((a, b) => {
      const funcA = a.match(/^(get|add|create|update|delete|patch|del)/i)
        ? a
        : `get${a.charAt(0).toUpperCase() + a.slice(1)}`;
      const funcB = b.match(/^(get|add|create|update|delete|patch|del)/i)
        ? b
        : `get${b.charAt(0).toUpperCase() + b.slice(1)}`;

      const posA =
        fileBeforeApiObj.indexOf(`const ${a}`) !== -1
          ? fileBeforeApiObj.indexOf(`const ${a}`)
          : fileBeforeApiObj.indexOf(funcA);
      const posB =
        fileBeforeApiObj.indexOf(`const ${b}`) !== -1
          ? fileBeforeApiObj.indexOf(`const ${b}`)
          : fileBeforeApiObj.indexOf(funcB);

      return posA - posB;
    });

    const reorderedInnerObject = explicitKeys
      .map((key) => {
        const matchValue = apiObjContent
          .split(",")
          .find((line) => line.trim().startsWith(`${key}:`));
        if (matchValue) return `  ${matchValue.trim()}`;

        let matchedFuncName = combinedActionFuncName;
        if (key !== methodKey) {
          const regexFuncSearch = new RegExp(
            `const\\s+(\\w*${key}\\w*)\\s*=`,
            "i",
          );
          const found = fileBeforeApiObj.match(regexFuncSearch);
          matchedFuncName = found ? found[1] : key;
        }
        return `  ${key}: ${matchedFuncName}`;
      })
      .join(",\n");

    content = `${fileBeforeApiObj}\n\nconst ${apiObjName} = {\n${reorderedInnerObject},\n};\n\n${fileAfterApiObj}\n`;
  }

  if (isPaginated && !/import\s+\{\s*Paginated\s*\}\s+from\s+['"]@\/types['"]/.test(content)) {
    content = `import { Paginated } from "@/types";\n${content}`;
  }

  return content;
}

function addQueryToFile(
  filePath,
  hookTemplateStructure,
  hookName,
  typesToImport,
  featureName,
  isMutation = false,
  isPaginated = false,
) {
  let content = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf8")
    : "";
  const apiName = `${featureName}Api`;
  const queriesObjName = `${featureName}Queries`;
  const typesFileName = `${featureName}.types`;

  let neededHook = isMutation ? "useMutation" : "useQuery";
  if (!isMutation && isPaginated) {
    neededHook = "useInfiniteQuery";
  }

  const reactQueryImportRegex =
    /import\s+\{([^{}]+?)\}\s+from\s+['"]@tanstack\/react-query['"]\s*;?/;
  const rqMatch = content.match(reactQueryImportRegex);

  if (rqMatch) {
    const currentRqImports = rqMatch[1]
      .replace(/[\{\};,]/g, " ")
      .split(/\s+/)
      .map((i) => i.trim())
      .filter(Boolean);
    if (!currentRqImports.includes(neededHook)) {
      currentRqImports.push(neededHook);
    }
    const cleanRq = currentRqImports.filter(
      (i) =>
        (i.startsWith("use") ||
          i.includes("Query") ||
          i.includes("Mutation")) &&
        !i.includes("/") &&
        i !== "import" &&
        i !== "from",
    );
    cleanRq.sort();

    const updatedRqLine = `import { ${cleanRq.join(", ")} } from "@tanstack/react-query";`;
    content = content.replace(reactQueryImportRegex, updatedRqLine);
  } else {
    content = `import { ${neededHook} } from "@tanstack/react-query";\n${content}`;
  }

  if (!content.includes(`import ${apiName}`)) {
    content = `import ${apiName} from "./${featureName}.api";\n${content}`;
  }

  const typesImportRegex = new RegExp(
    `import\\s+\\{([^{}]+?)\\}\\s+from\\s+['"]\\.\\/${featureName}\\.types['"]\\s*;?`,
  );
  const importsMatch = content.match(typesImportRegex);

  const blacklistedTokens = [
    "from",
    "import",
    "Paginated",
    "@tanstack/react-query",
    "useQuery",
    "useMutation",
    "useInfiniteQuery",
    "unknown",
    "",
  ];

  const neededTypes = (typesToImport || []).filter(Boolean);

  if (importsMatch) {
    const cleanImports = importsMatch[1]
      .replace(/[\{\};,]/g, " ")
      .split(/\s+/)
      .map((item) => item.trim())
      .filter(
        (item) =>
          !blacklistedTokens.includes(item) &&
          !item.startsWith("@") &&
          !item.startsWith(".") &&
          !item.includes("/"),
      );

    neededTypes.forEach((t) => {
      if (!cleanImports.includes(t)) {
        cleanImports.push(t);
      }
    });
    cleanImports.sort();

    const formattedImportBlock = `import {\n  ${cleanImports.join(",\n  ")},\n} from "./${typesFileName}";`;
    content = content.replace(typesImportRegex, formattedImportBlock);
  } else if (neededTypes.length > 0) {
    content = `import {\n  ${neededTypes.sort().join(",\n  ")},\n} from "./${typesFileName}";\n${content}`;
  }

  content = content.replace(/^\s*[\r\n]/gm, "\n").trim();

  if (content.includes(`export const ${hookName}`)) return content;

  const queryCommentSection =
    "// ========================= QUERIES & INFINITE HOOKS =========================\n";
  const mutationCommentSection =
    "// ========================= MUTATION HOOKS =========================\n";
  const targetHeader = isMutation
    ? mutationCommentSection
    : queryCommentSection;

  const queriesObjRegex = new RegExp(
    `const\\s+(${queriesObjName})\\s*=\\s*\\{([\\s\\S]*?)\\};`,
  );
  const queriesObjMatch = content.match(queriesObjRegex);

  let fileBeforeObj = queriesObjMatch
    ? content.substring(0, queriesObjMatch.index).trim()
    : content.trim();
  const fileAfterObj = queriesObjMatch
    ? content
        .substring(queriesObjMatch.index + queriesObjMatch[0].length)
        .trim()
    : `export default ${queriesObjName};`;

  if (fileBeforeObj.includes(targetHeader)) {
    fileBeforeObj = fileBeforeObj.replace(
      targetHeader,
      `${targetHeader}${hookTemplateStructure}\n\n`,
    );
  } else {
    fileBeforeObj = `${fileBeforeObj}\n\n${targetHeader}${hookTemplateStructure}\n`;
  }

  let explicitKeys = [];
  if (queriesObjMatch) {
    explicitKeys = queriesObjMatch[2]
      .split(",")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  if (!explicitKeys.includes(hookName)) {
    explicitKeys.push(hookName);
  }

  explicitKeys.sort();

  const freshInnerObjectBlock = explicitKeys.map((k) => `  ${k}`).join(",\n");
  content = `${fileBeforeObj}\n\nconst ${queriesObjName} = {\n${freshInnerObjectBlock},\n};\n\n${fileAfterObj}\n`;

  return content;
}

// --- Main Pipeline Execution ---
async function main() {
  try {
    console.log("====================================================");
    console.log("🚀 SENIOR ARCHITECT - INFINITE HOOK TYPE BINDER");
    console.log("====================================================");

    console.log("\nStep 1: Navigate to your Feature Directory...");
    const selectedFeaturePath = await chooseApiDirectory(BASE_FEATURES_PATH);
    if (!selectedFeaturePath) {
      rl.close();
      return;
    }

    const apiDirectory = selectedFeaturePath.endsWith("api")
      ? selectedFeaturePath
      : path.join(selectedFeaturePath, "api");
    if (!fs.existsSync(apiDirectory)) {
      console.error("❌ No api folder found.");
      rl.close();
      return;
    }

    const featureName = detectFeatureName(apiDirectory);
    if (!featureName) {
      console.error("❌ Could not detect feature name.");
      rl.close();
      return;
    }
    console.log(`✅ Detected feature: ${featureName}`);

    console.log("\nStep 2: Collect Action & Method Meta Data...");
    const actionType = (
      await askQuestion(
        "Enter action type (e.g., get, create, update, delete): ",
      )
    )
      .trim()
      .toLowerCase();
    const actionNameRaw = (
      await askQuestion("Enter action name (e.g., invoice, work site): ")
    ).trim();
    const httpMethod = (
      await askQuestion("Enter HTTP method (GET, POST, PUT, PATCH, DELETE): ")
    )
      .trim()
      .toUpperCase();

    const routesFilePath = path.join(apiDirectory, `${featureName}.routes.ts`);
    const typesFilePath = path.join(apiDirectory, `${featureName}.types.ts`);
    const apiFilePath = path.join(apiDirectory, `${featureName}.api.ts`);
    const queriesFilePath = path.join(
      apiDirectory,
      `${featureName}.queries.ts`,
    );

    let finalRouteValue = "";
    let newVariableBlock = "";
    const featurePrefix = featureName.toUpperCase();

    const useMainVarChoice = (
      await askQuestion(
        "\nDo you want to use a Main Endpoint Variable for this route? (y/N): ",
      )
    )
      .trim()
      .toLowerCase();

    if (useMainVarChoice === "y") {
      const existingVars = extractMainVariables(routesFilePath, featureName);
      let selectedVar = null;

      if (existingVars.length > 0) {
        console.log(`\nFound existing main variables for [${featurePrefix}]:`);
        existingVars.forEach((v, idx) => console.log(`[${idx + 1}] 🔑 ${v}`));
        console.log(`[${existingVars.length + 1}] ➕ CREATE NEW VARIABLE`);
        console.log(`[${existingVars.length + 2}] ↩️ SKIP / USE PLAIN STRING`);

        const varChoice = await askQuestion(
          "\nSelect a variable option index: ",
        );
        const varIdx = parseInt(varChoice.trim(), 10) - 1;

        if (varIdx >= 0 && varIdx < existingVars.length) {
          selectedVar = existingVars[varIdx];
        } else if (varIdx === existingVars.length) {
          selectedVar = null;
        } else {
          selectedVar = "SKIP";
        }
      }

      if (selectedVar === "SKIP") {
        const rawPath = (
          await askQuestion("Enter route path (e.g., profile/user): ")
        )
          .trim()
          .replace(/^\//, "");
        finalRouteValue = `'${rawPath}'`;
      } else if (selectedVar) {
        const subPath = (
          await askQuestion(
            `Enter sub-path to append to \${${selectedVar}}/ (e.g., update): `,
          )
        )
          .trim()
          .replace(/^\//, "");
        finalRouteValue = subPath
          ? `\`\${${selectedVar}}/${subPath}\``
          : `\`\${${selectedVar}}\``;
      } else {
        console.log(
          `\nCreating a new variable... (Prefix "${featurePrefix}_" will be added automatically)`,
        );
        const userVarName = (
          await askQuestion(
            "Enter variable target name (e.g., BASE, URL, ADMIN): ",
          )
        )
          .trim()
          .toUpperCase()
          .replace(/[\s-]+/g, "_");
        const fullVarName = `${featurePrefix}_${userVarName}`;
        const varValue = (
          await askQuestion(
            `Enter path value for ${fullVarName} (e.g., account/profile): `,
          )
        )
          .trim()
          .replace(/^\//, "");

        newVariableBlock = `const ${fullVarName} = '${varValue}';`;

        const subPath = (
          await askQuestion(
            `Enter sub-path to append to \${${fullVarName}}/ (or press Enter to skip sub-path): `,
          )
        )
          .trim()
          .replace(/^\//, "");
        finalRouteValue = subPath
          ? `\`\${${fullVarName}}/${subPath}\``
          : `\`\${${fullVarName}}\``;
      }
    } else {
      const rawPath = (
        await askQuestion("Enter route path (e.g., /provider/invoice): ")
      )
        .trim()
        .replace(/^\//, "");
      finalRouteValue = `'${rawPath}'`;
    }

    const actionNameCamel = removeAnyDash(
      actionNameRaw.toLowerCase().replace(/[\s-]+/g, "-"),
    );
    const actionNamePascal = toPascalCase(actionNameCamel);
    const actionNameSnake = actionNameRaw.toUpperCase().replace(/[\s-]+/g, "_");

    const combinedActionFuncName = `${actionType}${actionNamePascal}`;
    const routeKey = `${httpMethod}_${actionNameSnake}`;

    let zodSchemaCode = "";
    let finalFormValuesTypeName = `${actionNamePascal}FormValues`;
    let hasPayload = ["POST", "PUT", "PATCH"].includes(httpMethod);

    if (hasPayload) {
      console.log("\nStep 3: Checking for Existing Validation Schemas...");
      const existingSchemas = extractExistingSchemas(typesFilePath);
      let selectedExistingSchema = null;

      if (existingSchemas.length > 0) {
        console.log("\nFound existing Schemas in this feature:");
        existingSchemas.forEach((schema, idx) => {
          const typeName = schema.replace("Schema", "FormValues");
          console.log(`[${idx + 1}] 📝 ${schema} (${typeName})`);
        });
        console.log(`[${existingSchemas.length + 1}] ➕ CREATE NEW SCHEMA`);

        const schemaChoice = await askQuestion(
          "\nSelect a schema option index: ",
        );
        const schemaIdx = parseInt(schemaChoice.trim(), 10) - 1;

        if (schemaIdx >= 0 && schemaIdx < existingSchemas.length) {
          selectedExistingSchema = existingSchemas[schemaIdx];
          finalFormValuesTypeName = selectedExistingSchema.replace(
            "Schema",
            "FormValues",
          );
          console.log(
            `\n✅ Reusing existing schema type: ${finalFormValuesTypeName}`,
          );
        }
      }

      if (!selectedExistingSchema) {
        console.log(
          "\nConfiguring New Request Body (Zod Validation Schema)...",
        );
        let hasRequiredFields = false;
        let schemaFields = [];

        while (true) {
          const fieldName = (
            await askQuestion(
              "Enter field name (or press Enter to finish body schema): ",
            )
          ).trim();
          if (!fieldName) break;

          const fieldType = (
            await askQuestion(
              `Enter type for "${fieldName}" (string, number, boolean, date): `,
            )
          )
            .trim()
            .toLowerCase();
          const isRequired =
            (await askQuestion(`Is "${fieldName}" required? (Y/n): `))
              .trim()
              .toLowerCase() !== "n";

          if (isRequired) hasRequiredFields = true;
          schemaFields.push({
            name: fieldName,
            type: fieldType,
            required: isRequired,
          });
        }

        let baseTranslationPath = "";
        if (hasRequiredFields) {
          baseTranslationPath = (
            await askQuestion(
              "\nEnter base translation path (e.g., resourceProvidor.invoice.form): ",
            )
          ).trim();
        }

        let fieldsZodString = "";
        schemaFields.forEach((f) => {
          let zodTypeStr = "z.string()";
          const msg = baseTranslationPath
            ? `i18n.t(\`${baseTranslationPath}.validation.${f.name}_required\`)`
            : `"${f.name} is required"`;

          if (f.type === "number") {
            if (f.required) {
              zodTypeStr = `z.coerce.number().min(1, { message: ${msg} })`;
            } else {
              zodTypeStr = `z.coerce.number().optional()`;
            }
          } else if (f.type === "boolean") {
            if (f.required) {
              zodTypeStr = `z.boolean({ required_error: ${msg} })`;
            } else {
              zodTypeStr = `z.boolean().optional()`;
            }
          } else {
            if (f.required) {
              zodTypeStr = `z.string().min(1, { message: ${msg} })`;
            } else {
              zodTypeStr = `z.string().optional()`;
            }
          }
          fieldsZodString += `  ${f.name}: ${zodTypeStr},\n`;
        });

        let initialValuesFields = "";
        schemaFields.forEach((f) => {
          let defaultVal = '""';
          if (f.type === "number") defaultVal = "0";
          if (f.type === "boolean") defaultVal = "false";
          if (f.type === "date")
            defaultVal = 'new Date().toISOString().split("T")[0]';
          initialValuesFields += `  ${f.name}: ${defaultVal},\n`;
        });

        zodSchemaCode =
          `export const ${actionNamePascal}Schema = z.object({\n${fieldsZodString}});\n\n` +
          `export type ${actionNamePascal}FormValues = z.infer<typeof ${actionNamePascal}Schema>;\n\n` +
          `export const initial${actionNamePascal}FormValues: ${actionNamePascal}FormValues = {\n${initialValuesFields}};\n`;
      }
    }

    console.log("\nStep 4: Collect URL Query Parameters (if any)...");
    let queryParams = [];
    while (true) {
      const paramKey = (
        await askQuestion("Enter query param key (or press Enter to finish): ")
      ).trim();
      if (!paramKey) break;
      const paramType =
        (
          await askQuestion(`Enter type for "${paramKey}" (string, number): `)
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
    // Required query params first, optional ones last (stable within each group)
    queryParams = queryParams.sort((a, b) => {
      if (a.optional === b.optional) return 0;
      return a.optional ? 1 : -1;
    });

    const isPaginated =
      (await askQuestion("\nIs the response data paginated? (y/N): "))
        .trim()
        .toLowerCase() === "y";

    if (isPaginated && httpMethod === "GET") {
      queryParams.push({ key: "PageNumber", type: "number", optional: true });
      queryParams.push({ key: "PageSize", type: "number", optional: true });
    }

    console.log("\nStep 5: Process Server Response Contract Schema Data...");
    console.log(
      "Paste the JSON response schema block from Swagger.\n" +
      "👉 When finished, type 'done' on a new line and press Enter:"
    );
    let swaggerLines = [];
    while (true) {
      const line = await askQuestion("> ");
      if (line.trim().toLowerCase() === "done" || line.trim() === "EOF") {
        break;
      }
      swaggerLines.push(line);
    }
    const swaggerPayload = swaggerLines.join("\n");
    rl.close();

    const responseInterfaceName = `I${actionNamePascal}Response`;
    const generatedInterface = parseSwaggerToInterface(
      `${actionNamePascal}Response`,
      swaggerPayload,
    );
    const typedTargetResponse = isPaginated
      ? `Paginated<${responseInterfaceName}>`
      : responseInterfaceName;

    // A. Update Routes File
    let routesContent = addRouteToFile(
      routesFilePath,
      routeKey,
      finalRouteValue,
      featureName,
      newVariableBlock,
    );
    fs.writeFileSync(routesFilePath, routesContent, "utf8");

    // B. Update Types File
    let typesContent = fs.readFileSync(typesFilePath, "utf8");
    if (zodSchemaCode) {
      let importsBlock = "";
      if (!typesContent.includes('import z from "zod";')) {
        importsBlock += `import z from "zod";\n`;
      }
      if (!typesContent.includes('import i18n from "@/lib/i18n";')) {
        importsBlock += `import i18n from "@/lib/i18n";\n`;
      }
      if (importsBlock) {
        typesContent = `${importsBlock}${typesContent.trim()}\n`;
      }
      typesContent = `${typesContent.trim()}\n\n${zodSchemaCode}`;
    }
    typesContent = addInterfaceToFile(typesContent, generatedInterface);
    fs.writeFileSync(typesFilePath, typesContent, "utf8");

    // C. Update API File
    // NOTE: TypeScript requires all required parameters to come before any
    // optional / default-valued ones. Query params can be optional while
    // `payload` is always required, so we can't just concatenate
    // "queryParams string" + "payload" blindly (that used to put a required
    // `payload` AFTER optional query params, which is invalid TS). Instead we
    // build individual {str, optional} entries and sort required-first while
    // preserving relative order within each group (stable sort).
    const signatureEntries = [];
    if (hasPayload) {
      signatureEntries.push({
        str: `payload: ${finalFormValuesTypeName}`,
        optional: false,
      });
    }
    queryParams.forEach((p) => {
      let str;
      if (isPaginated && p.key === "PageNumber") str = `PageNumber = 1`;
      else if (isPaginated && p.key === "PageSize") str = `PageSize = 10`;
      else str = `${p.key}${p.optional ? "?" : ""}: ${p.type}`;
      // Default-valued params (PageNumber/PageSize) behave like optional
      // params for ordering purposes too.
      signatureEntries.push({ str, optional: p.optional });
    });

    signatureEntries.sort((a, b) => {
      if (a.optional === b.optional) return 0;
      return a.optional ? 1 : -1;
    });

    const finalSignature = signatureEntries.map((e) => e.str).join(", ");

    const paramMappingBody = queryParams
      .map((p) => `\t\t\t\t${p.key}: ${p.key},`)
      .join("\n");
    const axiosConfig =
      queryParams.length > 0
        ? `, {\n\t\tparams: {\n${paramMappingBody}\n\t\t}\n\t}`
        : "";

    let finalArgsStr = "";
    if (httpMethod === "GET" || httpMethod === "DELETE") {
      finalArgsStr = axiosConfig;
    } else {
      finalArgsStr = hasPayload
        ? `, payload${axiosConfig}`
        : axiosConfig
          ? `, {}${axiosConfig}`
          : "";
    }

    const routeConstName = `${featureName.toUpperCase()}_ROUTES`;
    const apiPayloadStructure =
      `const ${combinedActionFuncName} = async (${finalSignature}): Promise<${typedTargetResponse}> => {\n` +
      `  const { data } = await ApiInstance.${httpMethod.toLowerCase()}(` +
      `\`/\${${routeConstName}.${routeKey}}\`${finalArgsStr});\n` +
      `  return data;\n};`;

    const apiTypesToImport = [responseInterfaceName];
    if (hasPayload) {
      apiTypesToImport.push(finalFormValuesTypeName);
    }

    let apiContent = addApiMethodToFile(
      apiFilePath,
      apiPayloadStructure,
      featureName,
      apiTypesToImport,
      combinedActionFuncName,
      httpMethod,
      isPaginated,
    );
    fs.writeFileSync(apiFilePath, apiContent, "utf8");

    // D. Update Queries File (Inject Hook + Infinite Query logic if paginated)
    const isMutationMethod = ["POST", "PUT", "PATCH", "DELETE"].includes(
      httpMethod,
    );
    let hookTemplateStructure = "";
    let hookName = "";
    const queryTypesToImport = [];

    if (isMutationMethod) {
      hookName = `use${actionNamePascal}Mutation`;
      
      let mutationFnParams = "()";
      let apiCallArgs = "";
      
      if (queryParams.length > 0 || hasPayload) {
        if (queryParams.length === 0 && hasPayload) {
          mutationFnParams = `payload: ${finalFormValuesTypeName}`;
          apiCallArgs = "payload";
        } else if (queryParams.length === 1 && !hasPayload) {
          const p = queryParams[0];
          mutationFnParams = `${p.key}: ${p.type}`;
          apiCallArgs = p.key;
        } else {
          const typeFields = queryParams.map((p) => `${p.key}${p.optional ? "?" : ""}: ${p.type}`);
          if (hasPayload) {
            typeFields.push(`payload: ${finalFormValuesTypeName}`);
          }
          mutationFnParams = `params: {\n      ${typeFields.join(";\n      ")}\n    }`;
          
          const argFields = queryParams.map((p) => `params.${p.key}`);
          if (hasPayload) {
            argFields.push("params.payload");
          }
          apiCallArgs = argFields.join(", ");
        }
      }

      if (hasPayload) {
        queryTypesToImport.push(finalFormValuesTypeName);
      }

      hookTemplateStructure =
        `export const ${hookName} = () => {\n` +
        `  return useMutation({\n` +
        `    mutationFn: (${mutationFnParams}) =>\n` +
        `      ${featureName}Api.${combinedActionFuncName}(${apiCallArgs}),\n` +
        `  });\n};`;
    } else if (isPaginated) {
      hookName = `use${actionNamePascal}InfiniteQuery`;
      queryTypesToImport.push(responseInterfaceName);
      
      const customQueryParams = queryParams.filter(
        (p) => p.key !== "PageNumber" && p.key !== "PageSize",
      );

      const functionSignatureParams =
        customQueryParams.length > 0
          ? `{ ${customQueryParams.map((p) => `${p.key}`).join(", ")} }: { ${customQueryParams.map((p) => `${p.key}${p.optional ? "?" : ""}: ${p.type}`).join("; ")} }`
          : "";

      const queryKeyDeps =
        customQueryParams.length > 0
          ? `, ${customQueryParams.map((p) => p.key).join(", ")}`
          : "";

      const apiCallArgs = queryParams
        .map((p) => {
          if (p.key === "PageNumber") return "pageParam as number";
          if (p.key === "PageSize") return "10";
          return p.key;
        })
        .join(", ");

      hookTemplateStructure =
        `export const ${hookName} = (${functionSignatureParams}) => {\n` +
        `  return useInfiniteQuery<${responseInterfaceName}, unknown>({\n` +
        `    queryKey: ['${actionNameCamel}-infinite'${queryKeyDeps}],\n` +
        `    queryFn: async ({ pageParam = 1 }) => {\n` +
        `      return await ${featureName}Api.${combinedActionFuncName}(${apiCallArgs});\n` +
        `    },\n` +
        `    initialPageParam: 1,\n` +
        `    getNextPageParam: (lastPage: any) => {\n` +
        `      if (lastPage.hasNextPage) {\n` +
        `        return lastPage.pageNum + 1;\n` +
        `      }\n` +
        `      return undefined;\n` +
        `    },\n` +
        `  });\n};`;
    } else {
      hookName = `use${actionNamePascal}Query`;
      const functionSignatureParams = queryParams
        .map((p) => `${p.key}${p.optional ? "?" : ""}: ${p.type}`)
        .join(", ");
      const queryKeyDeps =
        queryParams.length > 0
          ? `, ${queryParams.map((p) => p.key).join(", ")}`
          : "";
      const apiCallArgs = queryParams.map((p) => p.key).join(", ");

      hookTemplateStructure =
        `export const ${hookName} = (${functionSignatureParams}) => {\n` +
        `  return useQuery({\n` +
        `    queryKey: ['${actionNameCamel}-data'${queryKeyDeps}],\n` +
        `    queryFn: () => ${featureName}Api.${combinedActionFuncName}(${apiCallArgs}),\n` +
        `  });\n};`;
    }

    let queriesContent = addQueryToFile(
      queriesFilePath,
      hookTemplateStructure,
      hookName,
      queryTypesToImport,
      featureName,
      isMutationMethod,
      isPaginated,
    );
    fs.writeFileSync(queriesFilePath, queriesContent, "utf8");

    console.log("\n====================================================");
    console.log("✅ RAW RESPONSE INTERFACE BOUND AND IMPORTED CLEANLY!");
    console.log("====================================================");
  } catch (error) {
    console.error("❌ An error occurred:", error);
    rl.close();
  }
}

main();
