set -euo pipefail

PROJECT_DIR="/Users/sachin/Documents/SSH_WEB/form-web-application/frontend"
SERVICE_NAME="form-frontend"
CONTAINER_NAME="react-prod"
PROFILE="prod"

cd "$PROJECT_DIR"

echo "🐳 Starting React app update process..."

# --- Check if Docker is running ---
if ! docker info >/dev/null 2>&1; then.
  echo "❌ Docker daemon is not running. Please start Docker Desktop first."
  exit 1
fi

# --- Backup existing container (if running) ---
if docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}\$"; then
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  BACKUP_NAME="${CONTAINER_NAME}_backup_${TIMESTAMP}"
  echo "📦 Backing up existing container as: $BACKUP_NAME"
  docker rename "$CONTAINER_NAME" "$BACKUP_NAME"
fi

# --- Remove old conflicting containers (auto-named by Compose) ---
if docker ps -a --format '{{.Names}}' | grep -q "${SERVICE_NAME}"; then
  echo "🗑 Removing old containers named like: ${SERVICE_NAME}*"
  docker rm -f $(docker ps -a --format '{{.Names}}' | grep "${SERVICE_NAME}") || true
fi

# --- Build & start with correct container name ---
echo "🔨 Rebuilding and restarting $SERVICE_NAME as $CONTAINER_NAME..."
docker compose --profile "$PROFILE" up -d --build

echo "✅ Update complete! Container '$CONTAINER_NAME' is now running."
