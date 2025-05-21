FROM php:8.3-fpm-alpine

WORKDIR /var/www
# Установка зависимостей
RUN docker-php-ext-install pdo pdo_mysql
