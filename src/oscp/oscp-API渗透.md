---
title: api渗透
icon: file
order: 3
author: Miktu
date: 2024-07-10
category:
  - oscp
tags:
  - api
  - 渗透
sticky: true
star: true
copyright: MikTu
---

# API 概念

# 常见API 类型

## soap
## rest
    基于文档，返回信息就是'json'文档
    常见安全问题： 搜索一个用户名，就返回此用户的所有信息，甚至会返回其他用户的信息
## graphql

# API 渗透思路

- 白盒： API 接口文档
- 黑盒：爆破枚举发现API节点名
- 验证其可操作性功能
- 业务逻辑漏洞
- 常规WEB漏洞类型
- API 命名规则特征： `api_name/v1/`
# 实操练习
靶场： 8章 第二台

工具：burpsuite、gobuster


## 路径爆破
工具：gobuster

### 创建python文件

```python
{GOBUSTER}
```



```shell
gobuster dir -u http://192.168.243.16:5002  -w /usr/share/wordlists/dirb/commont.txt  -p pattern 
```

老师，我是想问python 文件的内容，就是gobuster 引用的那个

- 根据客户端返回提示不断修改请求内容

![](../images/Pasted%20image%2020240706104743.png)

![](../images/Pasted%20image%2020240706105615.png)



![](../images/Pasted%20image%2020240706105858.png)