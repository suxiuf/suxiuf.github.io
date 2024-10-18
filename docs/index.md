---
layout: home

hero:
  name: "MikTu"
  text: "只是个人笔记"
  tagline: 不积跬步，无以致千里
  image:
    src: /logo.png
    alt: Auto SideBar
  actions:
    - theme: brand
      text: 渗透测试
      link: /penetration/index
    - theme: alt
      text: Github
      link: https://github.com/suxiuf.github.io

features:
 
  - icon: 📖
    title: 个人笔记
    details: 本站只记录作者日常学习笔记
  - icon: 🛡
    title: 网络安全
    details: 笔记内容偏向网络安全方向
  - icon: 🤔
    title: 小白入门
    details: 笔记内容从最基础开始，记录了从小白开始学习网络安全的所有内容

  - icon: <Icon icon="simple-icons:tryhackme" />
    title: Tryhackme
    details: TryHackMe是一个在线网络安全学习平台平台，可以通过浏览器进行动手练习和实验。
    link: https://tryhackme.com
  - icon: <Icon icon="simple-icons:hackthebox" />
    title: HackTheBox
    details: Hack The Box 游戏化的网络安全技能提升、认证和人才评估软件平台，有一些可以免费练习的靶机，和最新的靶机以及付费课程。
    link: https://www.hackthebox.com
    
  - icon: <Icon icon="devicon:kalilinux-wordmark" />
    title: Kali Linux
    details: Kali Linux是一个开源的、基于Debian的Linux发行版，面向各种信息安全任务，例如渗透测试、安全研究、计算机取证和逆向工程。
    link: https://www.kali.org
 
---   

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(220deg, #bd34fe 20%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-90deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);

}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}


@keyframes ping {
  15%,
  to {
    transform: scale(1.25, 2);
    opacity: 0;
  }
}
</style>
