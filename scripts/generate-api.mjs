import fs from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to capitalize the first letter (e.g., "conversation" -> "Conversation")
const toPascalCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Remove dashes and capitalize the letter after each dash (e.g., "service-provider" -> "serviceProvider")
const removeAnyDash = (str) => {
  return str
    .split('-')
    .map((word, index) => {
      const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
      return index === 0 ? word : capitalized;
    })
    .join('');
};

// Get first-level items (folders only)
const getFirstLevelItems = (dir) => {
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    return files
      .filter((file) => file.isDirectory())
      .map((file) => file.name);
  } catch (err) {
    console.error(`❌ Error reading directory: ${err.message}`);
    return [];
  }
};

// Display items in current directory
const displayItems = (items, currentPath) => {
  console.log(
    `\n📂 Current path: ./src/features/${currentPath || "(root)"}`
  );
  console.log("═".repeat(50));
  
  if (items.length === 0) {
    console.log("⚠️ No folders found in this directory.");
  } else {
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item}`);
    });
  }
  
  console.log(`${items.length + 1}. Create API files here`);
  console.log("═".repeat(50) + "\n");
};

// Interactive navigation
const navigateFeatures = (currentDir, currentPath = "") => {
  const items = getFirstLevelItems(currentDir);

  displayItems(items, currentPath);

  rl.question("Select an option: ", (answer) => {
    const choice = parseInt(answer);

    if (choice === items.length + 1) {
      // User chose to create API files here
      // Extract the last folder name as the feature name
      const lastFolderName = currentPath
        ? currentPath.split("/").pop()
        : "api";

      console.log(`\n📋 Detected feature name: ${lastFolderName}`);

      rl.question(
        `Use this name? (press Enter to confirm or type a different name): `,
        (customName) => {
          const featureName = customName.trim() || lastFolderName;

          createApiFiles(currentDir, featureName, currentPath);
        }
      );
    } else if (choice > 0 && choice <= items.length) {
      const selectedItem = items[choice - 1];
      const nextDir = path.join(currentDir, selectedItem);
      const nextPath = currentPath ? `${currentPath}/${selectedItem}` : selectedItem;

      // Check if it's a directory
      const stat = fs.statSync(nextDir);
      if (stat.isDirectory()) {
        navigateFeatures(nextDir, nextPath);
      }
    } else {
      console.log("❌ Invalid option. Please try again.");
      navigateFeatures(currentDir, currentPath);
    }
  });
};

// Create API files in the target directory
const createApiFiles = (targetDir, featureName, pathDisplay) => {
  const feature = removeAnyDash(featureName.toLowerCase().trim());
  const pascalFeature = toPascalCase(feature);
  const upperFeature = feature.toUpperCase();

  // Create "api" subdirectory for the feature
  const apiDir = path.join(targetDir, "api");

  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
    console.log(`\n📁 Created folder: ./src/features/${pathDisplay}/api`);
  } else {
    console.log(
      `\n⚠️ API folder already exists. Adding files to it...`
    );
  }

  // 1. Generate: [feature].routes.ts
  const routesContent = `const ${upperFeature}_ROUTES = {};

export default ${upperFeature}_ROUTES;
  `;

  // 2. Generate: [feature].types.ts
  const typesContent = `// Types for the ${feature} feature\n`;

  // 3. Generate: [feature].api.ts
  const apiContent = `import ApiInstance from '@/config/api-instance';
import ${upperFeature}_ROUTES from './${feature}.routes';

const ${feature}Api = {};

export default ${feature}Api;
  `;

  // 4. Generate: [feature].queries.ts
  const queriesContent = `import ${feature}Api from './${feature}.api';`;

  // Map files and write them to disk
  const filesToCreate = {
    [`${feature}.routes.ts`]: routesContent,
    [`${feature}.types.ts`]: typesContent,
    [`${feature}.api.ts`]: apiContent,
    [`${feature}.queries.ts`]: queriesContent,
  };

  Object.entries(filesToCreate).forEach(([fileName, content]) => {
    const filePath = path.join(apiDir, fileName);
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`  📄 Created: ${fileName}`);
  });

  console.log("\n✅ All files generated successfully!\n");
  rl.close();
};

// Start navigation from src/features
const featuresDir = path.join(process.cwd(), "src", "features");
navigateFeatures(featuresDir);
