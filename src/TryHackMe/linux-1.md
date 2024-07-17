---
title: linux基础-1
icon: file
order: 3
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
# 简介

````ad-info
title: 简介
Linux是一个基于unix的命令行操作系统。有多种基于Linux的操作系统。最早是1991年发布

![](../images/Pasted%20image%2020240711211332.png)

````


````ad-important
title:重要目录
```markdown
`/etc`  : 配置文件（etcetera缩写）

`/var`  : （var是变量数据的缩写）存服务或应用程序经常访问或写入的数据，如数据库、日志文件等。
`/root`：超级用户的主目录

`/temp`：这是在Linux安装中找到的唯一根目录。/tmp是“临时“的缩写，它是volatile目录，用于存储只需要访问一次或两次的数据。与计算机上的内存类似，一旦计算机重新启动，此文件夹中的内容将被清除。

在渗透测试中对我们有用的是，默认情况下，任何用户都可以写入此文件夹。这意味着一旦我们访问了一台机器，它就可以作为存储枚举脚本等东西的好地方。

```
````


````ad-info
title: 最简单的命令

```bash
echo TryHackMe   # 终端窗口打印提供的任何文本
whoami           # 查看当前登陆用户的用户名
```
````
# Man 手册
- 大部分linux 命令行程序内置man手册，为用户提供命令查询帮助。
- Man手册包含命令概要、用途和描述，队员的选项、参数或开关。
- 手册内容包含以下几个部分（Section），编号如下：

````ad-info
title: section 

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

````

````ad-info
title: 使用说明
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
````

````ad-info
title: 运用示例
- **man手册查看openssl passwd的使用方式**

```Bash
man -k "passwd"
man lssl "passwd"
openssl passwd -1 asd # openssl 生成密钥，并自动加盐
#vim 替换 /etc/passwd/中的密码，
```
- **使用man 手册查询scp 命令复制整个目录的参数**
```shell
man scp |grep 'entire'
```

![](../images/Pasted%20image%2020240711022658.png)



````

# 基础命令


````ad-info
title: 与文件夹交互

```bash
ls -R  # 列出子目录
pwd  # 查看当前路径
cat <file> # 查看文件内容 
```
````

````ad-info
title: shell 操作符
```bash
&   # 后台运行命令
&&  # 执行连续的命令，只有前一个命令执行成功，才执行后一个命令
>   # 输出重定向，替换
>>  # 输出重定向，追加
```
```` 


````ad-important
title:文本交互
```bash
touch <filename>      # 创建文件
file <filename>       # 查看文件类型
mv  <file1> <file2>   # 移动文件，-R 对目录进行移动
cp  <file1> <file2>   # 拷贝
```
````


````ad-important
title:su

`su -l <username>` 命令可以在切换用户后直接跳转到他的家目录


```bash
su -l user2
```
````


## fdisk
````ad-info
title:fdisk
- **fdisk 分区命令列出当前分区**

```bash
fdisk -l
```
![](../images/Pasted%20image%2020240711023239.png)
````

## Netcat 

利用nc启动监听，并启用本地端口12345

- `nc -l -p 12345`

```bash
man nc | grep port
man nc | grep listen
```

![](../images/Pasted%20image%2020240711024350.png)

# 搜索
## 文件搜索

### which 
`which`命令的作用是在`$PATH`环境变量中搜索指定名称的文件。此变量中定义了一个目录列表，当发出指令时，linux 会在列表中搜索文件，当匹配到目标时，会显示完整路径。

```Bash
which sbd
```

### locate 
- `locate` 是一个比较好用的搜索命令，它通过`locate.db` 一个内置的数据库来定位文件，而不是从磁盘查找。因此查找文件比较快捷。
- 可以通过`updatedb`命令升级`locate.db`

**示例：**

```Bash
sudo updatedb
locate  history
```

### find

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

## 文本搜索

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


## 环境变量搜索
```ad-info 
title: 注意
  可以通过`echo $PATH` 查看当前系统环境变量包含路径
```



# 文件编辑与下载

````ad-info
title: nano
`nano` 是一个文本编辑器
```bash
nano myfile
```
- **nano 打开文件时用`-B` 参数备份**
```bash
man nano |grep backup
```

![](../images/Pasted%20image%2020240711023621.png)

````

````ad-info
title:vim
`vim` 是强大的文本编辑器
```bash
vim  myfile
```
````


````ad-info
title: Downloads

- 通过python 临时发布url，提供可下载的文件路径

```bash
python3 -m http.server 8000
```
- 下载文件

```bash
wget <url>
curl -O <url>

```
````



# 进程管理

## 进程查看

````ad-info
title: ps
- `ps` 命令查看正当前会话下在运行的进程列表（当前会话：当前正在使用的terminal） 
```bash
ps
```
-  要查看其他用户运行的程序和系统进程，需要添加`aux` ：
```bash
ps aux
```
````

````ad-info
title:top
`top` 命令查看后台进程动态统计信息，每10秒刷新一次

```bash
top
```
````

## 进程管理

````ad-info
title: kill
`kill` 用来终止进程，并在终止的过程中，向进程发送信号

