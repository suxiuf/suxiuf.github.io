import { defineThemeConfig } from 'vuepress-theme-plume'
import { navbar } from './navbar'
import { notes } from './notes'

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
  logo: 'https://theme-plume.vuejs.press/plume.png',
  // your git repo url
  docsRepo: '',
  docsDir: 'docs',
  appearance: true,
  profile: {
    avatar: 'https://theme-plume.vuejs.press/plume.png',
    name: 'MikTu',
    description: '只是个人笔记',
    // circle: true,
    //location: 'CHINA',
    // organization: '',
  },

  navbar,
  notes,
  social: [
    { icon: 'github', link: 'https://github.com/suxiuf/suxiuf.github.io' },
  ],

})
