# Use Python base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements first
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install bcrypt

# Copy the rest of your code
COPY . /app
RUN pip show openai

# Expose and run
EXPOSE 5000
CMD ["python", "main.py"]
