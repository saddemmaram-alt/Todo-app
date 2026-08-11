module.exports = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  testMatch: [
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.test.js",
  ],

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/src/styleMock.js",
  },
};