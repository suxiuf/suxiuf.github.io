---
title: linux基础-1
icon: file
order: 2
author: Miktu
date: 2024-07-011
category:
  - TryHackMe
tags:
  - 入门
  - 渗透
sticky: true
star: true
copyright: MikTu
---

# Man 手册使用

## 1-使用man 手册查询scp 命令复制整个目录的参数
```shell
man scp |grep 'entire'
```

![](../images/Pasted%20image%2020240711022658.png)

## 2-fdisk 分区命令列出当前分区

```bash
fdisk -l
```


![](../images/Pasted%20image%2020240711023239.png)


## 3-nano 打开文件时用`-B` 参数备份
```bash
man nano |grep backup
```

![](../images/Pasted%20image%2020240711023621.png)


## 4-Netcat 启动监听，并启用本地端口12345

- `nc -l -p 12345`

```bash
man nc | grep port
man nc | grep listen
```

![](../images/Pasted%20image%2020240711024350.png)

