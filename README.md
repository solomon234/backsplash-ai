# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Docker with Apache

This project includes a Dockerfile to run the Nuxt application in an Apache server.

### Building the Docker Image

```bash
# Build the Docker image
docker build -t nuxt-apache-app .
```

### Running the Docker Container

```bash
# Run the container and map port 8080 to container's port 80
docker run -p 8080:80 nuxt-apache-app
```

Then access the application at `http://localhost:8080`

### Docker Configuration Details

The Dockerfile uses a multi-stage build process:

1. **Build Stage**: Uses Node.js to build the Nuxt.js application
   - Installs dependencies
   - Builds the application using `npm run build`

2. **Production Stage**: Uses Apache to serve the built application
   - Configures Apache to handle SPA routing
   - Copies the built application from the build stage
