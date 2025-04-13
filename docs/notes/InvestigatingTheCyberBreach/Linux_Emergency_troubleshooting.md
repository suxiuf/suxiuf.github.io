---
title: Linux应急排查脚本
createTime: 2025/04/07 15:59:19
permalink: /fytqc3l5/
---
下面是一个简单的linux应急排查脚本，后续将持续优化：

```bash file:应急脚本
#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # 重置颜色

# 全局配置
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORT_FILE="${SCRIPT_DIR}/sec_audit_$(date +%F_%H%M%S).md"
WEB_DIRS=("/var/www" "/usr/share/nginx" "/opt/tomcat/webapps")

# 系统检测函数
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        [[ $ID == "kali" ]] && OS="debian"
    elif [ -f /etc/kylin-release ]; then
        OS="neokylin"
    elif [ -f /etc/euleros-release ]; then
        OS="euler"
    elif [ -f /etc/redhat-release ]; then
        grep -q "CentOS" /etc/redhat-release && OS="centos"
        grep -q "Red Hat" /etc/redhat-release && OS="rhel"
    else
        echo "不支持的操作系统" | tee -a "$REPORT_FILE"
        exit 1
    fi
}

# 报告初始化
init_report() {
    echo "# 系统安全审计报告 ($(date +%F))" > "$REPORT_FILE"
    echo "**生成时间**: $(date +'%F %T')" >> "$REPORT_FILE"
    
    # 目录结构
    echo -e "\n## 目录" >> "$REPORT_FILE"
    echo "- [1. 系统信息](#1-系统信息)" >> "$REPORT_FILE"
    echo "- [2. 资源监控](#2-资源监控)" >> "$REPORT_FILE"
    echo "- [3. 登录安全](#3-登录安全)" >> "$REPORT_FILE"
    echo "- [4. 计划任务](#4-计划任务)" >> "$REPORT_FILE"
    echo "- [5. 软件包检查](#5-软件包检查)" >> "$REPORT_FILE"
    echo "- [6. 网络检测](#6-网络检测)" >> "$REPORT_FILE"
    echo "- [7. SUID文件](#7-suid文件)" >> "$REPORT_FILE"
    echo "- [8. Webshell检测](#8-webshell检测)" >> "$REPORT_FILE"
    echo -e "\n------" >> "$REPORT_FILE"
    
    # 系统信息表
    echo -e "\n## 1. 系统信息" >> "$REPORT_FILE"
    echo "| 类别        | 详细信息                  |" >> "$REPORT_FILE"
    echo "|-------------|---------------------------|" >> "$REPORT_FILE"
    echo "| 主机名      | $(hostname)               |" >> "$REPORT_FILE"
    echo "| 操作系统    | $(grep PRETTY_NAME /etc/os-release | cut -d\" -f2) |" >> "$REPORT_FILE"
    echo "| 内核版本    | $(uname -r)               |" >> "$REPORT_FILE"
    echo "| 启动时间    | $(uptime -s)              |" >> "$REPORT_FILE"
}

# 检查项标题
check_section() {
    local anchor=$(echo "$1" | tr ' ' '-' | tr 'A-Z' 'a-z')
    echo -e "\n## $1 {#$anchor}" >> "$REPORT_FILE"
    echo -e "${YELLOW}[+] 正在检查：$1${NC}"
}

# 资源监控（带可视化）
check_resource_usage() {
    check_section "2. 资源监控"
    
    # CPU使用率进度条
    local cpu_usage=$(top -bn1 | awk '/Cpu$s$:/ {
        for (i=1; i<=NF; i++) {
            if ($i ~ /id/) {
                gsub(/%/, "", $(i-1))
                printf "%.1f", 100 - $(i-1)
                exit
            }
        }
    }')
    
    # 修复进度条生成
    local cpu_bar=$(awk -v usage="$cpu_usage" 'BEGIN {
        bars = int(usage / 10)
        printf "`"
        for (i=1; i<=10; i++) 
            printf "%s", (i <= bars) ? "▇" : " "
        printf "` %.1f%%", usage
    }')
    
    # 内存使用率进度条
    local mem_usage=$(free | awk '/Mem/{printf("%.1f"), $3/$2 * 100}')
    local mem_bar=$(awk -v usage=$mem_usage 'BEGIN{
        printf "`"
        for(i=1;i<=10;i++) 
            printf "%s", (i<=usage/10)?"▇":" "
        printf "` %.1f%%", usage
    }')
    
    echo "### CPU使用率" >> "$REPORT_FILE"
    echo "$cpu_bar" >> "$REPORT_FILE"
    
    echo "### 内存使用率" >> "$REPORT_FILE"
    echo "$mem_bar" >> "$REPORT_FILE"
    
    # 进程资源表
    echo "### 资源占用TOP5进程" >> "$REPORT_FILE"
    echo "| CPU% | MEM% | 进程命令 |" >> "$REPORT_FILE"
    echo "|------:|------:|----------|" >> "$REPORT_FILE"
    ps -eo pid,%cpu,%mem,cmd --sort=-%cpu | head -n6 | tail -n5 | awk '
    {
        cmd = $4
        if($2 > 50 || $3 > 30) cmd = "**" cmd "**"
        printf "| %.1f | %.1f | %-45s |\n", $2, $3, cmd
    }' >> "$REPORT_FILE"
}

