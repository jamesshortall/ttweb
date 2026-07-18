# Hosting on an IONOS VPS (step by step)

Deploy the Travel Technician site on an **IONOS VPS Linux / Cloud Server** running
**Ubuntu 22.04 or 24.04 LTS**. This is a full server setup: Node.js + pm2 (keeps the app
running) + nginx (HTTPS in front) + Let's Encrypt (free SSL).

> Do **not** use IONOS "Web Hosting" (shared PHP) — it can't run this app. You need a VPS
> or Cloud Server with root SSH access.

Replace `SERVER_IP` with your VPS's IP address throughout.

> **Which OS do you have?** The numbered steps below use **Ubuntu/Debian** commands (`apt`,
> `ufw`). If `apt` isn't found, your server is **Rocky Linux / AlmaLinux / CentOS** (RHEL
> family) — jump to the [RHEL-family section](#rocky-linux--almalinux--centos-rhel-family)
> for the equivalent commands. Check with `cat /etc/os-release`.

---

## 1. Log in and update the server

```bash
ssh root@SERVER_IP
apt update && apt upgrade -y
```

## 2. Basic firewall

```bash
apt install -y ufw
ufw allow 22          # SSH
ufw allow 80          # HTTP
ufw allow 443         # HTTPS
ufw --force enable
```

## 3. (If your VPS has only 1 GB RAM) add swap so the build doesn't run out of memory

```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

Skip this on a 2 GB+ server.

## 4. Install Node.js 20 and git

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git
node -v && npm -v      # expect v20.x and 10.x
```

## 5. Get the code (private repo → use a deploy key)

Create a read‑only key on the server:

```bash
ssh-keygen -t ed25519 -C "ionos-deploy" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

Copy the printed line, then in GitHub: **repo → Settings → Deploy keys → Add deploy key**,
paste it, leave "Allow write access" **unchecked**, save. Then clone:

```bash
cd ~
git clone git@github.com:jamesshortall/ttweb.git
cd ttweb
git checkout claude/travel-technician-website-nizdrs
```

> Once you merge the pull request into `main`, deploy `main` instead: `git checkout main`.

## 6. Configure environment variables (before building)

`NEXT_PUBLIC_*` values are baked in at build time, so set them **before** `npm run build`.

```bash
cp .env.example .env.production.local
nano .env.production.local
```

At minimum set:

```
NEXT_PUBLIC_SITE_URL=https://www.traveltechnician.info
```

Fill in the others as you're ready (email provider, Sanity IDs, revalidation secret — all
optional; the site runs without them). Save with `Ctrl+O`, `Enter`, `Ctrl+X`.

## 7. Install dependencies and build

```bash
npm ci
npm run build
```

## 8. Keep it running with pm2

```bash
npm install -g pm2
pm2 start npm --name traveltechnician -- start   # runs the app on port 3000
pm2 save
pm2 startup                                       # prints one command — copy & run it
```

Running the command `pm2 startup` prints (and you then paste) makes the app relaunch on
reboot. Check it's up: `curl -I http://localhost:3000` should return `HTTP/1.1 200`.

## 9. Point DNS at the server (in the IONOS domain panel)

In IONOS: **Domains & SSL → traveltechnician.info → DNS**, create:

| Type | Host name | Points to  |
| ---- | --------- | ---------- |
| A    | `www`     | SERVER_IP  |
| A    | `@`       | SERVER_IP  |

Wait for it to resolve (check from your laptop: `nslookup www.traveltechnician.info`).
TLS issuance in step 11 needs DNS working first.

## 10. Install nginx and add the site

```bash
apt install -y nginx
nano /etc/nginx/sites-available/traveltechnician
```

Paste:

```nginx
server {
    listen 80;
    server_name www.traveltechnician.info traveltechnician.info;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:

```bash
ln -s /etc/nginx/sites-available/traveltechnician /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

The site should now load over **http://** at your domain.

## 11. Add free HTTPS (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d www.traveltechnician.info -d traveltechnician.info
```

When prompted, choose to **redirect HTTP to HTTPS**. Certbot edits nginx, installs the
certificate, and sets up auto‑renewal. Verify renewal works:

```bash
certbot renew --dry-run
```

## 12. Redirect the bare domain to www (recommended)

```bash
nano /etc/nginx/sites-available/traveltechnician
```

Add this block at the **bottom** of the file (certbot already added the cert lines it
references):

```nginx
server {
    listen 443 ssl;
    server_name traveltechnician.info;
    ssl_certificate /etc/letsencrypt/live/www.traveltechnician.info/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.traveltechnician.info/privkey.pem;
    return 301 https://www.traveltechnician.info$request_uri;
}
```

Then:

```bash
nginx -t && systemctl reload nginx
```

## 13. Verify

```bash
curl -I https://www.traveltechnician.info
```

Expect `HTTP/2 200`, plus `content-security-policy`, `strict-transport-security`, and
`x-content-type-options: nosniff` headers. Open the site in a browser to confirm.

---

## Updating the site later

Whenever there are new changes to publish:

```bash
cd ~/ttweb
git pull
npm ci
npm run build
pm2 restart traveltechnician
```

Or save this as `~/deploy.sh` (`chmod +x ~/deploy.sh`) and just run `~/deploy.sh`:

```bash
#!/usr/bin/env bash
set -e
cd ~/ttweb
git pull
npm ci
npm run build
pm2 restart traveltechnician
```

## Troubleshooting

- **Site down / 502 in the browser:** check the app is running — `pm2 status`,
  `pm2 logs traveltechnician`.
- **Build killed / out of memory:** add swap (step 3).
- **HTTPS won't issue:** DNS isn't pointing at the server yet — recheck step 9 and wait.
- **Env change didn't take effect:** `NEXT_PUBLIC_*` values require a rebuild
  (`npm run build` then `pm2 restart traveltechnician`), not just a restart.

---

## Rocky Linux / AlmaLinux / CentOS (RHEL family)

IONOS often provisions **Rocky Linux**. It uses `dnf` (not `apt`), `firewalld` (not `ufw`),
and ships with **SELinux enforcing** — which blocks nginx from reaching the app unless you
allow it. Use these in place of the matching numbered steps above; the rest (deploy key,
`.env.production.local`, `npm ci && npm run build`, pm2, DNS, verify) is identical.

**Steps 1–2 — update, tools, firewall:**

```bash
dnf upgrade -y
dnf install -y nano git
systemctl enable --now firewalld
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

**Step 4 — Node.js 20:**

```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs
node -v && npm -v
```

**Step 10 — nginx (config lives in `conf.d/`, plus the SELinux switch):**

```bash
dnf install -y nginx
systemctl enable --now nginx
# CRITICAL on RHEL/SELinux — without this nginx returns 502 to the app:
setsebool -P httpd_can_network_connect 1
nano /etc/nginx/conf.d/traveltechnician.conf   # paste the same server{} block as above
nginx -t && systemctl reload nginx
```

**Step 11 — certbot (via EPEL):**

```bash
dnf install -y epel-release
dnf install -y certbot python3-certbot-nginx
certbot --nginx -d www.traveltechnician.info -d traveltechnician.info
certbot renew --dry-run
```

Everything else — including the apex→www redirect block and the update workflow — is the
same as the Ubuntu instructions above.
