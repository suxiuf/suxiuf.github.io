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
{ text: '杂记',
    items: [
      { text:'Vitepress', link: '/notes/GuideNote/vitepress.md' },
      { text:'Vuepress', link: '/notes/GuideNote/vuepress.md' },
  ],
}
])
