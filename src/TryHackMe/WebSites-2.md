---
title: burpsuite
cover: 
icon: file
order: 2
author: Miktu
date: 2024-07-27
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
# 介绍
本质上，Burp Suite是一个基于Java的框架，旨在作为进行Web应用程序渗透测试的综合解决方案。它已成为对Web和移动应用程序（包括那些依赖应用程序编程接口（API）的应用程序）进行动手安全评估的行业标准工具。

简而言之，Burp Suite捕获并允许操纵浏览器和Web服务器之间的所有HTTP/HTTPS流量。这种基本功能构成了框架的支柱。通过拦截请求，用户可以灵活地将它们路由到Burp Suite框架内的各种组件，我们将在接下来的部分中对此进行探讨。在Web请求到达目标服务器之前拦截、查看和修改它们，甚至在浏览器接收到响应之前操纵它们的能力使Burp Suite成为手动Web应用程序测试的宝贵工具。

![](../images/Pasted%20image%2020240727211100.png)


Burp Suite有不同的版本。出于我们的目的，我们将重点关注Burp Suite社区版，它可在合法范围内免费用于非商业用途。然而，值得注意的是，Burp Suite还提供专业版和企业版，它们具有高级功能并需要许可：

 1. Burp Suite Professional（专业版）是Burp Suite社区的无限制版本。它具有以下功能：
    
    - 自动漏洞扫描程序。
    - 不受速率限制的模糊/暴力强制器。
    - 保存项目以供将来使用和生成报告。
    - 允许与其他工具集成的内置API。
    - 无限制访问以添加新扩展以获得更大的功能。
    - 访问Burp Suite协作器（有效地提供自托管或在Portswgger拥有的服务器上运行的唯一请求捕获器）。

2. 与社区版和专业版相比，Burp Suite Enterprise(企业版)主要用于持续扫描。它具有自动扫描仪，可以定期扫描Web应用程序的漏洞，类似于Nessus等工具执行自动基础设施扫描的方式。与允许从本地机器进行手动攻击的其他版本不同，Burp Suite Enterprise驻留在服务器上，并不断扫描目标Web应用程序的潜在漏洞。 ![](../images/Pasted%20image%2020240727211356.png)
由于专业版和企业版需要许可证，我们将专注于Burp Suite社区版提供的核心功能集。

## 问题
![](../images/Pasted%20image%2020240727211631.png)

# Burp 社区版特点

尽管与专业版相比，Burp Suite Community提供的功能集更有限，但它仍然提供了一系列令人印象深刻的工具，这些工具对于Web应用程序测试非常有价值。让我们探索一些关键功能：

