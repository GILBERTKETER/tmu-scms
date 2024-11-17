FROM python:3.11-slim

ENV DJANGO_SETTINGS_MODULE=smartcampusBackend.settings

# Install system dependencies
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    pkg-config \
    build-essential \
    libffi-dev \
    libssl-dev \
    redis-tools \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

# Environment variables for database and Redis
ENV NAME="SmartCampus" \
    RESEND_API_KEY="re_7NTdX12j_BEBuasWwELRx7DFa9JppYao9" \
    DBNAME="scms" \
    USERNAME="root" \
    DB_PASSWORD="" \
    HOST="db" \
    PORT=3306 \
    REDIS_URL="redis://default:yqZZNvUTUG2dU2mr@gilbert-keter-redis-cbb9d9:6379"

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8080

COPY --chown=myuser:myuser entrypoint.sh .
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
