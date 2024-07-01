import { sidebar } from "vuepress-theme-hope";

export default sidebar(
  '/demo/': [
    {
    text: "如何使用",
    icon: "laptop-code",
    prefix: "/demo/",
    link: "/demo/",
    activeMatch: "^/demo/",
    children: "structure",
  },
  ],
  '/': [{
      text: "OSCP",
      icon: "book",
      prefix: "/oscp/",
      activeMatch: "^/oscp/",
      children: "structure",
  },],
);
