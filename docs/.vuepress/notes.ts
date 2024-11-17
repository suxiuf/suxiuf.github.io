import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

const penetration = defineNoteConfig({
  dir: 'penetration',
  link: '/penetration/',
  sidebar: 'auto',
})
const Security_Engineer = defineNoteConfig({
  dir: 'Security_Engineer',
  link: '/Security_Engineer/',
  sidebar: 'auto',
})

const  GuideNote = defineNoteConfig({
    dir: 'GuideNote',
    link: '/GuideNote/',
    sidebar: 'auto',
  })

export const notes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [penetration,Security_Engineer,GuideNote,]
})



