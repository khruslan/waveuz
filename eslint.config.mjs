import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [".next/**", "node_modules/**", "legacy/**", "coverage/**", "playwright-report/**", "test-results/**"]
  }
];

export default eslintConfig;
