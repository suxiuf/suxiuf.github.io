---
title: Web服务
cover: 
icon: book
order: 4
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

# HTML 
- HTML（超文本标记语言），用于构建网站并定义其结构
- CSS， 通过添加样式选项使其看起来更漂亮
- JavaScript,使用交互性，在页面实现复杂功能
超文本标记语言（超文本标记语言）是网站编写的语言。元素（`Elements`，也称为标签：`tags`）是超文本标记语言页面的构建块，告诉浏览器如何显示内容。下面的代码片段显示了一个简单的超文本标记语言文档，每个网站的结构都是一样的：
```html
<!DOCTYPE html>
<html>
<head>
<title>Page Title</title>
<body>
    <h1>Example Heading<h1>
    <p>Example Heading<p>
</body>
</head>
</html>
```

超文本标记语言结构（如屏幕截图所示）具有以下组件：


- `<!DOCTYPE html>`定义了页面是一个HTML5文档。这有助于不同浏览器之间的标准化，并告诉浏览器使用HTML5来解释页面。

- <`<html>`元素是超文本标记语言页面的根元素-所有其他元素都在这个元素之后。

- `<head>`元素包含关于页面的信息（如页面标题）。

- 元素`<body>`定义了超文本标记语言文档的主体；浏览器中只显示主体内部的内容。

- `<h1>`元素定义了一个大标题。

- `<p>`元素定义了一个段落。

- 还有许多其他元素（标签）用于不同的目的。例如，有按钮（`<button>`）、图像（`<img>`）、列表等的标签。
标签可以包含诸如`class`属性之类的属性，该属性可用于设置元素的样式（例如，使标签具有不同的颜色）`<p class="bold-text">`，或_src_属性，该属性用于在图像上指定图像的位置：`<img src="img/cat.jpg">.`一个元素可以有多个属性，每个属性都有自己独特的用途，例如，`<p attribute1="value e1" attribute2="value e2">`。

元素也可以有一个id属性（`<p id="example">`），这对元素来说是唯一的。与class属性不同，多个元素可以使用同一个类，一个元素必须有不同的id来唯一地标识它们。元素id用于样式设置并通过JavaScript标识它。

## 回答问题
![](../images/Pasted%20image%2020240727150055.png)

```html
<!DOCTYPE html>
<html>
    <head>
        <title>TryHackMe HTML Editor</title>
    </head>
    <body>
        <h1>Cat Website!</h1>
        <p style='color: red'>See images of all my cats!</p>
        <img src='img/cat-1.jpg'>
        <img src='img/cat-2.jpg'>
        <img src='img/dog-1.png'>
    </body>
</html>
```

![](../images/Pasted%20image%2020240727150344.png)


# JavaScrip

`JavaScript`（JS）是世界上最流行的编码语言之一，它允许页面变得具有交互性。`HTML`用于创建网站结构和内容，而`JavaScript`用于控制网页的功能——如果没有`JavaScript`，页面将没有交互性元素，并且将始终是静态的。JS可以实时动态更新页面，提供在页面上发生特定事件时（例如当用户单击按钮时）更改按钮样式或显示移动动画的功能。

JavaScript被添加到页面源代码中，可以加载到`<script>`标签中，也可以远程包含在src属性中：`<script src="/location/of/javascript_file.js"></script>`


以下`JavaScript`代码在页面上找到一个ID为"demo"的`HTML`元素，并将该元素的内容更改为"Hack the Planet"：`document.getElementById("demo").innerHTML = "Hack the Planet";`

```html
<!DOCTYPE html>
<html>
    <head>
        <title>TryHackMe Editor</title>
    </head>
    <body>
        <div id="demo">Hi there!</div>
        <script type="text/javascript">
         document.getElementById("demo").innerHTML = "Hack the Planet";
        </script>
        <button onclick='document.getElementById("demo").innerHTML = "Button Clicked";'>Click Me!</button>
    </body>
</html>
```

![](../images/Pasted%20image%2020240727155259.png)


# 敏感数据泄漏‘

我们现在知道网站是使用许多`HTML`元素（标签：tags）构建的，所有这些我们都可以通过“查看页面源”来查看。
当网站开发人员可能忘记删除测试使用的登录凭据、指向网站本来隐藏不想被用户访问的链接或其他以`HTML`或`JavaScript`显示的敏感数据时，可能会被攻击者利。
![](../images/Pasted%20image%2020240727155758.png)

每当您评估Web应用程序的安全问题时，您应该做的第一件事就是查看页面源代码，看看是否可以找到任何暴露的登录凭据或隐藏链接。

## 问题

