# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    gcc \
    python3-dev \
    curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create log directory for uWSGI
RUN mkdir -p /var/log/uwsgi && chmod 777 /var/log/uwsgi

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

RUN chmod +x ./docker-entrypoint.sh