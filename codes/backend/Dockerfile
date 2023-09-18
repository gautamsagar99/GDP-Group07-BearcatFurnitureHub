# Use an official Node.js runtime as a parent image 
FROM node:14 

# Set the working directory in the container 
WORKDIR /app 

# Copy package.json and package-lock.json to the container 
COPY package*.json ./ 

# Install application dependencies 
RUN npm install 

# Copy the rest of the application code 
COPY . . 

# Expose the port your application runs on 
EXPOSE 5000 

# Define the command to run your application 
CMD ["npm", "start"] 