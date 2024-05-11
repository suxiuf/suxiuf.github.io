import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/demo/",
  {
    text: "笔记",
    icon: "book",
    prefix: "/posts/",
    children: [
      { text: "oscp", icon: "pen-to-square", link: "/posts/oscp/index.md" },
      { text: "pmp", icon: "pen-to-square", link: "/posts/pmp/index.md" },
      { text: "攻防", icon: "pen-to-square", link: "/posts/range/index.md" },
    ],
  }

]);
