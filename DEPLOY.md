# Valisa Cloud 部署说明

- **线上地址**: https://valisa.cloud  
- **仓库**: https://github.com/Lanewoo/valisa-cloud  
- **服务器**: Ubuntu（Nginx + Let's Encrypt）

---

## 一、本地推送到 GitHub

```bash
git add .
git commit -m "你的提交说明"
git push origin main
```

---

## 二、服务器首次部署（从零开始）

### 2.1 安装 Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

### 2.2 克隆代码到工作目录（不要直接做网站根目录）

建议在用户目录克隆，再复制到 Nginx 的 web 根目录，避免权限问题：

```bash
cd ~
git clone https://github.com/Lanewoo/valisa-cloud.git valisa-cloud
```

### 2.3 配置网站根目录（必须用真实目录，不要用符号链接）

```bash
# 使用真实目录，便于 Nginx（www-data）读写
sudo mkdir -p /var/www/valisa.cloud
sudo cp -r ~/valisa-cloud/* /var/www/valisa.cloud/
sudo chown -R www-data:www-data /var/www/valisa.cloud
sudo find /var/www/valisa.cloud -type d -exec chmod 755 {} \;
sudo find /var/www/valisa.cloud -type f -exec chmod 644 {} \;
```

### 2.4 添加 Nginx 站点配置

```bash
sudo nano /etc/nginx/sites-available/valisa.cloud
```

写入（将 `valisa.cloud` 换成你的域名或服务器 IP）：

```nginx
server {
    listen 80;
    server_name valisa.cloud www.valisa.cloud;
    root /var/www/valisa.cloud;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

保存后启用并测试：

```bash
sudo ln -sf /etc/nginx/sites-available/valisa.cloud /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2.5 配置 HTTPS（Let's Encrypt）

确保域名已解析到本机（Namecheap 等处 A 记录指向本机公网 IP），然后：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d valisa.cloud -d www.valisa.cloud
```

按提示输入邮箱、同意条款。证书会自动写入 Nginx 并配置自动续期。

---

## 三、日常更新站点（已有部署）

在服务器上拉取最新代码并同步到 web 根目录：

```bash
cd ~/valisa-cloud
git pull origin main
sudo cp -r ~/valisa-cloud/* /var/www/valisa.cloud/
sudo systemctl reload nginx
```

如需保持 `www-data` 权限（若之前改过文件）：

```bash
sudo chown -R www-data:www-data /var/www/valisa.cloud
```

---

## 四、常见问题

### 500 Internal Server Error / Permission denied

- **原因**：Nginx 用户 `www-data` 无法读取网站目录或文件（例如 root 指向了 `/root` 下的目录）。
- **处理**：网站根目录必须放在 `/var/www/valisa.cloud` 这类路径，且所有权为 `www-data:www-data`，不要用指向 `/root/valisa-cloud` 的符号链接。按「2.3」重新复制并设置权限。

### Certbot 验证失败（503 / unauthorized）

- **原因**：域名未解析到本机，或 80 端口被其他配置占用。
- **处理**：在域名服务商（如 Namecheap）的 Advanced DNS 中，将 `@` 和 `www` 的 A 记录指向本机公网 IP；本机执行 `curl -s ifconfig.me` 可查看公网 IP。确保 Nginx 已正确监听 80 并重载。

### 查看 Nginx 错误日志

```bash
sudo tail -30 /var/log/nginx/error.log
```

---

## 五、域名 DNS（Namecheap 示例）

- 登录 Namecheap → Domain List → 选择 valisa.cloud → **Advanced DNS**。
- 展开 **HOST RECORDS**，确保：
  - **@** → A Record → 服务器公网 IP  
  - **www** → A Record → 同一 IP（或 CNAME 指向主域名）
- 保存后等待 DNS 生效（约数分钟至数小时）。
