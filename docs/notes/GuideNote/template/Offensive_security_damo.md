---

title: Offensive Security Certified Expert Exam Report

author:

- "OSID: XXXX"

- student@youremailaddress.com

date: 2020-07-25

subject: Markdown

keywords:

- Markdown

- Example

subtitle: OSCE Exam Report

lang: en

titlepage: true

titlepage-color: 483D8B

titlepage-text-color: FFFAFA

titlepage-rule-color: FFFAFA

titlepage-rule-height: 2

book: true

classoption: oneside

code-block-font-size: \scriptsize

---


# High-Level Summary

  

While performing penetration tests, I discovered several alarming vulnerabilities on Offensive Security's network. These vulnerabilities were successfully exploited and allowed me to gain access to the system. A brief explanation is as follows:

  

- 192.168.xx.xx (hostname) - Name of initial exploit

- 192.168.xx.xx（主机名）-初始漏洞的名称

- 192.168.xx.xx (hostname) - Name of initial exploit

- 192.168.xx.xx（主机名）—初始漏洞的名称



# Recommendations

recommend patching the vulnerabilities identified during the testing to ensure that an attacker cannot exploit these systems in the future. One thing to remember is that these systems require frequent patching and once patched, should remain on a regular patch program to protect additional vulnerabilities that are discovered at a later date.

  
# Information Gathering

信息收集

  

The information gathering portion of a penetration test focuses on identifying the scope of the penetration test. During this penetration test, I was tasked with exploiting the exam network. The specific IP addresses were:

  

渗透测试的信息收集部分侧重于确定渗透测试的范围。 在这次渗透测试中，我的任务是利用考试网络。 具体的IP地址为：

  
Exam Network(考试网)


- 192.168.

- 192.168.

- 192.168.

- 192.168.

  

# Penetration

  

本次渗透测试成功access了X个系统中的X个，以下是对本次渗透测试过程的详细记录，内容包括漏洞的发现和利用漏洞突破系统并获取权限的过程：

  

# Target  1：172.16.203.134

  

## Service Enumeration

服务枚举

  

利用Nmap工具对发现的IP地址逐一进行服务枚举：

```shell
sudo nmap
```

  
- Port Scan Results：

| Server IP Address | Ports Open                               |
| ----------------- | ---------------------------------------- |
| 192.168.x.x       | **TCP**: 1433,3389<br>**UDP** : 1434,161 |
|                   |                                          |

### FTP Enumeration

  FTP枚举

  在手动枚举过程中发现FTP版本是2.3.4,该版本容易出现漏洞

### 初始访问

  
漏洞说明：Ability Server 2.34在STOR字段中存在缓冲区溢出漏洞。 攻击者可以利用此漏洞导致任意远程代码执行并完全控制系统。

  
漏洞修复：Ability Server的发布者已经发布了一个补丁来修复这个已知的问题。 可以在这里找到：http：//www.code-centerers.com/abilityserver/

  
严重度：危重
  

重现攻击的步骤： XX 网站已公开漏洞利用代码，尝试使用已知脚本进行漏洞利用：
  

```shell
python ability-2.34-ftp-stor.py
```

  漏洞利用脚本如下：
  
```
脚本代码
```

   

```python
test
```

#### 验证截图

  
*此处截图*

### 权限提升

  描述

```shell
命令
```

  
#### 验证截图

  
*此处截图*

  ### 获取flag

描述

```shell
命令
```

#### 验证截图

*此处截图*