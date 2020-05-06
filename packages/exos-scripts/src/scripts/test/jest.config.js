module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^enzyme$": "<rootDir>/test/enzyme.js"
  },
  // If the CI environment variable is set, run coverage
  collectCoverage: !!process.env.CI,
};
