import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import obsidianPlugin from "./public/plugin-ob.js";
export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "MikTu",
  description: "一个个人知识库",
  plugins: [
  	obsidianPlugin()
  ],
  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
