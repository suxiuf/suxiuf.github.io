---
title: TryHackMe-入门
icon: book
order: 1
author: Miktu
date: 2024-07-10
category:
  - oscp
tags:
  - 入门
  - 渗透
sticky: true
star: true
copyright: MikTu
---
# 第一次入侵 
利用gobuser入侵银行程序

## 1-查找隐藏的网站页面

```bash
gobuster -u http://fakebank.com -w wordlist.txt dir
```

在上面的命令中，`-u`用于声明我们正在扫描的网站，`-w`获取一个单词列表以查找隐藏的页面。


# 示例研究问题

```ad-info
title:Task1 
提取图片隐写的工具
- `apt install steghide` 安装 
- `steghide info file`  显示有关文件的信息，无论该文件是否有嵌入数据
- `steghide extract -sf file`  从文件中提取潜入数据

```

```ad-info
title:Task2 
BurpSuite 手动发送请求

- `repeater` 
![](../images/Pasted%20image%2020240711003348.png)

```

```ad-info
title: Task3
现代windows 密码存储在什么哈希格式中 

- `NTLM` ： 是在Windows系统上存储用户密码的加密格式。NTLM哈希存储在域控制器的SAM（安全帐户管理器）或NTDS文件中。
![](../images/Pasted%20image%2020240711003713.png)
```

```ad-info
title: Task4
Linux 中自动化任务名称
- `Cron jobs`
![](../images/Pasted%20image%2020240711004037.png)
```

```ad-info
title: Task5
二进制的简写
- `base 16` ：十六进制被广泛用作二进制的简写。因为它是以16为底，16是2的幂，所以从二进制到十六进制的转换是干净的。
- https://www.bilibili.com/video/BV1AL4y167Z1/?spm_id_from=333.337.search-card.all.click
- https://practicalee.com/binary/

![](../images/Pasted%20image%2020240711004312.png)
```

```ad-info
title:Task6

以`$6$`为开头的密码hash, 是以SHA-512加密的密码

- 哈希中的“\$6\$”表示使用SHA-512加密密码。
- https://github.com/frizb/Hashcat-Cheatsheet

![](../images/Pasted%20image%2020240711013524.png)
```

````ad-info
title: Task7
## 漏洞搜索
CVE编号是在发现漏洞时分配的，而不是在公布时分配的。请记住，如果漏洞是在年底发现的，或者确认和纠正漏洞的过程需要很长时间，那么发布日期可能是CVE日期的后年。在回答以下问题时请牢记这一点。
##  sploitdb 使用
```shell
searchsploit -h 
```

![](../images/Pasted%20image%2020240711021153.png)

```bash
searchsploit -w tomcat --cve 2016
```
````


# 安全分析专家

## 1-开源风险ip查询库
- AbuseIPDB
- Cisco Talos Intelligence