# 登录安全检测
check_bruteforce() {
    check_section "3. 登录安全"
    local secure_log
    
    case $OS in
        ubuntu|debian|kali) secure_log="/var/log/auth.log";;
        *) secure_log="/var/log/secure";;
    esac

    # 失败登录统计表
    echo "### 失败登录尝试TOP5" >> "$REPORT_FILE"
    echo "| 次数 | 用户名 | IP地址       | 最后尝试时间     |" >> "$REPORT_FILE"
    echo "|-----:|--------:|:------------:|:----------------|" >> "$REPORT_FILE"
    grep -i "failed password" "$secure_log" | awk '
    {
        match($0,/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/);
        ip=substr($0,RSTART,RLENGTH)
        user=$(NF-5)
        time=$1" "$2" "$3
        key=ip"@"user
        last_time[key]=time
        count[key]++
    }
    END {
        for(k in count) {
            split(k, arr, "@")
            printf "| %4d | %-8s | %-12s | %-15s |\n", 
            count[k], arr[2], arr[1], last_time[k]
        }
    }' | sort -nr | head -5 >> "$REPORT_FILE"

    # 成功登录表
    echo "### 最近成功登录" >> "$REPORT_FILE"
    echo "| 用户名 | IP地址       | 登录时间        |" >> "$REPORT_FILE"
    echo "|--------|:------------:|-----------------|" >> "$REPORT_FILE"
    last | grep -v "reboot" | head -n10 | awk '{
        printf "| %-6s | %-12s | %-15s |\n", 
        $1, $3, $4" "$5" "$6
    }' >> "$REPORT_FILE"
}

# 计划任务检测
check_crontab() {
    check_section "4. 计划任务"
    
    echo "### 系统计划任务" >> "$REPORT_FILE"
    find /etc/cron* -type f -exec ls -l {} \; 2>/dev/null | awk '{
        printf "- `%s` \n  (修改时间: %s %s)\n", $9, $6, $7
    }' >> "$REPORT_FILE"
    
    echo "### 用户计划任务" >> "$REPORT_FILE"
    cut -d: -f1 /etc/passwd | xargs -I {} sh -c '
        crontab -l -u {} 2>/dev/null | grep -v "^#" | sed "s/^/  - /"
    ' | sed '/^$/d' | sort -u >> "$REPORT_FILE"
}

# 软件包检查
check_packages() {
    check_section "5. 软件包检查"
    
    case $OS in
        ubuntu|debian|kali)
            if command -v debsums &>/dev/null; then
                debsums -c 2>/dev/null | grep -v "OK$" | sed 's/^/- /' >> "$REPORT_FILE"
            else
                echo "请安装校验工具：\`sudo apt install debsums\`" >> "$REPORT_FILE"
            fi;;
        centos|rhel|neokylin)
            rpm -Va --nofiles --nodigest | awk '{
                if($1 ~ /^.......T/ && $2 != "c") 
                    print "- " $0
            }' >> "$REPORT_FILE";;
        euler)
            dnf verify --all | grep -v "OK" >> "$REPORT_FILE";;
    esac
}

