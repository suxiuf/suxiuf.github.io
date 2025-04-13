import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '渗透测试',
    items: [
      { text: 'TryHackMe', link: '/notes/penetration/1.tryhackme/1.introduce.md'},
      { text: 'OSCP', link: '/notes/penetration/2.oscp/1.test.md'},
    ],
  },
  { text: '安全工程师',
    items: [
      { text: 'Linux加固', link: '/notes/Security_Engineer/linux_system_hardening/README.md'},
      { text: '网络入侵调查', link: '/notes/InvestigatingTheCyberBreach/node_001.md'},
    ],
},
{ text: '随手记',
    items: [
      { text:'Linux基础命令', link: '/notes/GuideNote/Linux_Daily/1.Linux_Commands.md' },
      { text:'Windows日常',link: '/notes/GuideNote/Windows_Daily/1.windows_Commands.md' },
      { text:'VueSite',link: '/notes/GuideNote/Vue_Site/1.vitepress.md' },
      { text:'其他手记',link: '/notes/GuideNote/others/1.git.md' },
      { text:'笔记软件',link: '/notes/GuideNote/Note_Taking_Software/1.obsidian_plugins.md' },
  ],
}
])
