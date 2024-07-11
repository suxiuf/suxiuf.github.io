---
title: Linux-常用命令
icon: file
order: 2
author: Miktu
date: 2024-07-03
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


# SHELL与Terminal
- Shell 是Linux系统的核心组件，作为操作系统和用户交互的接口
- 接收用户输入的指令，并交由内核执行
- Terminal（终端）是一个调用shell的窗口
- 常见的shell包括：bash、zsh、fish ...

# 环境变量

## 查看环境变量

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

## 配置文件

- `/etc/environment`
- `/etc/profile`
- `~/.zshrc` or `~/.bashrc` ...

## 定义全局变量

- `export` 命令定义环境变量，子进程也会生效
- 使用案例：

```Bash
export b=10.11.1.220
ping -c 2 $b
```

# `history`查看命令历史

`history`命令可以查看当前用户的历史命令，如果想执行以前执行过的命令则使用`'!'+ `编号；

历史命令以文件形式存储，一般在 `~/.bash_history`, kali 在`~/.zsh_history`

## history 文件配置

- 针对history的配置在~/.bashrc 中

- HISTSIZ: 控制当前会话存储在内存中的命令数量

- HISTFILESIZE ： 控制历史文件中保存的命令数量

##  一般使用
```Bash
history  # 查看历史命令 

!1       # 执行编号为1 的命令
!!       # 重复上一条命令
```
## 开启history命令搜索功能

```ad-info
title: 注意
当你在`Terminal`中执行`[CTRL+R]` ，输入关键字，就会匹配到最新执行过的包含关键字的命令,点击回车可执行。
```

### 示例截图
![](../images/Pasted%20image%2020240703205538.png)


# Man手册
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

## 使用说明
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

## 运用示例

man手册查看openssl passwd的使用方式

```Bash
man -k "passwd"
man lssl "passwd"
openssl passwd -1 asd # openssl 生成密钥，并自动加盐
#vim 替换 /etc/passwd/中的密码，
```

# 搜索与查找
## which 
`which`命令的作用是在`$PATH`环境变量中搜索指定名称的文件。此变量中定义了一个目录列表，当发出指令时，linux 会在列表中搜索文件，当匹配到目标时，会显示完整路径。

```Bash
which sbd
```

```ad-info 
title: 注意
  可以通过`echo $PATH` 查看当前系统环境变量包含路径
```

## locate 
- `locate` 是一个比较好用的搜索命令，它通过`locate.db` 一个内置的数据库来定位文件，而不是从磁盘查找。因此查找文件比较快捷。
- 可以通过`updatedb`命令升级`locate.db`

**示例：**

```Bash
sudo updatedb
locate  history
```

##  find

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

# 路径管理
## pwd
 `pwd` 命令用来查看用户当前所在路径：

```Bash
pwd
```

## cd
`cd`  命令用于跳转路径，具体使用方式如下：

```Bash
cd  <dir>  # 跳转到目标目录
cd  ~      # 跳转到当前用户目录
cd  -      # 跳转到刚才的目录
```


##  ls
- `ls`  用于查看目录内容，用法如下：
```Bash
ls -l   # 列出文件属性
ls -a   # 列出隐藏文件
```

## mkdir 
`mkdir` 命令用来创建目录，具体使用如下：

- 新建目录

```Bash
mkdir newdir # 创建目录
mkdir "newdir one"  # 创建名称中包含空格的目录
mkdir "dir1" "dir2" # 同时创建两个目录
mkdir -p test/{recon,exploit,report}  # 创建一个目录及多个子目录
```

## rmdir
`rmdir`命令用于删除空目录：

```Bash
rmdir newdir 
```

## file
`file` 命令用于查看文件类型，使用方法如下：

```Bash
file  /etc/passwd
```


# 文本操作 

```Bash
cat  file  # 查看文件

cat -n file |more # 以more 的方式显示查看结果，-n 显示行号

more file

head -n 3 file.txt  # 显示文最件前三行

tail -n 3 file.txt # 显示文件最后三行

wc -m file.txt  # 统计文本字符数
```

- 创建空文件

```Bash
touch newfile
```


## 管道和重定向符
- 利用管道和重定向，可以实现几乎无限的功能
### 重定向符
```ad-info
title: 重定向符与标准输入输出

标准输入输出 
- STDIN（0） ：标准输入
- STDOUT（1）：标准输出
- STDERR（2）：标准错误输出

重定向
- `>` : 输入数据流，将旧的替换    
- `>>`: 输入数据流，在后面增加
```
### 使用实例： 
```Bash
echo hello >file.txt
echo "world" >> fiel.txt
wc -m < file.txt
ls -lah notexist.txt 2 >errors.

find /-type f -perm -u=s -ls 2>/dev/null  #将标准错误丢入/dev/null
```

###  管道符
- **管道符的作用：** 对  前面命令的结果  执行后面的命令。

#### 使用实例
```Bash
ls -l | wc -l      # wc 统计字符数（-c），单词数（w）与行数 （-l）

cat /etc/passwd |sort  # 对/etc/passwd 内容排序

ls -la /usr/bin grep zip # 抓取 /usr/bin 下 包含zip 的文件

cat /etc/passwd |cut -d ":" -f 1  # 查看/etc/passwd，中以 ":"为分隔符的第一列
```