# 网络检测（增强版）
check_ports() {
    check_section "6. 网络检测"
    
    # 监听端口检测
    local listen_cmd
    if command -v ss &>/dev/null; then
        listen_cmd="ss -tulnH"
    elif command -v netstat &>/dev/null; then
        listen_cmd="netstat -tuln"
    else
        echo "[!] 网络工具缺失" >> "$REPORT_FILE"
        return 1
    fi

    echo "### 监听端口" >> "$REPORT_FILE"
    echo "| 协议 | 端口   | 进程                | 绑定地址       |" >> "$REPORT_FILE"
    echo "|------|-------:|--------------------:|:--------------|" >> "$REPORT_FILE"
    eval "$listen_cmd" | awk '
    {
        if (listen_cmd ~ /^ss/) {
            split($5, a, "]:"); 
            port=a[2]
            ip=a[1]
            gsub(/$$/, "", ip)
        } else {
            split($4, a, ":"); 
            port=a[2]
            ip=a[1]
        }
        printf "| %-5s | %5s | %-18s | %-14s |\n", 
        $1, port, $NF, ip
    }' listen_cmd="$listen_cmd" >> "$REPORT_FILE"

    # 异常连接检测
    local estab_cmd
    if command -v netstat &>/dev/null; then
        estab_cmd="netstat -antp"
    elif command -v ss &>/dev/null; then
        estab_cmd="ss -antp"
    else
        echo "[!] 连接检测工具缺失" >> "$REPORT_FILE"
        return 1
    fi

    echo "### 异常连接" >> "$REPORT_FILE"
    echo "| 次数   | 远程IP         | 端口  | 进程           | 风险等级 |" >> "$REPORT_FILE"
    echo "|-------:|:---------------|------:|---------------|---------|" >> "$REPORT_FILE"
    eval "$estab_cmd" | awk '
    {
        if (estab_cmd ~ /^netstat/) {
            state_col=6
            addr_col=5
            prog_col=$7
        } else {
            state_col=2
            addr_col=6
            prog_col=$7
        }
        if ($state_col != "ESTABLISHED") next

        split($addr_col, a, ":")
        ip=a[1]
        port=a[2]
        gsub(/\[|$$/, "", ip)
        
        # 风险评估
        risk="低"
        if (port <= 1024) risk="中"
        if (prog_col ~ /(ssh|mysql)/) risk="高"
        if (ip ~ /^(192\.168|10\.|172\.)/) risk="低"
        
        key=ip":"port
        count[key]++
        progs[key]=prog_col
        risks[key]=risk
    }
    END {
        for(k in count) {
            split(k, arr, ":")
            printf "| %4d次 | %-15s | %5s | %-12s | %-7s |\n", 
            count[k], arr[1], arr[2], progs[k], risks[k]
        }
    }' estab_cmd="$estab_cmd" | sort -nr | head -10 >> "$REPORT_FILE"
}

# SUID检测
check_suid() {
    check_section "7. SUID文件"
    
    find / -xdev -type f -perm -4000 2>/dev/null | while read -r file; do
        case "$file" in
            /usr/bin/passwd|/usr/bin/sudo|/usr/bin/chsh)
                continue;;
            *)
                echo "**可疑文件**: \`$file\`" >> "$REPORT_FILE"
                stat -c "  权限: %A | 用户: %U | 组: %G" "$file" >> "$REPORT_FILE";;
        esac
    done
}

# Webshell检测
check_webshell() {
    check_section "8. Webshell检测"
    
    for dir in "${WEB_DIRS[@]}"; do
        [ -d "$dir" ] || continue
        
        echo "#### 扫描目录: \`$dir\`" >> "$REPORT_FILE"
        find "$dir" -type f $ -name "*.php" -o -name "*.jsp" $ -exec grep -lE "eval\(|base64_decode|shell_exec" {} \; | while read -r file; do
            echo "**可疑文件**: \`$file\`" >> "$REPORT_FILE"
            echo "匹配内容：" >> "$REPORT_FILE"
            grep -nH -E "eval\(|base64_decode|shell_exec" "$file" | head -n3 | sed 's/^/    > /' >> "$REPORT_FILE"
            echo -e "------\n" >> "$REPORT_FILE"
        done
    done
}

