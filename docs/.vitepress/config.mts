import { defineConfig } from 'vitepress'
import AutoSidebarPlugin from 'vitepress-auto-sidebar-plugin'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import { 
  InlineLinkPreviewElementTransform 
} from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/",
  lang: 'zh-CN',
  title: "MikTu",
  description: "只是一个笔记",
  markdown: {
    config: (md) => {

      md.use(groupIconMdPlugin)
      md.use(BiDirectionalLinks())
      md.use(InlineLinkPreviewElementTransform) 
    },
  },
  vite : {

    optimizeDeps: {
      exclude: [
        '@nolebase/vitepress-plugin-inline-link-preview/client',
        'vitepress'
      ],
    },
    ssr: {
      noExternal: [
        // 如果还有别的依赖需要添加的话，并排填写和配置到这里即可
        '@nolebase/vitepress-plugin-inline-link-preview',
      ],
    },
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
      { text: '安全工程师',
        items: [
          { text: 'Linux加固', link: '/Security_Engineer/linux_system_hardening/index/'},
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
})

