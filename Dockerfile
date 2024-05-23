# Use an official Python runtime as the base image
FROM python:3.12.2-slim-bullseye

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Instalation of port forwarder.
RUN apt-get update && apt-get install -y gunicorn

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install system dependencies
RUN apt-get update && apt-get install -y pdf2svg
# TODO: Implement font-forge for instalation
RUN apt-get update && apt-get install -y fontforge


# Install Node.js and npm
RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs
# Change to the specific directory
WORKDIR /app/font_extractor/svg_parser/mat-js
#Install project-specific Node.js dependencies;
RUN npm install
#Set the working directory back to the main project directory
WORKDIR /app

# Make port 5000 available to the world outside this container | $PORT
EXPOSE $PORT

# Define environment variable
ENV FLASK_APP app.py
ENV FLASK_RUN_HOST 0.0.0.0

# Run app.py when the container launches
# CMD ["flask", "run"]

# gunciorn port bind + run
CMD gunicorn --workers=4 --bind 0.0.0.0:$PORT app:app