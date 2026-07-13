FROM php:8.4-cli-alpine

# Install system dependencies
RUN apk add --no-cache \
    postgresql-dev \
    git \
    unzip \
    libzip-dev \
    zip \
    bash

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql pgsql zip

# Get latest Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
