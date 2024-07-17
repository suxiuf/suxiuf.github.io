---
title: 常见的服务与漏洞
icon: file
order: 4
author: Miktu
date: 2024-07-14
category:
  - TryHackMe
tags:
  - network
  - 渗透
sticky: true
star: true
copyright: MikTu
---
# SMB服务
## 了解SMB
SMB( Server Message Block) 服务器块 Protocol 
- 是一种客户端-服务器通信协议，用于共享网络上的文件、打印机、串行端口和其他资源的访问。
- SMB 协议被称为响应请求协议，这意味着它在客户端和服务器之间传输多个消息以建立连接。
- 客户端使用 TCP/IP（实际上是 RFC1001 和 RFC1002 中指定的 TCP/IP 上的 NetBIOS）、NetBEUI 或 IPX/SPX 连接到服务器。
- 建立连接后，客户端可以向服务器发送命令 (SMB)。
- 允许客户端访问共享、打开文件、读取和写入文件，以及通常执行您想要对文件系统执行的所有操作。
- 通过网络完成的。

![](../images/Pasted%20image%2020240715220703.png)

## SMB枚举（Enumerating）


- SMB通常是攻击者寻找敏感信息的绝佳起点-您可能会惊讶于这些共享中有时包含的内容。
- Enum4linux是一个用于枚举Windows和Linux系统上的SMB共享的工具。它基本上是samba包中工具的包装器，可以轻松地从目标中快速提取与SMB有关的信息。它已经安装在AttackBox上，但是如果你需要在自己的攻击机器上安装它，你可以从官方[github](https://github.com/portcullislabs/enum4linux)上安装。

````ad-info
title:Enum4Linux
- 语法：
    ```bash
    Enum4linux [options] ip
    ```
- Options

    ```bash
    -U  # 获取用户列表
    -M  # 获取机器（machine）列表
    -N  # 获取命名空间转储
    -S  # 获取共享列表
    -P  # 获取密码策略信息  
    -G  # 获取组和成员列表
    -a  # 所有上述（完整的基本枚举）
    ```
````

### Answer
````ad-info
title: question 1
**使用nmap 扫描，发现有多少端口是开放的？**

![](../images/Pasted%20image%2020240715224017.png)  

**答案**：3

````


````ad-info
title:  question 2
**SMB在什么端口上运行**

![](../images/Pasted%20image%2020240715224017.png)  

**答案**：139/445

````



````ad-info
title:  question 3
**使用`Enum4Linux`,进行完整的枚举，对于新使用者，他们的名字是什么**

![](../images/Pasted%20image%2020240715231357.png)

# 解析
SMB 协议默认全局配置的预设工作组名称为Workgoup,所有匿名登陆的人，都会叫这个名字。

![](../images/Pasted%20image%2020240715232031.png)    

**答案**：workgroup

````


````ad-info
title:  question 4
**机器的名字？**
![](../images/Pasted%20image%2020240715232512.png)

 **答案**：POLOSMB
````


````ad-info
title:  question 5
**操作系统版本？**
![](../images/Pasted%20image%2020240715232629.png)

**答案**：POLOSMB
````

````ad-info
title:  question 6
**我们需要调查？**

# 解析
**这里问的是我们接下来要关注的是哪个目录**
![](../images/Pasted%20image%2020240715233037.png)
从`Share Enumeration（共享枚举）` 中可以看到有一个目录是连接成功（`OK`）的，因此我们接下来要重点关注

**答案**：profiles
````

## SMB漏洞利用（Exploit）

````ad-tip
title: 常见漏洞类型
- 服务本身漏洞：如[CVE-2017 - 7494](https://www.cvedetails.com/cve/CVE-2017-7494/)（远程代码执行）
- 配置错误导致漏洞：允许匿名访问共享
````


````ad-tip
title: 枚举关注点

 虽然SMB存在诸如 [CVE-2017 - 7494](https://www.cvedetails.com/cve/CVE-2017-7494/)之类的漏洞，可以利用SMB来远程执行代码，但您更常见的情况是：由于系统中的配置错误导致产生了入侵系统的最佳方式。

因此，我们在枚举阶段需要注意
 - SMB共享路径
 - 感兴趣的共享名称
````


````ad-tip
title:SMBClient

SMBClient 是 Samba 组件的一部分，是客户端用来访问SMB服务器资源的一个套件。可以在这里找到安装文档[here.](https://www.samba.org/samba/docs/current/man-html/smbclient.1.html)

SMBClient 使用：
- 访问共享路径
```bash
smbclient //[IP]/[SHARE]
```

- 然后是`tags`
 ```text
 -U[name]: # 指定用户
 -p[prot]: # 指定端口
 ```
````


### 开始
````ad-info
title: 尝试`Anonymous`用户登陆
```bash
smbclient //10.10.62.9/profiels -U anonymous -p 445
```
````

````ad-info
title: 查看有价值的文件
```bash
ls
```
![](../images/Pasted%20image%2020240716222004.png)

```ad-info
title: 注意
- `Work Form Home information.txt`
- `.ssh`   # 一个目录
- .bashrc 
```
````

````ad-info
title: 下载到本地并查看
```bash
get "Work Form Home information.txt"
```
```ad-info
title: 注意
需要允许当前用户读写执行的权限的目录下登陆`smb`，才能下载。
**如： 在kali用户下执行smbclient ，则只能在允许kali用户读写执行的目录下载并保存文件**
```

- 从文件内容可以看到是管理员为某人开通的`ssh` 远程访问的邮件，以此作为线索可知，我们下一步需要进入`.ssh`去查看密钥文件。
````

````ad-info
title: 获取ssh远程登陆权限

- 跳转到`.ssh`
- 下载私钥
- 查看公钥并从中获取用户名
- 将私钥放到本地`.ssh`目录下，尝试登陆
- 成功登陆获取到`flag`
![](../images/Pasted%20image%2020240716222751.png)
````


