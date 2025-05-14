
echo "Ensuring Docker Desktop is running..."
if ! docker info &>/dev/null; then
  echo "Starting Docker Desktop..."
  open -a Docker
  echo "Waiting for Docker to start..."
  sleep 10  
  
  # Check if Docker is running now
  if ! docker info &>/dev/null; then
    echo "Docker is still starting. Please wait a moment and try again."
    exit 1
  fi
fi

echo "Building Docker image..."
docker build -t content-acquisition-crawler .


echo "Running Docker container..."
docker run -p 3000:3000 content-acquisition-crawler


echo "Or use docker-compose:"
echo "docker-compose up --build"


echo "
Tips:
- Access the application at http://localhost:3000
- To run in background: docker-compose up -d
- To stop containers: docker-compose down
- For development mode, consider adding a development service in docker-compose.yml
"
