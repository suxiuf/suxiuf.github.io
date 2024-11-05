# Hash与加密

在开始之前，我们需要重新认识和理解一些术语，因为你在工作中用到的行可能话并不准确。

- **明文** ：加密或哈希之前的数据，通常指文本，但不总是，因为它可以是照片或其他文件。
- **编码**：这不是一种加密形式，只是一种数据表形式，如base64或十六进制，编码是立即可逆的。
- **Hash**：哈希是哈希函数的输出，哈希也可以用作动词`to hash` 意思是产生某些数据的哈希值。**（hash有的音译为`哈希` 有的意译为`散列`都是一个东西）**。
- **暴力破解**：（Brute force）通过尝试每个不同的密码或每个不同的秘钥来猜测密码（有的人喜欢叫“暴力猜解”）。
- **密码分析**：通过找到底层数学的弱点来攻击密码学。

::: details  base64 是加密（encryption）还是编码（encoding）？
**答案：** `encoding`
:::

## hash 函数是什么？

哈希函数(hash function)与加密完全不同。没有键，这意味着不可能（或非常困难）从输出返回到输入（不可逆）。

hash function 接受一些任意大小的输入数据，并创建该数据的摘要。输出是固定大小。很难预测任何输入的输出是什么，反之亦然。好的hash算法计算起来（相对）快，反转（从输出确定输入）起来慢。输入数据中的任何微小变化（即使一个单位）都将导致输出的巨大变化。

has function 的输出通常是原始字节，然后对其进行编码。常见的编码是64进制或16进制，解码这些不会给你任何有用的东西。

## 为什么要关心？

hash在网络安全中经常使用。当你登录TryHackMe时，它使用hash来验证你的密码。当你登录到你的电脑，也使用hash来验证你的密码。您与hash之间的交换比你想象的要多，主要是在密码的上下文中。

## 什么事hash冲突？

hash 冲突是两个不同的输入给出相同的输出。hash function 旨在尽可能避免这种情况，特别是能够设计（故意创建）冲突。

由于鸽子洞效应，冲突是不可避免的。鸽子洞效应是，hash function 的输出值数量是固定的，但输入值的数量是任意的。由于输入比输出多，因此某些输入必须给出相同的输出。如果你有128只鸽子和96个鸽子洞，一些鸽子将不得不分享相同的洞。

**`MD5` 和 `SHA1` 已遭受攻击**，由于工程上的哈希碰撞而在技术上变得不安全。然而，目前还没有一种攻击能同时在这两种算法中产生碰撞，所以如果你使用 MD5 哈希值和 SHA1 哈希值进行比较，你会发现它们是不同的。MD5 碰撞示例可从 [https://www.mscs.dal.ca/~selinger/md5collision/](https://www.mscs.dal.ca/~selinger/md5collision/) 获取，SHA1 碰撞的详细信息可从 [https://shattered.io/](https://shattered.io/) 获取。由于这些原因，你不应该信任这两种算法来对密码或数据进行哈希处理。

::: details MD5哈希函数的输出大小（以字节 *bytes* 为单位）是多少？
**答案**：`16` 
:::

::: details 你能避免哈希冲突吗？(Yea/Nay)
**答案：** `Nay`
:::


::: details 如果你有一个8位的哈希输出，有多少可能的哈希？
**答案**：`256`
:::

```cardlink
url: https://nakamoto.com/hash-functions/#:~:text=This%20should%20be%20obvious%20when,for%2028%20possible%20values.
title: "Hash Functions"
description: "The most important building block for any cryptocurrency is the hash function."
host: nakamoto.com
favicon: https://nakamoto.com/content/images/size/w256h256/2020/01/bitcoin-flag-transparent--1-.png
image: https://nakamoto.com/content/images/size/w1200/2020/01/hash-functions.png
```

