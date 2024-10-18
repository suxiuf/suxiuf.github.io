---
titel: 本站配置
---
# 配置


本站基于[vitepress](https://vitepress.dev/zh/),使用自动生成侧边栏的插件[VitePress Auto SideBar Plugin](https://vitepress-auto-sidebar-plugin.netlify.app/),以及自动生成代码块图标的插件(https://vp.yuy1n.io/getting-started.html)

## 搜索
vitepress 默认主题自带搜索功能，只需按[官方文档](https://vitepress.dev/zh/reference/default-theme-search#search)配置即可：

>[!WARNING] 注意
>注意代码位置不要写错!!

::: code-group
```ts [.vitepress/config.mts]
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    search: { // [!code ++]
      provider: 'local' // [!code ++]
    } // [!code ++]
  }
})
```
:::

## 侧边栏

本站使用了[VitePress Auto SideBar Plugin](https://vitepress-auto-sidebar-plugin.netlify.app/).插件，此插件可以自动生成侧边栏,该插件需要配合目录结构和文章内部 frontmatter 配置使用。

### 安装

::: code-group

```sh [pnpm]
pnpm add vitepress-auto-sidebar-plugin --save-dev
```
:::

### 配置

需要在`.vitepress/config.mts`添加配置：

::: code-group

```ts [.vitepress/config.mts]
import { defineConfig } from 'vitepress'
import AutoSidebarPlugin from 'vitepress-auto-sidebar-plugin'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "MikTu",
  description: "只是一个笔记",
  vite: {  // [!code ++]
    plugins: [  // [!code ++]
      AutoSidebarPlugin({  // [!code ++]
        // 如果不指定 `srcDir`，则默认使用 `vitepress` 的 `srcDir`
        srcDir: './docs',  // [!code ++]
      }),  // [!code ++]
    ],  // [!code ++]
  },
  themeConfig: {
    ...
  }
})
```
:::





# Markdown


## 常用功能

### 文章顶部 frontmatter 配置

::: code-group

```md [index.md]
---
title: 文章名
collapsed: false | true  折叠
index: 1   文章排序顺序
hide: true  是否隐藏文章，默认fales
sortPrev: filesName 文章排序于指定文件之前
sortNext: filesName 文章排序于指定文件之前

---
```
::: 


::: code-group

```md [index.md]
---
group: true  对文件夹进行分组
groupTitle: Hello Web 🤖  文件夹分组标题，同 `title` 功效，但针对文件夹
groupIndex: 1 文件夹分组排序顺序，同 `index` 功效，但针对文件夹
groupAlone: true 取为单独分组，可设置多级目录中单独提取至顶层路由
collapsed: true 是否折叠文件夹，默认不显示折叠按钮
---
```
:::

### 首页 frontmatter 配置 icon

免费图标库有很多，但目前最全的，最好用的免费图标库是：https://yesicon.app/

::: code-group

```md [index.md]
---
layout: home

...

features:
 
  - icon: 📖
    title: 个人笔记
    details: 本站只记录作者日常学习笔记
...
...

  - icon: <img src="/icons/SimpleIconsTryhackme.svg" width="29px" height="29.32px">
    title: Tryhackme
    details: TryHackMe是一个在线网络安全学习平台平台，可以通过浏览器进行动手练习和实验。
    link: https://tryhackme.com
...
 
---  

```
:::

## 代码块图标

[快速开始](https://vp.yuy1n.io/getting-started.html)

**源码内容**

:::: code-group

````md [test.md]

::: code-group

```sh [npm]
npm install vitepress-plugin-group-icons
```

```sh [yarn]
yarn add vitepress-plugin-group-icons
```

```sh [pnpm]
pnpm add -D vitepress-plugin-group-icons
```

```sh [bun]
bun add vitepress-plugin-group-icons
```

:::

````
::::


**显示样式**

::: code-group

```sh [npm]
npm install vitepress-plugin-group-icons
```

```sh [yarn]
yarn add vitepress-plugin-group-icons
```

```sh [pnpm]
pnpm add -D vitepress-plugin-group-icons
```

```sh [bun]
bun add vitepress-plugin-group-icons
```

:::


# Markdown代码块

## 代码行高亮

**源码内容**

:::: code-group

````md [index.md]
::: code-group

```sh{1,3,5} [test.sh]
  echo 'this is line 1'
  echo 'this is line 2'
  echo 'this is line 3'
  echo 'this is line 4'
  echo 'this is line 5'
  echo 'this is line 6'
```
:::

````
::::

**显示样式**


::: code-group

```sh{1,3,5} [test.sh]
echo 'this is line 1'
echo 'this is line 2'
echo 'this is line 3'
echo 'this is line 4'
echo 'this is line 5'
echo 'this is line 6'
```
:::


**源码内容**

## 代码行删除和添加

:::: code-group

````md [test.md]

```js [*.js]
export default {
  data () {
    return {
      msg: 'Removed' // [!code --]
      msg: 'Added' // [!code ++]
    }
  }
}
```
````
::::

**显示样式**
:::: code-group

```js [*.js]
export default {
  data () {
    return {
      msg: 'Removed' // [!code --]
      msg: 'Added' // [!code ++]
    }
  }
}
```
:::: 


##  代码‘错误’和‘告警’

**源码内容**

:::: code-group
````md [*.md]

```js [*.js]
export default {
  data () {
    return {
      msg: 'Error', // [!code error]
      msg: 'Warning' // [!code warning]
    }
  }
}
```
````
:::: 

**显示样式**

:::: code-group
```js [*.js]
export default {
  data () {
    return {
      msg: 'Error', // [!code error]
      msg: 'Warning' // [!code warning]
    }
  }
}
```
:::: 
## 代码组

**源码内容**


:::: code-group
````md [test.md]
::: code-group

```js [config.js]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
}

export default config
```

```ts [config.ts]
import type { UserConfig } from 'vitepress'

const config: UserConfig = {
  // ...
}

export default config
```

:::

````
:::: 
**显示样式**

::: code-group

```js [config.js]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
}

export default config
```

```ts [config.ts]
import type { UserConfig } from 'vitepress'

const config: UserConfig = {
  // ...
}

export default config
```

:::

## 容器

### github风格容器
**y源码内容**
::: code-group
```md [test.md]
> [!NOTE]
> 强调用户在快速浏览文档时也不应忽略的重要信息。

> [!TIP]
> 有助于用户更顺利达成目标的建议性信息。

> [!IMPORTANT]
> 对用户达成目标至关重要的信息。

> [!WARNING]
> 因为可能存在风险，所以需要用户立即关注的关键内容。

> [!CAUTION]
> 行为可能带来的负面影响。
```
::: 

**显示样式**

> [!NOTE]
> 强调用户在快速浏览文档时也不应忽略的重要信息。

> [!TIP]
> 有助于用户更顺利达成目标的建议性信息。

> [!IMPORTANT]
> 对用户达成目标至关重要的信息。

> [!WARNING]
> 因为可能存在风险，所以需要用户立即关注的关键内容。

> [!CAUTION]
> 行为可能带来的负面影响。


### 自定义容器

**源码内容**
:::: code-group
````md [test.md]

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
````
::::
**显示样式**

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

