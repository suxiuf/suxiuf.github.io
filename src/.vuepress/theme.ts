import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";
import { MR_HOPE_AVATAR } from "./logo.js";

export default hopeTheme({
  hostname: "https://suxiuf.github.io",

  author: {
    name: "MikTu",
    url: "https://suxiuf.github.io",
  },

  iconAssets: "fontawesome-with-brands",

  logo: "https://theme-hope-assets.vuejs.press/logo.svg",

  repo: "https://github.com/suxiuf/suxiuf.github.io",

  docsDir: "src",
  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页脚
  footer: "MikTu",
  displayFooter: true,

  // 博客相关
  blog: {
    description: "不积跬步，无以致千里。",
    intro: "/intro.html",
    medias: {
//      
      Gitee: "https://gitee.com/suxiuf/",
      GitHub: "https://github.com/suxiuf/",
      Gitlab: "https://gitlab.com/suixuf/",
    },
  },

  // 加密配置
  encrypt: {
    config: {
      "/demo/encrypt.html": ["1234"],
    },
  },

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  plugins: {
    blog: true,
    	search: true,

    mdEnhance: {
      align: true,
      attrs: true,
      codetabs: true,
      component: true,
      demo: true,
      figure: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      mark: true,
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      tasklist: true,
      vPre: true,
    },
   },
});
