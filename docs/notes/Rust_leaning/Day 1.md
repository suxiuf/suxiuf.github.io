---
title: Day 1
createTime: 2025/04/07 16:03:09
permalink: /notes/Rust_leaning/Day 1/
---
# 学习目标

- 阅读Rust语言介绍(**中文官网**：[https://www.rust-lang.org/zh-CN/](https://www.rust-lang.org/zh-CN/))
- 在 Linux、macOS 和 Windows 上安装 Rust
- 编写一个打印 Hello, world! 的程序
- 使用 Rust 的包管理器和构建系统 cargo
# 安装

## 在 Linux 或 macOS 上安装 rustup
如果你使用 Linux 或 macOS，打开终端并输入如下命令：

```shell
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```
此命令下载一个脚本并开始安装 rustup 工具，这会安装最新稳定版 Rust。过程中可能会提示你输入密码。如果安装成功，将会出现如下内容：
```shell
Rust is installed now. Great!
```
另外，你还需要一个 链接器（linker），这是 Rust 用来将其编译的输出连接到一个文件中的程序。很可能你已经有一个了。如果你遇到了链接器错误，请尝试安装一个 C 编译器，它通常包括一个链接器。C 编译器也很有用，因为一些常见的 Rust 包依赖于 C 代码，因此需要安装一个 C 编译器。

## 在 macOS 上，你可以通过运行以下命令获得 C 语言编译器：
```shell
$ xcode-select --install
```

Linux 用户通常需要根据发行版（distribution）文档安装 GCC 或 Clang。比如，如果你使用 Ubuntu，可以安装 build-essential 包。

## 在Windows 上安装rust
请下载  **rust.init**  并运行该工具
[https://www.rust-lang.org/zh-CN/tools/install](https://www.rust-lang.org/zh-CN/tools/install )
https://www.rust-lang.org/zh-CN/learn/get-started
![[Pasted image 20240131134518.png]]

