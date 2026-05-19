#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

echo "[INFO] Updating apt indexes..."
sudo apt-get update -y

echo "[INFO] Installing base packages..."
sudo apt-get install -y \
  curl wget gnupg ca-certificates lsb-release unzip jq git \
  build-essential software-properties-common

echo "[INFO] Installing OpenJDK 21..."
sudo apt-get install -y openjdk-21-jdk
java -version

echo "[INFO] Installing Node.js 22 LTS..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v

echo "[INFO] Installing Nginx + Certbot + UFW + PostgreSQL client..."
sudo apt-get install -y nginx certbot python3-certbot-nginx ufw postgresql-client

echo "[INFO] Enabling Nginx..."
sudo systemctl enable nginx
sudo systemctl start nginx

echo "[INFO] Bootstrap complete."
