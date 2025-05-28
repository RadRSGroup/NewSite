# Static site Dockerfile - serves files from web/public
FROM nginx:alpine

# Install required system libraries
RUN apk add --no-cache \
    ca-certificates \
    tzdata \
    curl \
    && rm -rf /var/cache/apk/*

# Copy static files from web/public to nginx html directory
COPY web/public /usr/share/nginx/html

# Copy root level static files as well
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY images /usr/share/nginx/html/images
COPY favicon.ico /usr/share/nginx/html/
COPY index.html /usr/share/nginx/html/
COPY particle-tool.html /usr/share/nginx/html/

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create necessary directories and set permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run \
    && chown -R nginx:nginx /var/cache/nginx /var/log/nginx /var/run \
    && chmod -R 755 /var/cache/nginx /var/log/nginx /var/run

# Set timezone
ENV TZ=UTC

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]