#!/bin/bash
# BiteQR — Oracle Cloud Ubuntu 24.04 Deployment Script
# Run this ONCE on a fresh VM as root or with sudo

set -e

echo "=== BiteQR Deployment Setup ==="

# 1. Update system
apt-get update && apt-get upgrade -y

# 2. Install Docker
apt-get install -y ca-certificates curl gnupg lsb-release
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 3. Enable Docker to start on boot
systemctl enable docker
systemctl start docker

# 4. Allow current user to run docker without sudo (re-login required)
usermod -aG docker $USER

echo ""
echo "=== Docker installed successfully ==="
echo ""
echo "Next steps:"
echo "  1. Upload your project:  scp -r /Users/nitingaikwad/Res ubuntu@YOUR_VM_IP:~/biteqr"
echo "  2. SSH into VM:          ssh ubuntu@YOUR_VM_IP"
echo "  3. Edit the .env file:   nano ~/biteqr/backend/.env"
echo "     → Fill in ADMIN_EMAIL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,"
echo "       SESSION_SECRET, FRONTEND_URL, GOOGLE_CALLBACK_URL"
echo "  4. Open port 80 in Oracle Cloud Security List (Ingress Rule: TCP 0.0.0.0/0 port 80)"
echo "  5. Build and start:      cd ~/biteqr && docker compose up -d --build"
echo "  6. Check logs:           docker compose logs -f"
echo ""
echo "=== Done ==="
