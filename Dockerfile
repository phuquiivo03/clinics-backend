FROM oven/bun:1

WORKDIR /app

# Install Python and build essentials
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

EXPOSE 3000

# Start the application directly with TypeScript
CMD ["bun", "run", "start"]