import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/demo/",
  {
    text: "oscp",
    icon: "book",
    prefix: "/oscp/",
    children: [],
  },
  { text: "pmp", icon: "pen-to-square", link: "/posts/pmp/index.md" },
  { text: "打靶记录", icon: "pen-to-square", link: "/posts/range/index.md" },

]);
