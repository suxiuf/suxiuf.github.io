---
title: Hash与加密
createTime: 2024/11/16 19:34:46
permalink: /penetration/rjzda7s8/
---
# Hash与加密

在开始之前，我们需要重新认识和理解一些术语，因为你在工作中用到的行可能话并不准确。

- **明文** ：加密或哈希之前的数据，通常指文本，但不总是，因为它可以是照片或其他文件。
- **编码**：这不是一种加密形式，只是一种数据表形式，如base64或十六进制，编码是立即可逆的。
- **Hash**：哈希是哈希函数的输出，哈希也可以用作动词`to hash` 意思是产生某些数据的哈希值。**（hash有的音译为`哈希` 有的意译为`散列`都是一个东西）**。
- **暴力破解**：（Brute force）通过尝试每个不同的密码或每个不同的秘钥来猜测密码（有的人喜欢叫“暴力猜解”）。
- **密码分析**：通过找到底层数学的弱点来攻击密码学。

```ad-details
collapse: true
title: base64 是加密（encryption）还是编码（encoding）？
**答案：** `encoding`
```

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

## 回答以下问题

```ad-details
collapse: true
title: MD5哈希函数的输出大小（以字节 *bytes* 为单位）是多少？
**答案**：`16` 
```

```ad-details
collapse: true
title: 你能避免哈希冲突吗？(Yea/Nay)
**答案：** `Nay`
```

```ad-details
collapse: true
title: 如果你有一个8位的哈希输出，有多少可能的哈希？
**答案**：`256`
```

````ad-info
title: 参考
collapse: true

```cardlink  
url: https://nakamoto.com/hash-functions/#:~:text=This%20should%20be%20obvious%20when,for%2028%20possible%20values.
title: "Hash Functions"
description: "The most important building block for any cryptocurrency is the hash function."
host: nakamoto.com
favicon: https://nakamoto.com/content/images/size/w256h256/2020/01/bitcoin-flag-transparent--1-.png
image: https://nakamoto.com/content/images/size/w1200/2020/01/hash-functions.png
```

````

## 使用hashing

#### hash 用于防止密码泄露

如果密码明文存储或者使用简单的加密进行存储，一但泄露，很容易被破解。如果数据库中不存放密码，只存放hash值，就会避免密码泄露。

#### 彩虹表

由于在hash函数中，如果输入相同的字符串，hash值总是相同，因此人们可以制作一个**彩虹表**，用于hash函数的反向查询，从而**打破**hash。以下是一个**彩虹表**的例子：

|               Hash               |  Password  |
| :------------------------------: | :--------: |
| 02c75fb22c75b23dc963c7eb91a062cc |  zxcvbnm   |
| b0baee9d279d34fa1dfd71aadb908c3f |   11111    |
| c44a471bd78cc6c2fea32b9fe028d30a | asdfghjkl  |
| d0199f51d2728db6011945145a1b607a | basketball |
| dcddb75469b4b4875094e14561e573d8 |   000000   |
| e10adc3949ba59abbe56e057f20f883e |   123456   |
| e19d5cd5af0378da05f63f891c7467af |  abcd1234  |
| e99a18c428cb38d5f260853678922e03 |   abc123   |
| fcea920f7412b5da7be0cf42b8c93759 |  1234567   |

#### 防止彩虹表

为了防止**彩虹表（rainbow tables）**，人们想到了在hash中加**盐(salt)** 的方法，盐随机生成并存储在数据库中，每个用户都是唯一的。**盐(salt)** 被添加到hash值的开头或者结尾。 这意着用户即使使用相同的密码，任然会生成不同的hash值。

- **盐(salt)** 用于防止彩虹表
- 每个用户的**盐(salt)** 是随机生成，值唯一
- **盐(salt)** 被添加到hash值的开头或结尾

>[!TIP] think
从理论上讲，如果为所有用户使用相同的盐，但这意味着重复的密码仍然具有相同的哈希值，并且彩虹表仍然可以使用该盐创建特定的密码。

### 回答以下问题

```ad-details
collapse: true
title:  使用彩虹表手动破解 hash `d0199f51d2728db6011945145a1b607a`
**答案:** `basketball`

*提示： 可利用此房间给出的彩虹表的例子，进行查询*
```

```ad-details
collapse: true
title: 使用在线工具破解哈希 `5b31f93c09ad1d065c0491b764d04933`
**答案:** `tryhackme`
*提示：我们可以使用此[网站(需翻墙)](https://crackstation.net)或者[此网站](https://hashes.com/zh/decrypt/hash)进行线上破解*
```

```ad-details
collapse: true
title: 你应该加密密码吗？ Yea/Nay
**答案:** `Nay`

*提示：在此房间中，认为密码加密不是那么安全，最好对密码进行hash。*
```


