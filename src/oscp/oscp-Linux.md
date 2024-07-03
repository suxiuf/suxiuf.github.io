---
title: Linux-常用命令
icon: file
order: 2
author: Miktu
date: 2020-01-01
category:
  - oscp
tags:
  - linux
  - 渗透
sticky: true
star: true
copyright: MikTu
---

# 文件系统

Kali Linux 遵从 Filesystem Hierarchy Standard（FHS）目录结构

- `/bin`  -> 普通程序(ls、cd、cat、...)
- `sbin`  ->     (fdisk、mkfs、systcl、...)
- `/etc`  ->  配置文件
- `/tmp`  ->  临时文件
- `/usr/bin`   ->  应用程序（apt、ncat、nmap、...）
- `/usr/share`   -> 数据文件和应用程序支持文件

# 基本命令
## Man手册
- 大部分linux 命令行程序内置man手册，为用户提供命令查询帮助。
- Man手册包含命令概要、用途和描述，队员的选项、参数或开关。
- 手册内容包含以下几个部分（Section），编号如下：

| Section编号 | Section含义       |
| --------- | --------------- |
| 1         | 普通户用命令          |
| 2         | 内核系统调用的编程接口     |
| 3         | C语言库的编程接口       |
| 4         | 特殊文件，如设备节点和驱动程序 |
| 5         | 文件格式            |
| 6         | 游戏和娱乐相关，如屏幕保护等  |
| 7         | 其他              |
| 8         | 系统管理命令          |

### 使用说明
Man 命令默认显示`Section 1`  既：普通用户命令，命令使用格式如下：  

```shell
man <option>
```

Man手册可以通过`-k`  参数指定关键词，搜索所有包含关键词的`Section`内容。同时可以通过正则表达式过滤搜索，准确查找令详情。举例：

- 查看/etc/passwd 的文件格式

```Bash
man  -k "^passwd"  #or man -k 'passwd'
```

- 在上述命令的结果中可以看到 passwd 相关的man手册，其中一个是 passwd(5),这就是我们要的选项,可以进一步查看详情：

```Bash
man 5 passwd
```

### 运用示例

man手册查看openssl passwd的使用方式

```Bash
man -k "passwd"
man lssl "passwd"
openssl passwd -1 asd # openssl 生成密钥，并自动加盐
#vim 替换 /etc/passwd/中的密码，
```

## 搜索与查找
### which 
`which`命令的作用是在`$PATH`环境变量中搜索指定名称的文件。此变量中定义了一个目录列表，当发出指令时，linux 会在列表中搜索文件，当匹配到目标时，会显示完整路径。

```Bash
which sbd
```

```ad-info 
title: 注意

可以通过`echo $PATH` 查看当前系统环境变量包含路径
```

### locate 
- `locate` 是一个比较好用的搜索命令，它通过`locate.db` 一个内置的数据库来定位文件，而不是从磁盘查找。因此查找文件比较快捷。
- 可以通过`updatedb`命令升级`locate.db`

**示例：**

```Bash
sudo updatedb
locate  history
```

###  find

`find` 命令是这三种搜索工具中最复杂、最灵活的搜索工具。掌握它的语法有时很棘手，但它的功能强大，超出了正常的文件搜索。

```Bash
find / -mtime 0  #搜索最近24小时修改过的文件
                 # 参数：
     # -atime  访问时间
     # -ctime  变更时间
find . -type f  -iname '*.sh' -mmin -30 -ls  
    # 搜索最近30分钟修改过的文件
find . -name .svn -exec rm -rf {} \; 
    # 对搜索结果执行命令（删除）
find . -name .svn |xargs rm -rf 
    # 对搜索结果执行命令（删除）
    # -name : 文件名称 
find / -type f -perm -u=s -ls 2>`/dev/null 
    # 搜索启用SUID权限的文件 
    # -perm ：用户权限
    # -u=s  至少属主有S权限
    # u=s   属主只有S权限
find /test/ -type f -user kali -perm /220  -name test1
    # -type : 文件类型
    #  d:目录/l:链接/b:块设备/c:串行设备/s:套接字文件/f:文件
    # -user ：用户属主
    # -grep ：用户属组
find -name“*.txt”-maxdepth 1   
  # -maxdepth 1 表示查询目录深度为 1

find / -user root -type f -perm -o=w -name '*.sh' 2>/dev/null
```

## 管理系统服务

## 软件包管理

## SHELL与终端

## 环境变量

### 查看环境变量

- 查看当前shell

```Bash
echo $SHELL
```

- 定义环境变量

```Bash
a=123
echo$a
```

- 查看全部环境变量

```Bash
env
```

- 查看命令历史文件

```Bash
echo $HISTFILE
```

### 配置文件

- `/etc/environment`
- `/etc/profile`
- `~/.zshrc` or `~/.bashrc` ...

### 定义全局变量

- `export` 命令定义环境变量，子进程也会生效
- 使用案例：

```Bash
export b=10.11.1.220
ping -c 2 $b
```

## 路径管理
### pwd
 `pwd` 命令用来查看用户当前所在路径：

```Bash
pwd
```

### cd
`cd`  命令用于跳转路径，具体使用方式如下：

```Bash
cd  <dir>  # 跳转到目标目录
cd  ~      # 跳转到当前用户目录
cd  -      # 跳转到刚才的目录
```


###  ls
- `ls`  用于查看目录内容，用法如下：
```Bash
ls -l   # 列出文件属性
ls -a   # 列出隐藏文件
```

### mkdir 
`mkdir` 命令用来创建目录，具体使用如下：

- 新建目录

```Bash
mkdir newdir # 创建目录
mkdir "newdir one"  # 创建名称中包含空格的目录
mkdir "dir1" "dir2" # 同时创建两个目录
mkdir -p test/{recon,exploit,report}  # 创建一个目录及多个子目录
```

### rmdir
`rmdir`命令用于删除空目录：

```Bash
rmdir newdir 
```

### file
`file` 命令用于查看目录属性，使用方法如下：

```Bash
file  /etc/passwd
```


## 文本操作

## 进程管理

## 文件下载



## 其他常用命令
## Kali 使用小技巧
### 自定义窗口title
- **同一窗口开启多个终端** 
    -  开启：`Ctrl + Shift + T`。
    -  关闭：`Ctrl + Shift + W`。
- 定义标题：
    -   `Alt + Shift + S`
    -  或者双击标签标题

- 定义颜色：
    右键点击标签标题，选择`Change titl color`

**示例**：

![[../images/Pasted image 20240703192817.png]]


### 常用工具目录

- `/usr/share/`  目录下有常用字典、webshell、扫描脚本等：
     - seclists、webshell、worldlists、windows-resources、exploitdb、...
     - winpeas、mimikatz、powersploit、webshells

### 定义命令别名
一般会将常用的**长**命令定义成一个简短命令如：
- `web`  :  `alias web="python -m http.server 80"`
