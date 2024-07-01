import { sidebar } from "vuepress-theme-hope";

export default sidebar(
  
  {
    text: "如何使用",
    icon: "laptop-code",
    prefix: "/demo/",
    link: "/demo/",
    activeMatch: "^/demo/",
    children: "structure",
  },
  {
      text: "",
      icon: "book",
      prefix: "posts/",
      activeMatch: "^/oscp/",
      children: "structure",
  },
);
