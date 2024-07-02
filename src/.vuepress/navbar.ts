import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/demo/",
  {
    text: "oscp",
    icon: "book",
    prefix: "/oscp/",
    children: "structure",
  }
]);
