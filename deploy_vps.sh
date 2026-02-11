#!/bin/bash
set -e # Exit on error

# --- Configuration ---
VPS_IP="197.140.10.216"
VPS_USER="root"
REMOTE_DIR="/var/www/pdi-app"
LOCAL_DIR="/Users/ayoub_designs/Advanced projects /newletter builder/pdi-platform-app/"

# SSH Options to bypass host key verification prompt (for fresh setup)
SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"

echo " "
echo "🚀 Starting Deployment to $VPS_USER@$VPS_IP"
echo "⚠️  Important: When prompted, type the password: icosnet"
echo " "

# --- Step 1: Install Docker on VPS ---
echo "📦 [1/3] Connecting to VPS to setup Docker..."
# We use the SSH options here
ssh $SSH_OPTS $VPS_USER@$VPS_IP << 'ENDSSH'
  export DEBIAN_FRONTEND=noninteractive
  
  echo "   -> Checked connection."
  
  if ! command -v docker &> /dev/null; then
      echo "   -> Installing Docker (this may take a minute)..."
      apt-get update -qq > /dev/null
      apt-get install -y docker.io docker-compose > /dev/null
      systemctl start docker
      systemctl enable docker
  else
      echo "   -> Docker is already installed."
  fi
  
  mkdir -p /var/www/pdi-app
ENDSSH

echo " "
# --- Step 2: Copy Files ---
echo "📂 [2/3] Copying application files..."
# Rsync with custom ssh options
rsync -avz -e "ssh $SSH_OPTS" --exclude 'node_modules' --exclude '.next' --exclude '.git' --exclude '.env.local' "$LOCAL_DIR" $VPS_USER@$VPS_IP:$REMOTE_DIR

echo " "
# --- Step 3: Run Application ---
echo "🚀 [3/3] Launching application on VPS..."
ssh $SSH_OPTS $VPS_USER@$VPS_IP << 'ENDSSH'
  cd /var/www/pdi-app
  
  # Setup .env if missing
  if [ ! -f .env ]; then
      cp .env.example .env
      echo "NEXT_PUBLIC_APP_URL=http://197.140.10.216:3000" >> .env
  fi

  # Run Docker Compose
  echo "   -> Building and starting containers..."
  if command -v docker-compose &> /dev/null; then
      docker-compose down
      docker-compose up -d --build
  else
      docker compose down
      docker compose up -d --build
  fi
  
  echo " "
  echo "✅ Deployment Complete!"
  echo "🌎 Access your app at: http://197.140.10.216:3000"
ENDSSH
