FROM python:3.10-slim

# Set working directory
WORKDIR /usr/src/app

# Copy requirements and install them
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your app
COPY . .

# Expose the port
EXPOSE 8001

# Run the FastAPI app
ENTRYPOINT ["python","app.py"]