在[这个链接](https://static-labs.tryhackme.cloud/sites/howwebsiteswork/html_data_exposure/)上查看网站。源代码中隐藏的密码是什么？

![](../images/Pasted%20image%2020240727160137.png)

![](../images/Pasted%20image%2020240727160111.png)

# HTML注入

- 当`HTML`页面不对用户输入内容进行过滤，会造成注入漏洞
- 对用户输入内容进行限制，对网站的安全非常重要
- 永远不要相信用户输入的内容。

![](../images/Pasted%20image%2020240727160543.png)

上图显示了表单如何向页面输出文本。无论用户在“ `what's your name ?` ”字段中输入什么，都将传递给 `JavaScript` 函数并输出到页面，如果用户在字段中添加自己的超文本标记语言或`JavaScript`，它将在 `sayHi` 函数中使用并添加到页面中——这意味着您可以添加自己的超文本标记语言（如`<h1>tag`），它将把您的输入输出为纯超文本标记语言。


一般规则是永远不要相信用户输入。为了防止恶意输入，网站开发人员应该在 `JavaScript` 功能中使用用户输入的所有内容之前对其进行清理过滤；在这种情况下，开发人员可以删除任何`HTML`标签。
## 问题
![](../images/Pasted%20image%2020240727162849.png)
```html
<a href = "http://hacker.com"></a>
```

![](../images/Pasted%20image%2020240727162824.png)


# HTTP（S）

**HTTP**(`Hyper Text Transfer Protocol`) 超文本传输协议，是您每次查看网站时都会使用的协议，由 Tim Berners-Lee 和他的团队在 1989 年至 1991 年间开发。 HTTP 是一组用于与 Web 服务器通信以传输网页数据（无论是 HTML、图像、视频等）的规则。

**HTTPS?**  (HyperText Transfer Protocol Secure) 安全超文本传输协议， 是 HTTP 的安全版本。HTTPS 数据经过加密，因此它不仅可以阻止人们看到您正在接收和发送的数据，而且还可以确保您正在与正确的 Web 服务器通信，而不是与冒充者对话。

## 请求与响应
当我们需要连接到一个网站（website）时,首先应该告诉浏览器如何访问这些资源（这就是 URL 的作用）。浏览器会向web服务器发送一个请求（requests）以获取`HTML`、`Images`等资源，并下载响应（responses）。

### URL
**URL(Uniform Resourcer Locator)：统一资源定位器**

如果您使用过Internet，那么您以前使用过URL。URL主要是关于如何访问Internet上资源的说明。下图显示了URL及其所有功能的外观（它不会在每个请求中使用所有功能）。
![](../images/Pasted%20image%2020240727195051.png)

**Scheme（方案）：** 这指示使用什么协议来访问资源，如HTTP、HTTPS、FTP（文件传输协议）。  

**User（用户）：** 有些服务需要身份验证才能登录，您可以在网址中输入用户名和密码才能登录。  

**Host（主机）：** 您希望访问的服务器的域名或IP地址。  

**Prot（端口）：** 您要连接的端口，HTTP通常为80，HTTPS为443，但这可以托管在1-65535之间的任何端口上。  

**Path（路径）：** 您尝试访问的资源的文件名或位置。  

**Query String（请求参数：直译为 查询字符串）：** 可以发送到请求路径的额外信息。例如， /blog？id=1将告诉博客路径您希望接收id为1的博客文章。  

**Fragment（片段）**：这是对实际请求页面上位置的引用。这通常用于内容较长的页面，并且可以将页面的某个部分直接链接到它，因此用户一访问页面就可以查看它。

### 发出请求

向web服务器发出请求，只需发送一行"`GET/HTTP/1.1`"
![](../images/Pasted%20image%2020240727195919.png)
但是为了获得更丰富的网络体验，您还需要发送其他数据。这些其他数据在所谓的标头中发送，标头包含额外的信息，可以提供给您正在与之通信的网络服务器，但是我们将在标头任务中对此进行更多讨论。

**Example Request:  **

```http
GET / HTTP/1.1
Host: tryhackme.com
User-Agent: Mozilla/5.0 Firefox/87.0
Referer: https://tryhackme.com/

```

**Line 1:** 此请求正在发送GET方法（在HTTP方法任务中详细介绍），使用/请求主页并告诉Web服务器我们正在使用HTTP协议版本1.1。

**Line 2:** 告诉web服务器我们想要访问的网站域名：`tryhackme.com`  

**Line 3:** 告诉Web服务器我们正在使用`Firefox version 87` 浏览器  

**Line 4:** 告诉Web服务器，将我们引向此页面的网页是[https://tryhackme.com](https://tryhackme.com)

**Line 5:** HTTP请求始终以空行结尾，通知Web服务器请求已完成。

**Example Response:**


```http
HTTP/1.1 200 OK
Server: nginx/1.15.8
Date: Fri, 09 Apr 2021 13:34:03 GMT
Content-Type: text/html
Content-Length: 98

<html>
<head>
    <title>TryHackMe</title>
</head>
<body>
    Welcome To TryHackMe.com
</body>
</html>
```

**Line 1:** HTTP 1.1是服务器正在使用的HTTP协议的版本，然后是HTTP状态代码，在本例中为“`200 Ok`”，它告诉我们请求已成功完成。  

**Line 2:** 这告诉我们web服务器软件和版本号。  

**Line 3:** Web服务器的当前日期、时间和时区。

**Line 4:** `Content-Type`标头告诉客户端将要发送什么样的信息，例如`HTML`、`images`、`videos`、`pdf`、`XML`。

**Line 5:** 内容长度，告诉客户端，本次响应内容的长度，这样我们就可以确认没有数据丢失。  

**Line 6:**  HTTP响应包含一个空行来确认HTTP响应信息头的结束。  

**Lines 7-14:** 已请求的信息，在本例中为主页。

## HTTP请求方法

**HTTP方法** 是客户端在发出HTTP请求时显示其预期操作的一种方式。有很多HTTP方法，但我们将介绍最常见的方法，大多数情况下使用`GET`和`POST`方法。

- **GET Request**：用于从Web服务器获取信息。
- **POST Request**： 用于向Web服务器提交数据（如表单注册等）。
- **PUT Request**：用于向Web服务器提交数据以更新信息
- **DELETE Request** ：用于从Web服务器中删除信息/记录。
- ![](../images/Pasted%20image%2020240727201712.png)
## 状态码（Status Code）

|   |   |
|---|---|
|100-199-信息响应|发送这些代码是为了告诉客户端他们的请求的第一部分已被接受，他们应该继续发送他们请求的其余部分。这些代码不再很常见。|
|200-299-成功|这一系列状态代码用于告诉客户端他们的请求成功。|
|300-399-重定向|这些用于将客户端的请求重定向到另一个资源。这可以是不同的网页或完全不同的网站。|
|400-499-客户端错误|用于通知客户端他们的请求有错误。|
|500-599-服务器错误|这是为服务器端发生的错误保留的，通常表明服务器处理请求时存在相当大的问题。|

### 常见状态码


### 问题

![](../images/Pasted%20image%2020240727202516.png)


## 标头（Headers）

标头是您可以在发出请求时发送到Web服务器的附加数据位。
尽管在HTTP协议中没有严格要求标头，但是如果没有正确的标头，你会发现很难正确查看网站。

### 通用请求标头（**Common Request Headers**）：
- **Host:** 一些Web服务器托管多个网站，因此通过提供主机标头，您可以告诉它您需要哪个，否则您将只收到服务器的默认网站。
  - **User-Agent:** 这是您的浏览器软件和版本号，告诉网络服务器您的浏览器软件有助于它为您的浏览器正确格式化网站，并且超文本标记语言、JavaScript和CSS的一些元素仅在某些浏览器中可用。
  - **Content-Length:** 当以表单等形式向Web服务器发送数据时，内容长度告诉Web服务器在Web请求中期望多少数据。这样服务器就可以确保它不会丢失任何数据。
  - **Accept-Encoding:** 告诉Web服务器浏览器支持哪些类型的压缩方法，以便可以使数据更小以通过Internet传输。
  - **Cookie：** 发送到服务器以帮助记住您的信息的数据。


### 通用响应标头（**Common Response Headers**）
**Set-Cookie：** 要存储的信息，该信息在每次请求时被发送回Web服务器。
**Cache-Control：** 在浏览器再次请求响应之前，将响应内容存储在浏览器缓存中的时间。
**Content-Type:** 这告诉客户端正在返回什么类型的数据，即：`HTML`、 `CSS`、 `JavaScript`,、`Images`、`PDF`、`Video` 等。使用内容类型标头，浏览器就知道如何处理数据。
**Content-Encoding:** 在通过互联网发送数据时，使用了什么方法来压缩数据以使其更小。
![](../images/Pasted%20image%2020240727203800.png)

## Cookies
您以前可能听说过cookie，它们只是存储在您计算机上的一小部分数据。当您从Web服务器收到“Set-Cookie”标头时，Cookie会被保存。然后您每提出一个进一步的请求，您就会将cookie数据发送回Web服务器。因为HTTP是无状态的（不会跟踪您之前的请求），cookie可用于提醒Web服务器您是谁、网站的一些个人设置或您以前是否访问过该网站。让我们看看这个作为HTTP请求的示例：

![](../images/Pasted%20image%2020240727204323.png)

![](../images/Pasted%20image%2020240727204951.png)

Cookie可用于多种用途，但最常用于网站身份验证。cookie值通常不是您可以看到密码的明文字符串，而是令牌（人类不易猜测的唯一密码）。

## 发出请求

![](../images/Pasted%20image%2020240727210255.png)