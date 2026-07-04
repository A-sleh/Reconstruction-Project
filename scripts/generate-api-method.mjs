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

function parseSwaggerToInterface(interfaceName, swaggerStr) {
  if (!swaggerStr || !swaggerStr.trim()) {
    return `export interface I${interfaceName} {\n  // TODO: Define properties\n}`;
  }
  try {
    const obj = JSON.parse(swaggerStr.trim());
    let subInterfaces = [];

    function buildInterfaceBody(targetObj, currentIndent = "  ") {
      let body = "";
      for (const [key, value] of Object.entries(targetObj)) {
        let type = typeof value;
        if (value === null) {
          type = "any";
        } else if (Array.isArray(value)) {
          if (value.length > 0) {
            if (typeof value[0] === "object" && value[0] !== null) {
              const subPascalName =
                key.charAt(0).toUpperCase() + key.slice(1).replace(/s$/, "");
              const childBody = buildInterfaceBody(value[0], "  ");
              subInterfaces.push(
                `export interface I${subPascalName} {\n${childBody}}`,
              );
              type = `I${subPascalName}[]`;
            } else {
              type = `${typeof value[0]}[]`;
            }
          } else {
            type = "any[]";
          }
        } else if (type === "object") {
          const subPascalName = key.charAt(0).toUpperCase() + key.slice(1);
          const childBody = buildInterfaceBody(value, "  ");
          subInterfaces.push(
            `export interface I${subPascalName} {\n${childBody}}`,
          );
          type = `I${subPascalName}`;
        }
        body += `${currentIndent}${key}: ${type};\n`;
      }
      return body;
    }

    const mainBody = buildInterfaceBody(obj, "  ");
    const mainInterface = `export interface I${interfaceName} {\n${mainBody}}`;
    return [...subInterfaces, mainInterface].join("\n\n");
  } catch (e) {
    return `export interface I${interfaceName} {\n  // TODO: Check manual fallback layout\n}`;
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

  // 1. حقن المتغيرات الرئيسية الجديدة في أعلى الملف دون تكرارها
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

  // 2. قراءة ذكية وآمنة للمسارات الحالية سطر بسطر (تتجنب الفشل بسبب التعليقات والعناوين)
  if (match) {
    const innerContent = match[1];
    // تقسيم النص بناءً على السطور أو الفواصل
    const lines = innerContent.split(/\r?\n|,/);

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      // تخطي السطور الفارغة أو السطور التي تبدأ بتعليقات مجموعات العمل
      if (!trimmedLine || trimmedLine.startsWith("//")) return;

      const index = trimmedLine.indexOf(":");
      if (index !== -1) {
        const key = trimmedLine.substring(0, index).trim();
        let value = trimmedLine.substring(index + 1).trim();

        // إزالة الفاصلة الزائدة في نهاية السطر إن وجدت لتخزين نظيف
        if (value.endsWith(",")) {
          value = value.slice(0, -1).trim();
        }

        routesMap.set(key, value);
      }
    });
  }

  // 3. إضافة المسار الجديد (أو تحديثه إذا كان له نفس الإسم تماماً) لضمان عدم الحذف أو التكرار
  routesMap.set(routeKey, finalRouteValue);

  // 4. تصنيف وفرز المجموعات البرمجية أبجدياً
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

  // 5. بناء هيكل المجموعات النصي من جديد مع الحفاظ على التنسيق النظيف للـ Clean Code
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

  // 6. استبدال الكتلة القديمة بالكتلة الجديدة الكاملة المدمجة
  if (match) {
    content = content.replace(routesObjRegex, freshRoutesBlock);
  } else {
    content = `${content.trim()}\n\n${freshRoutesBlock}\n\nexport default ${routesObjName};`;
  }

  return content;
}

function addInterfaceToFile(filePath, generatedInterface) {
  let content = fs.readFileSync(filePath, "utf8");
  content = `${content.trim()}\n\n${generatedInterface}`;
  return content;
}

