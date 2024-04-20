# Use an official Python runtime as the base image
FROM python:3.12.2-slim-bullseye

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install system dependencies
RUN apt-get update && apt-get install -y pdf2svg
# TODO: Implement font-forge for instalation
RUN apt-get update && apt-get install -y fontforge

# Make port 5000 available to the world outside this container | $PORT
EXPOSE $PORT

# Define environment variable
ENV FLASK_APP app.py
ENV FLASK_RUN_HOST 0.0.0.0

# Run app.py when the container launches
CMD ["flask", "run"]

#TODO: add gunciorn(?)
# CMD gunicorn --workers=4 --bind 0.0.0.0:$PORT app:app