# 新增病毒检查函数
check_antivirus() {
    check_section "病毒扫描"
    
    # 检查ClamAV安装
    if ! command -v clamscan &> /dev/null; then
        echo -e "${RED}[!] ClamAV未安装，正在尝试安装...${NC}"
        case $OS in
            ubuntu|debian|kali)
                apt-get install -y clamav clamav-daemon || {
                    echo "  安装失败" >> "$REPORT_FILE"
                    return 1
                }
                ;;
            centos|rhel|neokylin)
                yum install -y clamav clamav-update || {
                    echo "  安装失败" >> "$REPORT_FILE"
                    return 1
                }
                ;;
            euler)
                dnf install -y clamav || {
                    echo "  安装失败" >> "$REPORT_FILE"
                    return 1
                }
                ;;
            *) 
                echo "  不支持自动安装ClamAV" >> "$REPORT_FILE" 
                return 1 
                ;;
        esac
        echo -e "${GREEN}[√] ClamAV安装成功${NC}"
    fi

    # 病毒定义更新
    echo -e "${YELLOW}[+] 更新病毒库...${NC}"
    freshclam --quiet 2>&1 | tee -a "$REPORT_FILE"

    # 扫描模式选择
    echo -e "\n${YELLOW}请选择扫描模式：${NC}"
    PS3="输入选项编号: "
    options=("快速扫描(关键目录)" "完整扫描(全盘)" "自定义路径")
    select opt in "${options[@]}"; do
        case $opt in
            "快速扫描(关键目录)")
                SCAN_PATHS=("/bin" "/usr/bin" "/sbin" "/etc" "/root")
                break
                ;;
            "完整扫描(全盘)")
                SCAN_PATHS=("/")
                echo -e "${RED}[!] 全盘扫描可能耗时较长！${NC}"
                break
                ;;
            "自定义路径")
                read -p "输入扫描路径（空格分隔）: " -a SCAN_PATHS
                break
                ;;
            *) 
                echo -e "${RED}[!] 无效选项，请重新选择${NC}"
                ;;
        esac
    done

    # 执行扫描
    echo -e "\n${YELLOW}[+] 开始病毒扫描...${NC}"
    clamscan --recursive --infected --log="$CLAMLOG" \
             --exclude-dir="^/sys|^/proc|^/dev" \
             "${SCAN_PATHS[@]}" 2>&1 | tee -a "$REPORT_FILE"

    # 结果分析
    echo -e "\n### 病毒扫描结果" >> "$REPORT_FILE"
    if grep -q "Infected files: 0" "$CLAMLOG"; then
        echo "✅ ​**未发现病毒感染文件**" >> "$REPORT_FILE"
    else
        echo "❌ ​**发现潜在威胁：​**" >> "$REPORT_FILE"
        echo "| 文件路径 | 病毒名称 |" >> "$REPORT_FILE"
        echo "|----------|----------|" >> "$REPORT_FILE"
        grep "FOUND" "$CLAMLOG" | awk -F: '{
            gsub(/ /,"",$2)
            printf "| `%s` | %s |\n", $1, $2
        }' >> "$REPORT_FILE"
    fi

    # 添加统计信息
    echo -e "\n**扫描统计**:\n" >> "$REPORT_FILE"
    awk '/Scanned files|Infected files|Total errors|Data scanned|Data read|Time/{
        gsub(/,/,"")
        print "- " $0
    }' "$CLAMLOG" >> "$REPORT_FILE"
}

# 主流程
main() {
    detect_os
    init_report
    
    # 新增用户交互提示
    read -p "[?] 是否执行病毒扫描？(y/N) " -n 1 -r
    echo  # 换行
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        check_antivirus
    else
        echo -e "${YELLOW}[!] 跳过病毒扫描${NC}"
    fi
    
    check_resource_usage
    check_bruteforce
    check_crontab
    check_packages
    check_ports
    check_suid
    check_webshell
    
    echo -e "\n${GREEN}审计完成，报告路径: ${REPORT_FILE}${NC}"
}

# 执行入口
[ $EUID -eq 0 ] || {
    echo -e "${RED}请使用root权限执行!${NC}"
    exit 1
}

main "$@"
```