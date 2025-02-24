#!/bin/bash

# Run migrations
echo "Running migrations..."
flask db upgrade

# Start uWSGI
echo "Starting uWSGI..."
exec uwsgi --ini uwsgi.ini
