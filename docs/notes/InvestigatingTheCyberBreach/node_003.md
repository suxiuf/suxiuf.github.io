---
title: 建立电子取证实验室
createTime: 2024/12/24 12:08:49
permalink: /tdg8pg4y/
---
我真的恨死训练了。但我告诉我自己：别放弃，忍受当下的苦，然后一辈子都像个冠军一样活着  —— 穆罕默德-阿里

“每个人都会变得更好或更糟，没有人会保持不变。”

## 虚拟桌面

电子取证实验室可以通过VMware或VirtualBox安装。第一步是安装kali，就不在此赘述。

## 攻击虚机

我们利用以下几个易受攻击的系统，作为演练的目标。
- Metasploitable ：在Ubuntu上构建的易受攻击的操作系统
- DamVulnerable Web APP（DVWA） ：PHP和SQL构建的靶场
- Samurai Web Testing Framework（Samurai WTF）
- Mutillidae（OWASP Multillidae Web Application）

## Cuckoo 沙盒

书中提到一个可以本地安装的沙盒：Cuckoo ，但是安装比较费事，如果不想安装，可以利用在线沙盒分析网站：[Malwr](https://malwr.com)。当然，在国内也可以使用微步、360、深信服等在线沙盒。

Cuckoo沙盒是世界领先的开源自动恶意软件分析系统与沙盒环境，Cuckoo可以在安全的环境中运行任何类型的文件，并反馈执行相关文件时所有操作的详细结果，包括：网络连接、注册表更改、下载其他文件以及更多详细信息。
过时的Python环境或其他依赖，可能会让Cuckoo不能正常工作。Cuckoo可以在Windows、Mac OS中按照，但是强烈建议在Ubuntu中安装，因为Cuckoo 支持论坛将精力集中于指导Ubuntu安装。

### Cuckoo的安装

```ad-info
Cuckoo 最新版本2.0.6 不支持 python3，最适配系统为Ubuntu16.04
以下所有步骤都是在运行Cuckoo的虚机或专门的Cuckoo服务器中安装
```

**Cuckoo 安装的第一步是安装必备库**

```bash
sudo apt install python python-pip python-dev libffi-dev libssl-dev -y
sudo apt install python-virtualenv python-setuptools -y
sudo apt install libjpeg-dev zliblg-dev swig -y
```

**安装MogoDB**

Cuckoo 使用基于网络的界面，MongoDB是一个开源数据库，其以速度和有效的伸缩性著称，我们需要安装它。

```bash
sudo apt install mongodb
```

**安装PostgreSQL** 
Cuckoo 使用 PostgreSQL来跟踪恶意软件特性、记录数据和执行其他内务管理项目。我们需要安装PostgreSQL服务器。

```bash
sudo apt install postgresql libpq-dev
```

**安装虚拟化软件**

Cuckoo沙盒支持多种虚拟环境，他需要使用这些环境运行恶意软件。书中介绍了使用VirtualBox环境的安装和使用：

```bash
echo 'deb http://download.virtualbox.org/virtualbox/debian xenial contrib' | sudo tee -a /etc/apt/sources.list.d/virtualbox.list
wget -q https://www.virtualbox.org/download/oracle_vbox_2016.asc -O - | sudo apt-key add -
sudo apt update 
sudo apt install virtualbox-5.1
```

**安装TCPDump**


