#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

echo "[INFO] Updating package index..."
sudo apt-get update -y

echo "[INFO] Upgrading packages..."
sudo apt-get upgrade -y

echo "[INFO] Removing obsolete packages..."
sudo apt-get autoremove -y
sudo apt-get autoclean -y

echo "[INFO] Server update completed."
