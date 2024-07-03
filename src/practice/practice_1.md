---
title: 基础命令练习
icon: file
order: 1
author: Miktu
date: 2024-07-03
category:
  - practice
tags:
  - linux
  - 渗透
sticky: true
star: true
copyright: MikTu
---
# 练习1-日志分析

````ad-question

通过以下命令下载日志文件并解压，分析日志，发现攻击证据（问题： 谁在攻击，做了什么？）

```shell
wget http://www.offensive-security.com/pwk-files/access_log.txt.gz
gunzip access_log.txt.gz
```
````


# 解题：
## 解题思路：

```markmap
# 日志分析
- 确定日志格式
- 确定日志量
- 筛选所有客户端IP，并统计请求数量
- 查看较大数量的IP的访问日志内容，找到可疑关键字
- 确定攻击行为
```

## 确定日志文件格式
通过查看日志文件前10行，确定日志内容格式：

```shell
head access.log.txt  # 默认显示前10行
```

可知日志文件从左到右，每列数据类型依次是：

```text
ip  timestamp HTTPrequest  d-url status-code  s-app   d-doman
```

## 确定日志量
 - 经以下命令统计，发现共有`1173`条日志：
```shell
wc -l access.log.txt
```

**结果截图：**
![[../images/Pasted image 20240703232322.png]]

## 过滤所有客户端IP,并统计数量

- 利用以下命令进行统计查询， 发现`1173`条访问，由9个IP访问的行为：

```shell
cat access.log.txt |cut -d  " " -f 1 | sort -u
```

**结果截图：**
![[../images/Pasted image 20240703233422.png]]

- 统计IP访问次数,日志记录的`1173`条访问记录中，有`1038`条是由`IP：208.68.234.99` 发起;因此判断该ip可能存在异常行为。  

```shell
cat access.log.txt |cut -d  " " -f 1 | sort | uniq -c 
```

**结果截图：**

![[../images/Pasted image 20240703234629.png]]

## 统计可疑IP请求资源
再次对日志格式进行分析， 并以 `"`  作为分隔符，对可疑`IP`请求的资源进行日过滤，发现其所有访问请求资源均为`GET //admin HTTP/1.1`，可确定此IP攻击行为是“密码爆破”。

```shell
cat access.log.txt |grep "208.68.234.99"  | cut -d "\"" -f 2 | uniq -c
```

**结果截图：**
![[../images/Pasted image 20240704000722.png]]

## 分析攻击结果
通过以下命令，近一步对可疑IP: `208.68.234.99`  的请求结果进行统计查看，发现其他请求返回的状态码为`401`但是有一条请求的状态码为`200`，判断密码 破解成功。
```shell
cat access.log.txt |grep "208.68.234.99" uniq -c
```

**结果截图：**

![[../images/Pasted image 20240704000806.png]]

# 结论

```ad-check
title: answer
IP : 208.68.234.99 对 目标引用进行了密码爆破攻击，并破解成功


