const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Next.jsの設定があるディレクトリ（例：プロジェクトルート）
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  // テスト実行環境はjsdomを使用（ブラウザのような環境）
  testEnvironment: "jest-environment-jsdom",
  // テスト実行前に自動で読み込むファイル（jest-domの設定等）
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

module.exports = createJestConfig(customJestConfig);