- **Proxy**(代理): Burp代理是Burp Suite最著名的方面。它可以在与Web应用程序交互时拦截和修改请求和响应。
- **Repeater**(中继器)：另一个众所周知的功能。[中继器](https://tryhackme.com/room/burpsuiterepeater)允许 用于多次捕获、修改和重新发送相同的请求。 此功能在制作有效载荷时特别有用 反复试验（例如，在SQLi-结构化查询语言注入中）或 测试端点的功能是否存在漏洞。
- **Intruder**(入侵者)：尽管burp suite 有费率限制，[入侵者](https://tryhackme.com/room/burpsuiteintruder)允许用于向端点发出请求。它通常用于 爆破攻击或模糊端点。
- **Decoder**(解码器)：[解码器](https://tryhackme.com/room/burpsuiteom)提供了一个 数据转换的宝贵服务。它可以解码捕获的 在将有效载荷发送到目标之前对其进行信息或编码。而 为此目的存在替代服务，利用内部的解码器 Burpsuite 可以非常高效。
- **Comparer**(比较器)：顾名思义，[比较器](https://tryhackme.com/room/burpsuiteom)允许在字或字节级别比较两条数据。而 不仅限于Burp Suite，能够发送潜在的大数据使用单个键盘快捷键直接分段到比较工具显着加速了这一过程。
- **Sequencer**：[音序器](https://tryhackme.com/room/burpsuiteom)通常是 在评估令牌的随机性时使用，例如会话cookie 值或其他假定随机生成的数据。如果算法 用于生成这些值缺乏安全随机性，它可以暴露 毁灭性攻击的途径。


除了内置功能之外，Burp Suite的Java代码库还促进了扩展的开发，以增强框架的功能。这些扩展可以用Java、Python（使用JavaJython解释器）或Ruby（使用JavaJRuby解释器）编写。Burp套件扩展器模块允许快速轻松地将扩展加载到框架中，而市场，称为BApp Store，可以下载第三方模块。虽然某些扩展可能需要专业许可才能集成，但仍然有相当数量的扩展可用于Burp社区。例如，Logger++模块可以扩展Burp Suite的内置日志记录功能。

## 问题
![](../images/Pasted%20image%2020240727212526.png)

# 安装

要为其他系统下载最新版本的Burp Suite，您 可以点击这个[按钮](https://portswigger.net/burp/releases/)去他们的 下载页面。
KaliLinux：`KaliLinux`预装了`Burp Suite`。如果您的Kali安装中缺少它，您可以从Kali apt存储库轻松安装它。
Linux、macOS和Windows：对于其他操作系统，PortSwigger在Burp Suite下载页面上提供了Burp Suite Community和Burp Suite Professional的专用安装程序。从下拉框中选择您的操作系统，然后选择Burp Suite Community Edition。然后，单击下载按钮启动下载。
![](../images/Pasted%20image%2020240727212720.png)

请使用适合您操作的适当方法安装Burp Suite 系统。在Windows上，运行可执行文件，而在Linux上，执行 来自终端的脚本（有或没有sudo）。如果您选择不这样做 使用`sudo`安装在Linux，Burp Suite将 安装在您的主目录中 `~/BurpSuiteCommunity/BurpSuiteCommunity`并且不会 添加到您的`PATH`。

# 仪表盘

启动Burp Suite并接受条款和条件后，系统将提示您选择项目类型。在Burp Suite社区中，选项有限，您只需单击下一步即可继续。
下一个窗口允许您选择Burp Suite的配置。一般建议保留默认设置，适用于大多数情况。单击开始Burp打开Burp Suite主界面。
第一次打开Burp Suite时，您可能会遇到一个带有训练选项的屏幕。强烈建议您在有时间的时候浏览这些培训材料。
如果您没有看到训练屏幕（或在后续课程中），您将看到Burp仪表板，起初可能看起来比较陌生难懂。然而，你很快就会熟悉它。
![](../images/Pasted%20image%2020240727212952.png)

1. **Tasks**:任务菜单允许您定义Burp Suite在使用应用程序时将执行的后台任务。在Burp Suite社区中，默认的“实时被动抓取”任务（自动记录访问的页面）足以满足我们在本模块中的目的。Burp Suite Professional提供按需扫描等附加功能。
2. **Event log**:事件日志提供有关Burp Suite执行的操作的信息，例如启动代理，以及有关通过Burp建立的连接的详细信息。
3. **Issue Activity**：此部分特定于Burp Suite Professional。它显示由自动扫描仪识别的漏洞，按严重程度排序，并可根据漏洞的确定性进行过滤。
4. **Advisory**: 建议部分提供有关已识别漏洞的更详细信息，包括参考和建议的补救措施。此信息可以导出到报告中。在Burp Suite社区中，此部分可能不会显示任何漏洞。

在Burp Suite的各个选项卡和窗口中，您将 注意问号图标（![](../images/Pasted%20image%2020240727213558.png)）
单击这些图标会打开一个新窗口，其中包含特定于该部分的有用信息。当您需要有关特定功能的帮助或澄清时，这些帮助图标非常宝贵，因此请确保有效利用它们。

# 导航（Navigation）

在Burp Suite中，默认导航主要通过顶部菜单栏完成，这允许您在模块之间切换并访问每个模块中的各种子选项卡。子选项卡出现在主菜单栏正下方的第二个菜单栏中。

以下是导航的工作原理：

1. 模块选择：菜单栏的最上面一行显示了Burp Suite中可用的模块。您可以单击每个模块在它们之间切换。例如，下图中选择了Burp Proxy模块。
    
    ![](../images/Pasted%20image%2020240727213846.png)
    
2. 子选项卡：如果选定的模块有多个子选项卡，则可以通过出现在主菜单栏正下方的第二个菜单栏访问它们。这些子选项卡通常包含特定于模块的设置和选项。例如，在上图中，代理拦截子选项卡是在Burp代理模块中选择的。
    
3. 分离选项卡：如果您想单独查看多个选项卡，可以将它们分离到单独的窗口中。为此，请转到模块选择栏上方应用程序菜单中的窗口选项。从那里，选择“分离”选项，所选选项卡将在单独的窗口中打开。可以使用相同的方法重新连接分离的选项卡。
    
    ![](../images/Pasted%20image%2020240727213851.png)
    

Burp Suite还提供键盘快捷键，用于快速导航到键选项卡。默认情况下，以下快捷键可用：

| 快捷方式               | 选项卡    |
| ------------------ | ------ |
| `Ctrl + Shift + D` | 仪表板    |
| `Ctrl + Shift + T` | 目标选项卡  |
| `Ctrl + Shift + P` | 代理选项卡  |
| `Ctrl + Shift + I` | 入侵者选项卡 |
| `Ctrl + Shift + R` | 中继器选项卡 |

#  选项（Options）
在深入研究Burp代理之前，让我们探索配置Burp Suite的可用选项。有两种类型的设置：全局设置（也称为用户设置）和项目设置。

**Global Settings**(全局设置)：这些设置会影响整个Burp Suite安装，并在您每次启动应用程序时应用。它们为您的Burp Suite环境提供基线配置。
**Project Settings**(项目设置)：这些设置特定于当前项目，仅在会话期间适用。但是，请注意，Burp Suite社区版不支持保存项目，因此当您关闭Burp时，任何特定于项目的选项都将丢失。

要访问设置，请单击顶部导航栏中的设置按钮。这将打开一个单独的设置窗口。

![](../images/Pasted%20image%2020240727214516.png)

下面是显示单独设置窗口的图像。

![](../images/Pasted%20image%2020240727214455.png)

在设置窗口中，您将在左侧找到一个菜单。此菜单允许您在不同类型的设置之间切换，包括：
1. **Search**(搜索)：启用使用关键字搜索特定设置。
2. **Type filter**(类型过滤器): 过滤设置**User** (用户)和**Project**(项目)选项。
    - **User settings**(用户设置)：显示影响整个Burp Suite安装的设置。
    - **Project settings**(项目设置)：显示特定于当前项目的设置。
3. **Categories**(类别)：允许按类别选择设置。

##  设置搜索
新版本的才可以通过点击`settings`进入设置，旧版本无此功能。
![](../images/Pasted%20image%2020240728124439.png)

# 代理（Proxy） 
Burp代理是Burp Suite中的一个基本且关键的工具。它能够捕获用户和目标Web服务器之间的请求和响应。可以操纵这些截获的流量，将其发送到其他工具进行进一步处理，或者明确允许继续到其目的地。

## proxy 基本用法

- **Intercepting Requests（拦截请求）:** 当通过 `Burp Proxy`发出请求时，它们会被拦截并阻止到达目标服务器。请求出现在“Proxy”选项卡中，允许执行进一步的操作，例如转发（`Forwarding`）、删除（`Dropping`）、编辑（`editing`）或将它们发送（`sending`）到其他 Burp 模块。要禁用拦截并允许请求不间断地通过代理，请单击“拦截已打开（`intercept is on`）”按钮。

- **Taking Control（控制）：** 拦截请求的能力使测试人员能够完全控制Web流量，使其对于测试Web应用程序非常宝贵。

- **Capture and Logging（捕获和记录）:** Burp Suite还捕获和记录WebSocket通信，在分析Web应用程序时提供额外的帮助。
- **Logs and History（日志和历史记录）:** 可以在`HTTP history`和`WebSockets history`子选项卡中查看捕获的请求，从而允许进行回顾性分析并根据需要将请求发送到其他Burp模块。
    ![](../images/Pasted%20image%2020240728125454.png)
可以通过单击代理设置按钮访问特定于代理的选项。这些选项提供了对代理行为和功能的广泛控制。熟悉这些选项以优化Burp代理的使用。

## 代理设置中的一些显着功能

- **Response Interception（响应拦截）:** 默认情况下，除非基于每个请求明确请求，否则代理不会拦截服务器响应。“`Intercept responses based on the following rules`（基于以下规则拦截响应）”复选框以及定义的规则允许更灵活的响应拦截。
![](../images/Pasted%20image%2020240728130611.png)

- **Match and Replace（匹配和替换）:** 代理设置中的“`Match and Replace`（匹配和替换）”部分允许使用正则表达式来修改传入和传出请求。此功能允许动态更改，例如修改用户代理或操作cookie。
![](../images/Pasted%20image%2020240728130745.png)


## Foxproxy
以下是使用FoxProxy配置Burp Suite代理的步骤：

1. **安装FoxProxy：** 下载并安装[FoxProxy Basic扩展](https://addons.mozilla.org/en-US/firefox/addon/foxyproxy-basic/)。

2. **访问FoxProxy选项：** 安装后，Firefox浏览器的右上角会出现一个按钮。单击FoxProxy按钮以访问FoxProxy选项弹出窗口。
![](../images/Pasted%20image%2020240728141105.png)
3. **创建Burp代理配置：** 在FoxProxy选项弹出窗口中，单击选项按钮。这将打开一个包含FoxProxy配置的新浏览器选项卡。单击添加按钮以创建新的代理配置。
![](../images/Pasted%20image%2020240728140806.png)

4. **添加代理信息:** 在"Add Proxy" 界面，填写以下值：
    - `Title: `Burp` (or any preferred name)
    - Proxy IP: `127.0.0.1`
    - Port: `8080`
    ![](../images/Pasted%20image%2020240728141408.png)
5. 保存配置：保存代理
6. **激活代理配置：** 单击 Firefox 浏览器右上角的 FoxyProxy 图标，然后选择 `Burp` 配置。这会将您的浏览器流量重定向到 `127.0.0.1:8080`。请注意，激活此配置时，Burp Suite 必须正在运行，您的浏览器才能发出请求。
    ![](../images/Pasted%20image%2020240728141517.png)
7. **在 Burp Suite 中启用代理拦截：** 切换到 Burp Suite 并确保在“代理”选项卡中打开“拦截”。
    ![](../images/Pasted%20image%2020240728141732.png)
8. **测试代理：**打开Firefox并尝试访问 网站，例如`http://10.10.73.115/`的主页。您的 浏览器将挂起，代理将填充HTTP请求。 恭喜，你成功拦截了你的第一个 请求！
    ![](../images/Pasted%20image%2020240728142012.png)

# Burpsuite 浏览器

除了修改我们的常规网络浏览器以使用代理之外，Burp Suite还包括一个内置的Chromium浏览器，该浏览器预先配置为使用代理，而无需我们刚刚进行的任何修改。
要启动Burp浏览器，请单击`Open Browser`按钮 在代理选项卡中。将弹出一个Chromium窗口，所有请求 在这个浏览器中会通过代理。

````ad-tip
title: 注意
项目选项和用户选项设置中有许多与Burp浏览器相关的设置。确保根据需要探索和自定义它们。
- 如果您以root用户身份在Linux上运行Burp Suite（就像attackBox的情况一样），您可能会遇到由于无法创建沙盒环境而阻止Burp浏览器启动的错误。有两个简单的解决方案：

> **Smart option(智能选项)**：创建一个新用户并在低权限帐户下运行Burp Suite，以允许Burp浏览器正常运行。

> **Easy option(简单选项)**：转到 `Settings -> Tools -> Burp's browser`并检查 允许`Allow Burp's browser to run without a sandbox` 选项。启用此选项将允许浏览器在没有 沙盒。但是，请注意，此选项已被禁用 出于安全原因的默认值。如果您选择启用它，请锻炼 注意，因为破坏浏览器可能会授予攻击者访问 你的整个机器。在攻击盒的训练环境中，这个 不太可能是一个重大问题，但要负责任地使用它。
> ![](../images/Pasted%20image%2020240728133613.png)
````



### 启动
![](../images/Pasted%20image%2020240728133754.png)

## 浏览器
![](../images/Pasted%20image%2020240728133906.png)

# 范围和目标（Scoping and Targeting）


`Scoping`：

捕获和记录所有流量很快就会变得难以承受且不方便，特别是当我们只想关注特定的 Web 应用程序时。这就是范围界定的用武之地。

- 可以限制 Burp Suite 仅针对我们想要测试的特定 Web 应用程序进行流量捕获。

方法：
- 切换到“`Target`（目标）”选项卡，
- 右键单击左侧列表中的目标，然后选择“`add to scope`（添加到范围）”。
- 然后 Burp 会提示我们选择是否要停止记录不在范围内的任何内容，在大多数情况下，我们要选择“是”。
![](../images/Pasted%20image%2020240728144308.png)

![](../images/Pasted%20image%2020240728144341.png)

# CA证书
在拦截HTTP流量时，我们可能会遇到问题 导航到启用了TLS的站点。例如，在访问站点时 像`https://google.com/`，我们可能会收到一个错误 指示PortSwigger证书授权中心（CA）不是 授权保护连接。发生这种情况是因为浏览器 不信任Burp Suite提供的证书。
![](../images/Pasted%20image%2020240728182602.png)

为了解决这个问题，我们可以手动将PortSwigger CA证书添加到浏览器的受信任证书颁发机构列表中。这是如何做到的：

1. **下载CA证书：**使用Burp的代理 激活，导航到http：//burp/cert。这将下载一个文件 名为`cacert.der`。将此文件保存在您的 机器。
    
2. **访问Firefox证书设置：**类型 `about:preferences`进入您的Firefox URL栏并按 **输入**。这将带您进入Firefox设置页面。搜索页面 对于“证书”，请单击**查看证书**按钮。![](../images/Pasted%20image%2020240728182632.png)
3. **导入CA证书：**在证书中 在管理器窗口中，单击**导入**按钮。选择 `cacert.der`文件，您在之前下载 一步。
    
4. 为CA证书设置信任：在随后出现的窗口中，选中“信任此CA以识别网站”的框，然后单击确定。![](../images/Pasted%20image%2020240728182736.png)
通过完成这些步骤，我们已将PortSwigger CA证书添加到受信任的证书颁发机构列表中。现在，我们应该能够访问任何启用TLS的站点而不会遇到证书错误。

您可以观看以下视频以直观演示完整的证书导入过程：

![](https://tryhackme-images.s3.amazonaws.com/user-uploads/5d9e176315f8850e719252ed/room-content/fb2a8717ae887eda024a7791d83cefaf.gif)