function addApiMethodToFile(
  filePath,
  apiPayloadStructure,
  featureName,
  rawInterfaceName,
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
    `import\\s+\\{([\\s\\S]*?)\\}\\s+from\\s+['"]\\.\\/${featureName}\\.types['"]\\s*;?`,
  );
  const importsMatch = content.match(typesImportRegex);
  
  // FIXED: Added absolute paths, quotes, and symbols to blacklisted tokens
  const blacklistedTokens = ["from", "import", "Paginated", "@/types", '"@/types"', "'@/types'", ""];

  if (importsMatch) {
    const cleanImports = importsMatch[1]
      .replace(/[\{\};,]/g, " ")
      .split(/\s+/)
      .map((item) => item.trim().replace(/['"]/g, "")) // FIXED: Strips internal quotation marks if they leaked in
      .filter((item) => !blacklistedTokens.includes(item) && !item.includes("@") && !item.includes("/")); // FIXED: Extra defense against paths

    if (!cleanImports.includes(rawInterfaceName)) {
      cleanImports.push(rawInterfaceName);
    }
    cleanImports.sort();

    const formattedImportBlock = `import {\n  ${cleanImports.join(",\n  ")},\n} from "./${typesFileName}";`;
    content = content.replace(typesImportRegex, formattedImportBlock);
  } else {
    content = `import {\n  ${rawInterfaceName},\n} from "./${typesFileName}";\n${content}`;
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
    DELETE: "// ========================= DELETE METHODS ======================\n", // Fixed typo "k METHODS"
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

  // FIXED: Check ensuring we only add the global Paginated import if it's not present
  if (isPaginated && !/import\s+\{\s*Paginated\s*\}\s+from\s+['"]@\/types['"]/.test(content)) {
    content = `import { Paginated } from "@/types";\n${content}`;
  }

  return content;
}

/**
 * Senior Refactor: Handles segregation of Query/InfiniteQuery and Mutation hooks.
 * Injects the RAW Response type (e.g. IWorksitesResponse) securely into the file imports.
 */
function addQueryToFile(
  filePath,
  hookTemplateStructure,
  hookName,
  responseInterfaceName,
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

  // ==========================================
  // الخطوة 0: المُنظف التلقائي الصارم (Hard Auto-Cleaner)
  // يكتشف ويحذف أي أسطر مشوهة تحتوي على مسارات ملفات أو كلمات مفتاحية داخل الأقواس
  // ==========================================
  if (
    content.includes(`"./${featureName}.types"`) ||
    content.includes("import,")
  ) {
    // تنظيف السطور المشوهة تماماً وإعادتها لحالة مستقرة
    content = content.replace(
      /import\s+\{[\s\S]*?\}\s+from\s+['"]@tanstack\/react-query['"]\s*;?/g,
      "",
    );
    content = content.replace(
      /import\s+\{[\s\S]*?\}\s+from\s+['"]\.\/.*?\.types['"]\s*;?/g,
      "",
    );
  }

  // ==========================================
  // الخطوة 1: إدارة استيرادات React Query الحقيقية من مكتبتها الرسمية
  // ==========================================
  let neededHook = isMutation ? "useMutation" : "useQuery";
  if (!isMutation && isPaginated) {
    neededHook = "useInfiniteQuery";
  }

  const reactQueryImportRegex =
    /import\s+\{([\s\S]*?)\}\s+from\s+['"]@tanstack\/react-query['"]\s*;?/;
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
    // تصفية صارمة: الاحتفاظ بالخطافات الحقيقية فقط ومنع تسرب المسارات أو كلمة import
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

  // ==========================================
  // الخطوة 2: إدارة استيراد ملف الـ API الخاص بالـ Feature
  // ==========================================
  if (!content.includes(`import ${apiName}`)) {
    content = `import ${apiName} from "./${featureName}.api";\n${content}`;
  }

  // ==========================================
  // الخطوة 3: إدارة استيراد الـ Response Interfaces (قاعدتك الجديدة)
  // نقوم بالاستيراد فقط وحصراً إذا كانت العملية ليست Mutation (أي GET) وكانت Paginated
  // ==========================================
  const shouldImportType = !isMutation && isPaginated;

  const typesImportRegex = new RegExp(
    `import\\s+\\{([\\s\\S]*?)\\}\\s+from\\s+['"]\\.\\/${featureName}\\.types['"]\\s*;?`,
  );
  const importsMatch = content.match(typesImportRegex);

  // قائمة حظر حديدية تمنع الكلمات المفتاحية والمسارات والخطافات من دخول ملف الـ types
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

  if (shouldImportType && responseInterfaceName) {
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

      if (!cleanImports.includes(responseInterfaceName)) {
        cleanImports.push(responseInterfaceName);
      }
      cleanImports.sort();

      const formattedImportBlock = `import {\n  ${cleanImports.join(",\n  ")},\n} from "./${typesFileName}";`;
      content = content.replace(typesImportRegex, formattedImportBlock);
    } else {
      content = `import {\n  ${responseInterfaceName},\n} from "./${typesFileName}";\n${content}`;
    }
  } else {
    // إذا كانت العملية Mutation أو ليست مقسمة لصفحات، نقوم فقط بتنظيف التيبس القديمة الموجودة مسبقاً (إن وجدت) لضمان عدم بقاء أسطر فارغة
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

      if (cleanImports.length > 0) {
        const formattedImportBlock = `import {\n  ${cleanImports.join(",\n  ")},\n} from "./${typesFileName}";`;
        content = content.replace(typesImportRegex, formattedImportBlock);
      } else {
        content = content.replace(typesImportRegex, ""); // مسح البلوك تماماً لو أصبح فارغاً
      }
    }
  }

  // تنظيف الأسطر الفارغة المتكررة الناتجة عن عمليات المسح في أعلى الملف
  content = content.replace(/^\s*[\r\n]/gm, "\n").trim();

  if (content.includes(`export const ${hookName}`)) return content;

  // ==========================================
  // الخطوة 4: فرز وحقن الـ Hook الجديد تحت القسم المخصص له
  // ==========================================
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

  // ==========================================
  // الخطوة 5: تحديث كائن التصدير (Export Object) وترتيبه أبجدياً
  // ==========================================
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
          if (f.type === "number") zodTypeStr = "z.coerce.number()";
          if (f.type === "boolean") zodTypeStr = "z.boolean()";
          if (f.type === "date") zodTypeStr = "z.string()";

          if (f.required) {
            const msg = baseTranslationPath
              ? `i18n.t(\`${baseTranslationPath}.validation.${f.name}_required\`)\n`
              : `"${f.name} is required"`;
            zodTypeStr += `.min(1, { message: ${msg} })`;
          } else {
            zodTypeStr += ".optional()";
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
    queryParams = queryParams.sort((a, b) => a.optional - b.optional);

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
      "Paste the JSON response schema block from Swagger, then press Enter:",
    );
    const swaggerPayload = await askQuestion("> ");
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
      if (!typesContent.includes('import z from "zod";'))
        typesContent = `import z from "zod";\nimport i18n from "@/lib/i18n";\n${typesContent}`;
      typesContent = `${typesContent.trim()}\n\n${zodSchemaCode}`;
    }
    typesContent = addInterfaceToFile(typesFilePath, generatedInterface);
    fs.writeFileSync(typesFilePath, typesContent, "utf8");

    // C. Update API File
    let apiSignatureParams = [];
    if (queryParams.length > 0) {
      const sigString = queryParams
        .map((p) => {
          if (isPaginated && p.key === "PageNumber") return `PageNumber = 1`;
          if (isPaginated && p.key === "PageSize") return `PageSize = 10`;
          return `${p.key}${p.optional ? "?" : ""}: ${p.type}`;
        })
        .join(", ");
      apiSignatureParams.push(sigString);
    }
    if (hasPayload) {
      apiSignatureParams.push(`payload: ${finalFormValuesTypeName}`);
    }
    const finalSignature = apiSignatureParams.join(", ");

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

    let apiContent = addApiMethodToFile(
      apiFilePath,
      apiPayloadStructure,
      featureName,
      hasPayload ? finalFormValuesTypeName : responseInterfaceName,
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

    if (isMutationMethod) {
      hookName = `use${actionNamePascal}Mutation`;
      hookTemplateStructure =
        `export const ${hookName} = () => {\n` +
        `  return useMutation({\n` +
        `    mutationFn: (${finalSignature ? `params: ${finalSignature.includes(",") || queryParams.length > 0 ? `{ ${queryParams.map((p) => p.key.replace(/ = \d+/, "")).join(", ") + (hasPayload ? ", payload: " + finalFormValuesTypeName : "")} }` : "payload: " + finalFormValuesTypeName}` : "()"}) => ${featureName}Api.${
          combinedActionFuncName
            .replace(/^(create|post|get|update|delete|patch)/i, (m) =>
              m.toLowerCase(),
            )
            .charAt(0)
            .toLowerCase() +
          combinedActionFuncName
            .replace(/^(create|post|get|update|delete|patch)/i, (m) =>
              m.toLowerCase(),
            )
            .slice(1)
        }(${finalSignature ? (finalSignature.includes(",") || queryParams.length > 0 ? queryParams.map((p) => `params.${p.key.replace(/ = \d+/, "")}`).join(", ") + (hasPayload ? ", params.payload" : "") : "payload") : ""}),\n` +
        `  });\n};`;
    } else if (isPaginated) {
      // GENERATE ADVANCED INFINITE QUERY HOOK (Binds RAW response type into the Generic)
      hookName = `use${actionNamePascal}InfiniteQuery`;
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
      // REGULAR USE QUERY HOOK
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
      responseInterfaceName,
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
