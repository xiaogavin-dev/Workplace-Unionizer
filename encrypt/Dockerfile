# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

#Copy the requirements file
COPY requirements.txt /app/requirements.txt

#Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside the container
EXPOSE 5000

# Define environment variable for Flask
ENV FLASK_APP=wsgi.py

CMD ["gunicorn", "-b", "0.0.0.0:5000", "wsgi:app"]