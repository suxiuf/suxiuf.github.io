
---

\> **系统信息：**  
\>  
\> NAME="EndeavourOS"  
\> PRETTY\_NAME="EndeavourOS"  
\> ID="endeavouros"  
\> ID\_LIKE="arch"  
\> BUILD\_ID=rolling  
\> ANSI\_COLOR="38;2;23;147;209"  
\> HOME\_URL="https://endeavouros.com"  
\> DOCUMENTATION\_URL="https://discovery.endeavouros.com"  
\> SUPPORT\_URL="https://forum.endeavouros.com"  
\> BUG\_REPORT\_URL="https://forum.endeavouros.com/c/arch-based-related-questions/bug-reports"  
\> PRIVACY\_POLICY\_URL="https://endeavouros.com/privacy-policy-2"  
\> LOGO="endeavouros"

## 系统安装

官方镜像下载：[https://endeavouros.com/](%5Bhttps://endeavouros.com/%5D())

选择安装i3桌面系统

*   配置窗口透明：

         安装 picom  ，找到i3配置文件 `~/.config/i3/config` ，在其中找到下面这行代码取消注释，重新打开窗口，可以发现已经配置成功。

```plaintext
vexec_always --no-startup-id picom -b
```

*   更换壁纸  
    找一张好看的壁纸，放到/usr/share/endeavouros/backgrounds/ 下，然后将配置文件中的图片路径改为你想要的壁纸路径。

```plaintext
exec --no-startup-id sleep 1 &amp;&amp; feh --bg-fill /usr/share/endeavouros/backgrounds/Animated.png
```

*   如果想配置定时更换壁纸，请参考以下配置：

```plaintext
#!/bin/sh

while true; do
    find ~/图片 -type f \( -name '*.jpg' -o -name '*.png' \) -print0 |
        shuf -n1 -z | xargs -0 feh --bg-scale
    sleep 15m
done
```

*   随机壁纸  
    每次重启电脑或重启i3就会随机选择文件夹里的图片当作壁纸

```plaintext
exec_always --no-startup-id feh --randomize --bg-fill ~/图片/*
```

## 常用软件安装

请根据实际情况查找合适你系统的软件安装

```plaintext
yay -S electronic-wechat-uos-bin
yay -S wemeet
yay -S bluemail
yay -S code
yay -S flameshot
```

*   字体安装

```plaintext
sudo pacman -S wqy-bitmapfont wqy-microhei wqy-microhei-lite wqy-zenhei
sudo pacman -S noto-fonts-cjk adobe-source-han-sans-cn-fonts adobe-source-han-serif-cn-fonts
```

*   输入法安装

```plaintext
sudo pacman -S fcitx5 fcitx5-chinese-addons  fcitx5-qt fcitx5-gtk    fcitx5-pinyin-zhwiki
```

*   解决开机自启动及显示问题

在 `/etc/environment` 文件中添加以下内容

```plaintext
GTK_IM_MODULE=fcitx5
QT_IM_MODULE=fcitx5
XMODIFIERS=@im=fcitx5
```

*   配置云拼音

        运行`fcitx5-configtool` , 步骤略。

## Terminal 主题配置

*   zsh 及插件下载

```plaintext
sudo pacman -Sy zsh
sudo pacman -S zsh-autosuggestions zsh-syntax-highlighting zsh-theme-powerlevel10k zsh-completions
chsh -s /usr/bin/zsh
```

*   配置 `~/.zshrc` 文件

在 `~/.zshrc` 中引用刚才下载的三个插件：

```plaintext
source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
source /usr/share/zsh-theme-powerlevel10k/powerlevel10k.zsh-theme
```

重新启动terminal,会弹出设置提示，按提示设置即可。或者直接复制以下代码到`~/.zshrc` 文件：

```plaintext
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi


source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
source /usr/share/zsh-theme-powerlevel10k/powerlevel10k.zsh-theme

alias ls='ls --color=auto'
alias ll="ls -av --ignore=.."
alias l="ls -lav --ignore.?*"


# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
```

## Terminal 背景及字体设置

如果是`xfce4-terminal`，可以直接打开 xfce终端设置工具进行手动设置（背景透明），如下图：

*   文字颜色
![image](https://img2023.cnblogs.com/blog/1689264/202307/1689264-20230727230821791-369881226.png)


*   背景透明度

![image](https://img2023.cnblogs.com/blog/1689264/202307/1689264-20230727230839533-708375003.png)


## 参考文档

[https://blog.csdn.net/weixin_43372529/article/details/106712115](https://blog.csdn.net/weixin_43372529/article/details/106712115)