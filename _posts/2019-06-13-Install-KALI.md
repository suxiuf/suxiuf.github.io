---
ayout: post
title: "KLALI-install"
date: 2019-06-13
description: kali 
tag: Security
---


### KALI 介绍


* [官网](https://www.kali.org/) 
* 基于Debain
* kali 原意 ：  
> 湿婆神的老婆，为了打败不死的魔鬼去吸取魔鬼身上的能量,使自己变成魔鬼的样子。  



#### install :    

* 下载[官网](https://www.kali.org/) 

 * 硬盘安装 ：
 刻录USB启动盘，官方推荐工具[UNetbootin](https://unetbootin.github.io/)，安装方式和其他系统一样;

* KALI-Linux 推荐使用root权限，

### 持久加密USB 按装,
 
即将系统安装到USB上，并将硬盘(USB)进行加密

* LUKS  : Linux Unified Key Setup 

  LUKS是磁盘(块)级别的加密 （Windows下磁盘加密：DoxBox）
  Linux 下进行磁盘的LUKS加密：
   * 将iso 文件以块的形式存到USB盘：        
  
  ```shell
   dd   if\= \<\*.iso\>   of\=\< usb \>#usb 的绝对路径
   ```
  
   * 将磁盘加密:
  
     * parted命令将USB分区：
  
    ```shell
     parted    #开始进入分区
     print  devices  #列出当前系统挂载的硬盘
     select /dev/sdb # 选择要分区的盘USB
     print 	#查看当前磁盘空间
     mkpart primary <start>  <end> #start 须为现有存储结束位置 
     quit    #退出
   ```

   * LUKS进行加密
  ```shell
   cryptestup --verbose --verify-passphrase luksFormat <要加密的分区 
   #选择 yes
   #下面开始创建密码
   cryptestup luksOpen <加密后的硬盘> usb #打开加密后的盘并取名
   #输入密码
   ls /dev/mapper/usb      # 查看创建好的加密磁盘
  ```
  
  * 对加密磁盘进行文件系统级的格式化
  ```shell
  mkfs.ext4    /dev/sapper/usb
   ```
 *  设置卷标 (persistence 为官方规定的KALI  卷标，也可以自己取)
  
  	```shell
  	e2lable /dev/mapper/usb  persistence
  	```
  * 挂载 '/dev/mapper/usb'  到/mnt/usb下进行存入字符，以在“持久加密USB ”启动时确认该盘

  	```shell
	mount /dev/mapper/usb  /mnt/usb
	echo "/  union" > /mnt/usb
 	```
 
 * 卸载并关闭
 
  	```shell
	uomount   /deb/mapper/usb /mnt/usb
 	cryptsetup luksClose  /dev/apper/usb
	```

docker  安装


###   系统调整优化
* 电源优化：
> 无操作挂起
>开启硬盘省电选项
>开启笔记本模式
* gnome桌面同ubuntu 
* xfce 桌面略，
* meld   :  进行文件差异比较的图形化工具
* ttf-wqy-microhei    ：字体
* kchmviever  ：  chk文件查看器
* mtr   路由追踪工具

* 浏览器插件安装：
  * flashgot、outoproxy、Tamper Data、cookle importer、Cookles Magager、User Agent、Switcher、Hackbar、Live  http header、Firebug、Download、YouTube、Videos as MP4、Flagfox、hashr
  * [XSS  Me  跨站脚本工具](https://addons.mozilla.org/en-US/firefox/addon/xss-me)
  * [sql 注入](https://addons.mozilla.org/en-US/firefox/addon/sql-inject-me/&src=ss)

并发线程限制
* ulimit  限制当前shell下进程的资源使用,
>* 参数：
>-a     *#查看可限制项*
>-s  *#限制堆栈大小*
>-m  *#限制内存大小* 
>-v  *#限制虚拟内存大小*
>-f  *限制#并发文件数*

* 编辑~/.bashrc 文件将限制永久添加，
*  列:
    
	```shell
    vim ~/.bashrc
    #末尾添加：
    ulimit -n 90000
    #然后执行命令：
    source  ~/.bashrc
 	```

### kali-linux TOP 10 工具

* aircrack-ng  :无线攻击渗透
* burpsiate :  web 攻击渗透
* hydra ：密码破解
* john ：密码破解
* maltego：信息收集(通过域名收集信息) 
* metsploit framework :  安全渗透工具框架(每个渗透工作者必须掌握)
* nmap ： 网络发现探测扫描
* owasp-zap : web 攻击渗透，（截断代理，爬网，扫描）
* sqlmap :  sql注入


-------
<br>

转载请注明出处：http://suxiuf.github.io  >> [点击阅读阅读原文](http://suxiuf.github.io)    



