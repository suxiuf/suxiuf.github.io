---
title: Linux基础-2
icon: file
order: 3
author: Miktu
date: 2024-07-011
category:
  - TryHackMe
tags:
  - linux
  - 渗透
sticky: true
star: true
copyright: MikTu
---
# Linux 基础
Linux是一个基于unix的命令行操作系统。有多种基于Linux的操作系统。最早是1991年发布

![](../images/Pasted%20image%2020240711211332.png)


````ad-info
title: 最简单的命令

```bash
echo TryHackMe   # 终端窗口打印提供的任何文本
whoami           # 查看当前登陆用户的用户名
```
````

````ad-info
title: 查找文件

- find 
- grep

````


````ad-info
title: 与文件夹交互

```bash
ls -R  # 列出子目录
pwd  # 查看当前路径
cat <file> # 查看文件内容 
```
````

````ad-info
title: shell 操作符
```bash
&   # 后台运行命令
&&  # 执行连续的命令，只有前一个命令执行成功，才执行后一个命令
>   # 输出重定向，替换
>>  # 输出重定向，追加
```
```` 


````ad-important
title:文本交互

```bash
touch <filename>      # 创建文件
file <filename>       # 查看文件类型
mv  <file1> <file2>   # 移动文件

```
````


````ad-important
title:su

`su -l <username>` 命令可以在切换用户后直接跳转到他的家目录


```bash
su -l user2
```
````


````ad-important
title:重要目录
```markdown
`/etc`  : 配置文件（etcetera缩写）

`/var`  : （var是变量数据的缩写）存服务或应用程序经常访问或写入的数据，如数据库、日志文件等。
`/root`：超级用户的主目录

`/temp`：这是在Linux安装中找到的唯一根目录。/tmp是“临时“的缩写，它是volatile目录，用于存储只需要访问一次或两次的数据。与计算机上的内存类似，一旦计算机重新启动，此文件夹中的内容将被清除。

在渗透测试中对我们有用的是，默认情况下，任何用户都可以写入此文件夹。这意味着一旦我们访问了一台机器，它就可以作为存储枚举脚本等东西的好地方。

```
````


