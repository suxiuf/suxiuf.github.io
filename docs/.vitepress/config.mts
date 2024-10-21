import { defineConfig } from 'vitepress'
import AutoSidebarPlugin from 'vitepress-auto-sidebar-plugin'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { handleHeadMeta } from './utils/handleHeadMeta'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/",
  lang: 'zh-CN',
  title: "MikTu",
  description: "只是一个笔记",
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {  
    plugins: [ 
      groupIconVitePlugin(),
      AutoSidebarPlugin({  
        srcDir: './docs', 
      }), 
    ],  
  },
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '渗透测试',
        items: [
          { text: 'TryHackMe', link: '/penetration/index/'},
          { text: 'OSCP', link: '/penetration/oscp/1.network.md'},
        ],

      },
      { text: '本站配置', link: '/guide/guide.md' }
    ],
    search: { // [!code ++]
      provider: 'local' // [!code ++]
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 MIkTu'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/suxiuf/suxiuf.github.io' }
    ]
  },
  async transformHead(context) {
    return handleHeadMeta(context)
  },
})
