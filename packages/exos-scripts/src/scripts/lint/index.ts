#!/usr/bin/env node

import path from "path";
const { ESLint } = require("eslint");
import { SOURCE_PATH } from "../../common/paths";
import getConfigToUse from "../../common/getConfigToUse";
import eslintrcReact = require("./.eslintrc.react");
import eslintrcLibrary = require("./.eslintrc.library");

const isLibrary = process.argv.find((item) => item === "--type=library") !== null;
const eslintrc = isLibrary ? eslintrcLibrary : eslintrcReact;

// Resolve configuration to use
const configToUse = getConfigToUse<{}>("lint.js", eslintrc);
console.info(configToUse.isCustom ? `Found custom lint at ${configToUse.customConfigPath}` : "Using default lint config");

async function main() {
  try {
    const fixFiles = process.argv.indexOf("--fix") !== -1;
    const filesFlagIndex = process.argv.indexOf("--files");
  
    // 1. Create an instance with the `fix` option.
    const eslint = new ESLint({
        baseConfig: configToUse.config,
        fix: fixFiles,
        useEslintrc: false,
    });
  
    let codeFolders: string[];
  
    if (filesFlagIndex !== -1 && (process.argv.length - 1) > filesFlagIndex) {
      codeFolders = [process.argv[filesFlagIndex + 1]];
    } else {
      codeFolders = [path.join(SOURCE_PATH, "/**/*.ts")];
    }
    // 2. Lint files. This doesn't modify target files.
    const results = await eslint.lintFiles(codeFolders);
  
    if (fixFiles) {
      // Modify the files with the fixed code.
      await ESLint.outputFixes(results);
    }
  
    // 4. Format the results.
    const formatter = await eslint.loadFormatter("stylish");
    const resultText = formatter.format(results);
  
    // 5. Output it.
    console.log(resultText);
  
    if (results.errorCount > 0 || results.warningCount > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
