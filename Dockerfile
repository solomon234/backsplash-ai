# Multi-stage build for Nuxt.js application with Apache

# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage with Apache
FROM httpd:2.4-alpine

# Copy Apache configuration
RUN echo '\
<VirtualHost *:80>\n\
    DocumentRoot /usr/local/apache2/htdocs\n\
    \n\
    <Directory "/usr/local/apache2/htdocs">\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    \n\
    # Handle SPA routing\n\
    FallbackResource /index.html\n\
</VirtualHost>\n\
' > /usr/local/apache2/conf/extra/httpd-vhosts.conf

# Enable the vhosts configuration
RUN echo 'Include conf/extra/httpd-vhosts.conf' >> /usr/local/apache2/conf/httpd.conf

# Copy the built application from the build stage
COPY --from=build /app/.output/public/ /usr/local/apache2/htdocs/

# Expose port 80
EXPOSE 80

CMD ["httpd-foreground"]