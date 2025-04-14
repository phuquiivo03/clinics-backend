FROM oven/bun:1

WORKDIR /app

# Install Python and build essentials => for tree-sitter library (swagger-jsdoc)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    python3-dev \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

# Configure Python for node-gyp
RUN ln -s /usr/bin/python3 /usr/bin/python

# Install node-gyp globally
RUN bun install -g node-gyp

# Set environment variables for node-gyp
ENV NODE_OPTIONS=--max_old_space_size=4096
ENV npm_config_napi_build_version=4
ENV npm_config_build_from_source=false
ENV PATH="/root/.bun/bin:${PATH}"

# Copy package files
COPY package.json ./

# Install dependencies with --no-optional to skip optional dependencies
RUN bun install --no-optional

# Copy source code
COPY . .

EXPOSE 3000

# Start the application directly with TypeScript
CMD ["bun", "run", "start"]