## 搜索文本

```ad-info
title: 注意
快速搜索、修改文本内容需要掌握正则表达式：
- [http://www.regular-expressions.info/](hhttp://www.regular-expressions.info)
- [http://www.rexegg.com](http://www.rexegg.com)

```

### grep
- `grep` 可以在文本文件中搜索字符串，并打印包含关键字的行;
- 更可以与 `‘|’`配合使用，实现或的查询 (注意单引号中不要有空格)： grep 'str1|str2' fiel

````ad-info
title: 参数

用法：grep [选项]... 模式 [文件]...

```
-v 排除指定内容
-o 只显示抓取到的字符，而不是显示一行（每匹配到一个，另起一行打印）
-A 显示匹配字符行和上一行
-B 显示匹配字符行和下一行
-C 显示匹配字符行和上下行（相当于-A 加 -B）
-E 与管道符配合，对文件内容模糊查询与egrep相同 grep 'str1 * str2' file (* 占位一个字符)
-r 递归查询，查询目录中的所有文件
-R 同样是递归查询，但是可以行进一步glob匹配查询
-c 只显示匹配到字符的行数
-i 不区分大小写
-l "str"<文件名(多个)> 找到包含字符串的文件
-L "str"<文件名(多个)> 找到不包含字符串的文件
-e 可以连续指定多个参数 grep -e 'h' -e 'k' hello2    
```
````

#### 使用实例
```shell
grep 'str' file 
cat file | grep 'str' 
grep -ri Passwd       # 对当前目录中所有文件进行递归搜索，并忽略大小写字母的区分
```

### sed 
 `sed` 是强大的流编辑器，可以对一组文件或其他命令输出执行流编辑操作;

- 批量替换文件内容
```shell
echo "I need to try hard" | sed 's/hard/harder/'  # 只对打印结果替换

sed -i 's/hard/harder/g' file.txt  # 替换文件中的字符串
```

### cut & awk 
- `cut`  从一行中提取一段文本并将其输出到标准输出

```shell
cat /etc/passwd |cut -d ":" -f 1  
```

- `awk` 通常用于数据提取、生成报告，支持正则表达式
 
```shell
echo "hello::there::friend" | awk -F "::" '{print $1, $3
who | awk '{pront $1"\t"$2}'
who | awk '{pront $1"\n"$2}'
```

```ad-info
title: 注意
`cut -d` 的分界符必须是单个字符！ 
`awk -F` 的分界符可以是字符串！
```

### sort
sort的功能是排序
- sort 默认按第一个字符正序
- sort -u 去重
- sort -run 按数值从大到小排序
```shell
cat access_log.txt | cut -d " " -f 1 |sort | uniq -c | sort -run
```
###  uniq
使用 uniq 进行统计
uniq -c 按出现次数进行数值统计

## 文件内容比较
### comm
```shell
comm  <file1>   <file2> 
```

- 三列
   - 第一列： 只在第一个文件里有
   - 第二列：只在第二个文件里有
   - 第三列：两个文件中相同的内容
```shell
comm -12 <file1> <file2>  # 只显示相同的
comm -3  <file1>  <file3> # 只显示不同
```
### diff
```shell
diff -c  <file1> <fiel2> # 两部分显示
diff -u  <file1>  <file2>  # 一起显示
```
### vimdiff
略
### meld 图形化文件目录对比工具
略

## 进程管理

## 文件下载



## 其他常用命令

# 管理系统服务
Kali LInux 安装有多种服务，但默认都没有启动：`ssh`、`http`、`Mysql` ...
## 启动服务
```shell
sudo systemctl start ssh
sudo systemctl start apache2
```

## 验证服务已启动
```shell
sudo ss -antlp | grep sshd
```

## 设置ssh服务自启动
```shell
sudo systemctl enable ssh
ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" leamer@192.168.1.1
```

## 查看系统中的可用服务

```shell
systemctl list-unit-files
```

# 软件包管理 
kali系统（kali 基于debain）通过`apt包管理器`  对软件包（`*.deb`）进行管理器。
## 缓存软件仓库目录
```shell
sudo apt update
```
## 更新软件包
```shell
sudo apt upgrade  # 全部更新
sudo apt upgrade <package> # 更新单个软件包
```

## 通过关键字搜索软件包
```shell
apt-cache search <string>
apt search <string>
```
## 显示软件包详细信息

```shell
apt show  <package>
```

## 在线安装软件包
```shell
sudo apt install <package>
```


## 安装离线包
```shell
sudo dpkg -i <packagename.deb>  # 不安装依赖
sudo apt install </path/packagename.deb>  # 同时安装依赖
```

## 彻底删除软件包（包括配置文件）
```shell
sudo apt remove --purge <package>
```


# Kali 使用小技巧
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


![](../images/Pasted%20image%2020240703192817.png)

### 常用工具目录

- `/usr/share/`  目录下有常用字典、webshell、扫描脚本等：
     - seclists、webshell、worldlists、windows-resources、exploitdb、...
     - winpeas、mimikatz、powersploit、webshells

### 定义命令别名
一般会将常用的**长**命令定义成一个简短命令如：
- `web`  :  `alias web="python -m http.server 80"`
