import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "MikTu",
  description: "一个个人知识库",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
