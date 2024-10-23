// https://vitepress.dev/guide/custom-theme
// @ts-ignore
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import { NolebaseInlineLinkPreviewPlugin } from '@nolebase/vitepress-plugin-inline-link-preview/client'
import '@nolebase/vitepress-plugin-inline-link-preview/client/style.css'
import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.use(NolebaseInlineLinkPreviewPlugin)
    app.use(NolebaseGitChangelogPlugin)
  }
} satisfies Theme
