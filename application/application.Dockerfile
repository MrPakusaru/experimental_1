FROM php:8.3-fpm

# Установка зависимостей
RUN apt-get update && apt-get install -y \
    libzip-dev \
    && docker-php-ext-install pdo_mysql zip

WORKDIR /var/www

# Копирование файлов, сразу назначая владельца www-data
COPY --chown=www-data:www-data ./laravel .

# Настройка прав для папок кэша и логов
RUN chmod -R 775 storage bootstrap/cache

# Переключение на пользователя www-data
USER www-data
