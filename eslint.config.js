import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  
  {
    files: ["**/*.{js,jsx}"],
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.node, // ← AJOUTÉ: pour config Vite/Node
        test: true,
        it: true,
        describe: true,
        expect: true,
        vi: true,
        beforeAll: true,
        afterAll: true,
        beforeEach: true,
        afterEach: true,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      
      // ← MODIFIÉ: warn en dev, error en prod
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      
      // ← MODIFIÉ: plus permissif pour les vars inutilisées
      "no-unused-vars": [
        "warn", 
        { 
          varsIgnorePattern: "^[A-Z_]",
          argsIgnorePattern: "^_", // ← AJOUTÉ: ignore _param
          caughtErrorsIgnorePattern: "^_", // ← AJOUTÉ: ignore catch(_)
        }
      ],
      
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": "warn",
      
      // ← AJOUTÉ: règles utiles pour ton projet
      "eqeqeq": ["error", "always"], // === au lieu de ==
      "curly": ["error", "all"], // {} obligatoires
      "no-var": "error", // pas de var, let/const only
    },
    settings: {
      react: { version: "detect" },
    },
  },
  
  // ← AJOUTÉ: config spéciale pour les tests (moins strict)
  {
    files: ["**/*.test.{js,jsx}"],
    rules: {
      "no-console": "off", // console autorisé en test
    },
  },
]);