import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import globals from "globals";

export default [
  js.configs.recommended,
  ...vue.configs["flat/recommended"],
  {
    files: ["**/*.{js,vue}"],
    languageOptions: {
      parser: vueParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        // Vue 3 Composition API 全局变量
        ref: "readonly",
        reactive: "readonly",
        computed: "readonly",
        watch: "readonly",
        watchEffect: "readonly",
        onMounted: "readonly",
        onUnmounted: "readonly",
        defineProps: "readonly",
        defineEmits: "readonly",
        defineExpose: "readonly",
        withDefaults: "readonly",
      },
    },
    rules: {
      // Vue 规则调整 - 关闭与 Prettier 冲突的规则
      "vue/html-self-closing": "off",
      "vue/multi-word-component-names": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/multiline-html-element-content-newline": "off",
      "vue/html-closing-bracket-newline": "off",
      "vue/first-attribute-linebreak": "off",
      "vue/html-indent": "off", // 让 Prettier 处理缩进
      "vue/max-attributes-per-line": "off", // 让 Prettier 处理属性换行
      "vue/require-default-prop": "off",
      
      // JavaScript 规则
      "no-undef": "error",
      "no-unused-vars": "warn",
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn", // 生产环境禁止，开发环境警告
      "no-dupe-keys": "error",
      "no-prototype-builtins": "error",
    },
  },
];