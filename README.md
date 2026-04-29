## Running the Project with Docker

This project provides a Docker setup for easy local development and deployment. The Docker configuration uses Node.js v22.14.0 and Yarn v4.6.0, as specified in the Dockerfile.

### Requirements
- Docker (latest version recommended)
- Docker Compose (if not included with Docker)

### Environment Variables
- The application supports environment variables via a `.env` file. If you have a `.env` file, you can uncomment the `env_file` line in the `docker-compose.yml` to include it.

### Build and Run Instructions
1. **Build and start the application:**
   ```sh
   docker compose up --build
   ```
   This will build the Docker image and start the Nuxt app in a production-ready container.

2. **Access the app:**
   - The application will be available at [http://localhost:3000](http://localhost:3000)

### Ports
- The Nuxt app is exposed on port **3000** (mapped to your local port 3000).

### Special Configuration
- The Dockerfile creates a non-root user (`appuser`) for improved security.
- No external services (databases, caches) are required for this project.
- No persistent volumes are needed; the app is stateless by default.

---

_Refer to the Dockerfile and `docker-compose.yml` for further customization as needed._
