FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
# netcat is useful for checking if db is up
RUN apt-get update && apt-get install -y \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Command to run initialization then the app
# Use shell form to allow && execution
CMD ["sh", "-c", "python init_backend.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