- SIGTERM -终止进程，但允许它事先执行一些清理任务
- SIGKILL -终止进程-不做任何事后清理
- SIGSTOP  停止/挂起进程 

````

##  命名空间

操作系统（OS）使用命名空间来最终将计算机上可用的资源划分给（例如CPU、RAM和优先级）进程。
命名空间能够实现进程间的隔离：只有同一命名空间的进行才能互相访问。

PID为 0 , 的进程是在系统引导时启动的进程，例如：systemd,它提供一种在系统和用户之间管理进程的方法。

````ad-info
title:启动服务

```bash
systemctl [option] [server]
```
- 在启动引导程序时启动服务 : `enable`
- 启动服务`start`
- 停止服务`stop`
- 禁用服务`disable`
- 重新启动服务： `restart`
````

##  进程前后台

````ad-info
title:前台
一般运行程序，默认是在前台运行，运行后，当前terminal 会被占用，无法进行其他操作
```bash
echo "Hello world!"
```
````


````ad-info
title:后台
- 想要在运行后进程，需要在运行的命令后面加 `&`
```bash
echo "Hello world!"  &
```
- 也可以通过 `Ctrl + z` 暂停进程
- `fg`： 当在当前terminal 暂停了一个进程时，可以用`fg`重新回到进程运行状态，只能回到最近暂停的一个。
````

## 定时任务

````ad-info 
title:cron
`Crontabs` 是一个在`boot`启动时启动的进程，负责管理`cron`作业
- `crontabs` 文件保存在 `/var/spool/cron/crontabs`文件下
- 也可以以命令行的形式，管理`cron`
```bash
crontab -l  # 查看当前用户的定时任务
crontab -e  # 创建定时任务（默认用nano编辑文本）
```

- **cron** 表达式是一个字符串，该字符串由 `6` 个空格分为 `7` 个域，每一个域代表一个时间单位。格式如下：
```javascript
[秒] [分] [时] [日] [月] [周] [年] [命令]   
```

- **通常定义 “年” 的部分可以省略，实际常用的由 前六部分组成**

```bash
0 */12 * * *  cp -R /home/cmnatic/Documents /var/backups/
```
- 设置每次重启都会执行的任务会用到：`@reboot`
```bash
@reboot /var/opt/processes.sh
```
````

|域|是否必填|值以及范围|通配符|
|---|---|---|---|
|秒|是|0-59|, - * /|
|分|是|0-59|, - * /|
|时|是|0-23|, - * /|
|日|是|1-31|, - * ? / L W|
|月|是|1-12 或 JAN-DEC|, - * /|
|周|是|1-7 或 SUN-SAT|, - * ? / L #|
|年|否|1970-2099|, - * /|
### cron 中的通配符

- `,` 这里指的是在两个以上的时间点中都执行，如果我们在 “分” 这个域中定义为 `8,12,35` ，则表示分别在第 8 分，第 12 分 第 35 分执行该定时任务。

- `-` 这个比较好理解就是指定在某个域的连续范围，如果我们在 “时” 这个域中定义 `1-6`，则表示在 1 到 6 点之间每小时都触发一次，用 `,` 表示 `1,2,3,4,5,6`。

- `*` 表示所有值，可解读为 “每”。如果在“日”这个域中设置 `*`,表示每一天都会触发。

- `?` 表示不指定值。使用的场景为不需要关心当前设置这个字段的值。例如:要在每月的 8 号触发一个操作，但不关心是周几，我们可以这么设置 `0 0 0 8 * ?`

- `/` 在某个域上周期性触发，该符号将其所在域中的表达式分为两个部分，其中第一部分是起始值，除了秒以外都会降低一个单位，比如 在 “秒” 上定义 `5/10` 表示从 第 5 秒开始 每 10 秒执行一次，而在 “分” 上则表示从 第 5 秒开始 每 10 分钟执行一次。

- `L` 表示英文中的**LAST** 的意思，只能在 “日”和“周”中使用。在“日”中设置，表示当月的最后一天(依据当前月份，如果是二月还会依据是否是润年), 在“周”上表示周六，相当于”7”或”SAT”。如果在”L”前加上数字，则表示该数据的最后一个。例如在“周”中设置”7L”这样的格式,则表示“本月最后一个周六”。

- `W` 表示离指定日期的最近那个工作日(周一至周五)触发，只能在 “日” 中使用且只能用在具体的数字之后。若在“日”上设置”15W”，表示离每月 15 号最近的那个工作日触发。假如 15 号正好是周六，则找最近的周五(14 号)触发, 如果 15 号是周未，则找最近的下周一(16 号)触发.如果 15 号正好在工作日(周一至周五)，则就在该天触发。如果是 “1W” 就只能往本月的下一个最近的工作日推不能跨月往上一个月推。

- `#` 表示每月的第几个周几，只能作用于 “周” 。例如 ”2#3” 表示在每月的第三个周二。

# 通过日志维护系统 
- fail2ban： 一个防火墙，可以用于监视和阻止暴力破解
- ufw：ubuntu系统的防火墙，基于iptables的简化工具防
- access.log ：web服务器的访问日志
- error.log ：web服务器的错误日志
