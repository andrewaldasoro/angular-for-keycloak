################################################################################
# Stage 1 - Build production files
################################################################################

FROM node:16-alpine AS builder

# Create build directory
WORKDIR /app/build

# Copy the repo
COPY . .
        
# Install node modules
RUN npm install

# Make production build
RUN npm run build

################################################################################
# Stage 2 - Make final image
################################################################################

FROM nginx:1.22-alpine

# Copy built files to nginx html root
COPY --from=builder /app/build/dist/ems-ui /usr/share/nginx/html

# Copy nginx config file
COPY --from=builder /app/build/nginx.conf /etc/nginx/nginx.conf

EXPOSE 2804

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
